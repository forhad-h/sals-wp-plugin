(function() {
  'use strict';

  // Does the browser actually support the video element?
  var supportsVideo = !!document.createElement('video').canPlayType;

  if (supportsVideo) {
    // Obtain handles to main elements
    var videoContainer = document.querySelectorAll('.sals_videoContainer');
    var video = document.querySelectorAll('.sals_video');
    var videoControls = document.querySelectorAll('.sals_video-controls');

    // Obtain handles to buttons and other elements
    var playpause = document.querySelectorAll('.sals_playpause');
    var fullscreen = document.querySelectorAll('.sals_fs');
    var volumeController = document.querySelectorAll('.sals_volume__controller');

    // Obtain handles to Ads buttons
    var ads = document.querySelectorAll('.sals_ads');

    var sals_liveTime = [],
      increaseTime = [],
      checkAds = [],
      pausedByAd = false;

    for (var uid = 0; uid < videoContainer.length; uid++) {
      videoContainer[uid].setAttribute('data-uid', uid)
      video[uid].setAttribute('data-uid', uid)
      playpause[uid].setAttribute('data-uid', uid)
      volumeController[uid].setAttribute('data-uid', uid)
      fullscreen[uid].setAttribute('data-uid', uid)
    }

    for (var i = 0; i < videoContainer.length; i++) {
      // custom variables
      var hasFSClassName = 'sals_hasFullscreen';

      // Hide the default controls
      video[i].controls = false;
      video[i].volume = 0.5;

      // fix height of video ad
      ads[i].style.height = videoContainer[i].clientHeight + "px"

      // Display the user defined video controls
      videoControls[i].setAttribute('data-state', 'visible');

      // Control volumechange
      volumeController[i].addEventListener('click', function(e) {
        var vluid = this.getAttribute('data-uid')
        var pointerElm = this.querySelector('.sals_volume__pointer')
        var pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetParent.offsetLeft)) / this.offsetWidth;
        if (pos < 1) {
          video[vluid].volume = pos;
          pointerElm.style.left = (pos * 100) + "px"
        }
      })





      // Check if the browser supports the Fullscreen API
      var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
      // If the browser doesn't support the Fulscreen API then hide the fullscreen button
      if (!fullScreenEnabled) {
        fullscreen[i].style.display = 'none';
      }


      // Set the video container's fullscreen state
      var setFullscreenData = function(state, vcuid) {
        if (vcuid) {
          ads[vcuid].style.height = videoContainer[vcuid].clientHeight + "px"
          if (!(!!state)) {
            videoContainer[vcuid].classList.remove(hasFSClassName)
          }
          videoContainer[vcuid].setAttribute('data-fullscreen', !!state);
          // Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
          fullscreen[vcuid].setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
        }
      }

      // Checks if the document is currently in fullscreen mode
      var isFullScreen = function() {
        return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
      }

      // Fullscreen
      var handleFullscreen = function(fuid) {
        // If fullscreen mode is active...
        if (isFullScreen()) {
          // ...exit fullscreen mode
          // (Note: this can only be called on document)
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
          setFullscreenData(false);
          video[fuid].style.marginTop = "0px"
        } else {
          // ...otherwise enter fullscreen mode
          // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
          if (videoContainer[fuid].requestFullscreen) videoContainer[fuid].requestFullscreen();
          else if (videoContainer[fuid].mozRequestFullScreen) videoContainer[fuid].mozRequestFullScreen();
          else if (videoContainer[fuid].webkitRequestFullScreen) {
            // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
            // ensures that our custom controls are visible:
            // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
            // figure[data-fullscreen=true] .controls { z-index:2147483647; }
            video[fuid].webkitRequestFullScreen();
          } else if (videoContainer[fuid].msRequestFullscreen) videoContainer[fuid].msRequestFullscreen();
          setFullscreenData(true);
          setTimeout(function() {
            if (videoContainer[fuid].clientHeight > video[fuid].clientHeight) {
              video[fuid].style.marginTop = (videoContainer[fuid].clientHeight - video[fuid].clientHeight) / 2 + "px";
            }
          }, 500)
        }
      }
      // display or hide Ads

      var adToggle = function(state, sals_liveTime, puid) {

        var singleAdStartElm = ads[puid]
          .querySelector("[data-adstart='" + Math.floor(sals_liveTime) + "']");

        // save paused time into session storage
        if (typeof(Storage) !== 'undefined') {
          sessionStorage.setItem('playTime-' + puid, Math.floor(sals_liveTime));
        }
        var playTime = parseFloat(sessionStorage.getItem('playTime-' + puid));

        if (singleAdStartElm) {
          // video of Ad which is streaming now
          var adVideo = singleAdStartElm.querySelector('.sals__video_ad');
          var skipBtnElm = singleAdStartElm.querySelector('.sals__skip_btn');
          var counter = 5;

          if (singleAdStartElm.getAttribute('data-addisplayed') !== "true") {
            // display ads pause main video
            singleAdStartElm.setAttribute('data-addisplayed', true)

            if (!video[puid].paused || !video[puid].ended) {
              clearInterval(increaseTime[puid]);
              video[puid].pause();
              pausedByAd = true;
            }

            ads[puid].style.display = 'block'
            singleAdStartElm.style.display = 'block'
            adVideo.volume = video[puid].volume
            adVideo.play()
            // after ads video ended
            adVideo.addEventListener('ended', function() {
              ads[puid].style.display = 'none';
              singleAdStartElm.style.display = 'none';
              video[puid].play()
            })

            // skip button handler
            var skipTimer = setInterval(function() {
              counter--
              if (counter === 0) {
                clearInterval(skipTimer)
                skipBtnElm.innerHTML = "Skip Now"

                // click on skip button
                skipBtnElm.addEventListener('click', function() {
                  adVideo.pause()
                  adVideo.currentTime = 0
                  ads[puid].style.display = 'none'
                  singleAdStartElm.style.display = 'none'
                  video[puid].play()
                })

              } else {
                skipBtnElm.innerHTML = "Skip " + counter + "s"
              }
            }, 1000)


          }
        }
      }

      // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
      if (document.addEventListener) {

        // Changes the button state of certain button's so the correct visuals can be displayed with CSS
        var changeButtonState = function(type, vuid) {
          // Play/Pause button
          if (type == 'playpause') {
            if (video[vuid].paused || video[vuid].ended) {
              playpause[vuid].setAttribute('data-state', 'play');
            } else {
              pausedByAd = false;
              playpause[vuid].setAttribute('data-state', 'pause');
            }
          }
        }

        // Add event listeners for video specific events
        video[i].addEventListener('play', function() {
          var vuid = this.getAttribute('data-uid')
          changeButtonState('playpause', vuid);

          // play action
          clearInterval(increaseTime[vuid])
          var playTime = parseFloat(sessionStorage.getItem('playTime-' + vuid));
          if (!playTime) {
            video[vuid].currentTime = sals_liveTime[vuid];
          } else {
            video[vuid].currentTime = playTime;
          }

          checkAds[vuid] = setInterval(function() {
            if (Math.floor(video[vuid].duration) > video[vuid].currentTime) {
              adToggle('play', video[vuid].currentTime, vuid)
            } else {
              clearInterval(checkAds[vuid]);
              return;
            }
          }, 1000);


        }, false);

        video[i].addEventListener('pause', function() {
          var vuid = this.getAttribute('data-uid')
          changeButtonState('playpause', vuid);
          // pause action
          clearInterval(checkAds[vuid]);
          sals_liveTime[vuid] = video[vuid].currentTime;

          if (!pausedByAd) {
            increaseTime[vuid] = setInterval(function() {
              if (Math.floor(video[vuid].duration) > sals_liveTime[vuid]) {
                adToggle('pause', sals_liveTime[vuid], vuid)
                sals_liveTime[vuid] += 1
              } else {
                clearInterval(increaseTime[vuid]);
                return;
              }
            }, 1000)
          }
        }, false);

        // Add events for all buttons
        sals_liveTime.push(0);
        increaseTime.push('');
        checkAds.push('');

        playpause[i].addEventListener('click', function(e) {
          var puid = this.getAttribute("data-uid");
          if (video[puid].paused || video[puid].ended) {
            video[puid].play();
          } else {
            video[puid].pause();
          }

        });


        fullscreen[i].addEventListener('click', function(e) {
          var fuid = this.getAttribute('data-uid');
          // vertically center video
          handleFullscreen(fuid);
        });

        // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)

        document.addEventListener('fullscreenchange', function(e) {
          var vcuid = getVcuid(document.fullscreenElement)
          setFullscreenData(!!(document.fullScreen || document.fullscreenElement), vcuid);
        });
        document.addEventListener('webkitfullscreenchange', function() {
          var vcuid = getVcuid(document.webkitFullscreenElement)
          setFullscreenData(!!document.webkitIsFullScreen, vcuid);
        });
        document.addEventListener('mozfullscreenchange', function() {
          var vcuid = getVcuid(document.mozFullScreenElement)
          setFullscreenData(!!document.mozFullScreen, vcuid);
        });
        document.addEventListener('msfullscreenchange', function() {
          var vcuid = getVcuid(document.msFullscreenElement)
          setFullscreenData(!!document.msFullscreenElement, vcuid);
        });
      }
    }
  }
  // custom functions
  function getVcuid(elm) {
    var vcuid;
    if (elm) {
      vcuid = elm.getAttribute('data-uid')
      elm.classList.add(hasFSClassName)
    } else {
      var vcuidElm = document.querySelector('.' + hasFSClassName)
      if (vcuidElm) {
        vcuid = vcuidElm.getAttribute('data-uid')
      }
    }
    return vcuid;
  }

})();