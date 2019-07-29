(function() {
  'use strict';

  var loadingElm = document.querySelector('.sals_video_loading');


  window.onload = function() {

    // play video based on current time
    var playVideo = function(video, adDuration = 0) {
      var playTime = 0;
      var startTime = video.getAttribute('data-videostart');
      var playerScriptElm = document.getElementById('sals_video_player_prev_script');
      var ajaxurl = '';
      if (playerScriptElm) {
        ajaxurl = decodeURI(playerScriptElm.src).split('ajaxUrl=')[1].split('&')[0];

      } else {
        ajaxurl = sals.ajaxurl;
      }

      if (window.XMLHttpRequest) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            playTime = this.responseText;
            video.currentTime = parseInt(playTime - adDuration);
            video.play();
          }
        }
        // confirmMetaData for load metatada such as duration on mobile
        var confirmMetaData = setInterval(function() {
          if (video.readyState === 4) {
            clearInterval(confirmMetaData);

            var ajaxURLFields = '?action=sals_play_time&starttime=' + startTime +
              '&duration=' + video.duration;
            xhttp.open("GET", ajaxurl + ajaxURLFields, true); // sals.ajaxurl comes from wp_localize_script function
            xhttp.send();
          }
        }, 200)

      }
    }


    // Does the browser actually support the video element?
    var supportsVideo = !!document.createElement('video').canPlayType;
    if (!supportsVideo) return false;

    // Obtain handles to main elements
    var videoContainer = document.querySelectorAll('.sals_videoContainer');
    var video = document.querySelectorAll('.sals_video');
    var videoControls = document.querySelectorAll('.sals_video-controls');

    // Obtain handles to buttons and other elements
    var playpause = document.querySelectorAll('.sals_playpause');
    var fullscreen = document.querySelectorAll('.sals_fs');
    var volumeController = document.querySelectorAll('.sals_volume__controller');
    var unmuteBtn = document.querySelectorAll('.sals_unmute_btn');
    var volumeIcon = document.querySelectorAll('.sals_volume__icon');

    // Obtain handles to Ads buttons
    var ads = document.querySelectorAll('.sals_ads');

    var sals_liveTime = [],
      increaseTime = [],
      checkAds = [],
      pausedByAd = false;

    for (var uid = 0; uid < videoContainer.length; uid++) {
      videoContainer[uid].setAttribute('data-uid', uid);
      unmuteBtn[uid].setAttribute('data-uid', uid);
      volumeIcon[uid].setAttribute('data-uid', uid);
      video[uid].setAttribute('data-uid', uid);
      playpause[uid].setAttribute('data-uid', uid);
      volumeController[uid].setAttribute('data-uid', uid);
      fullscreen[uid].setAttribute('data-uid', uid);
    }

    for (var i = 0; i < videoContainer.length; i++) {
      // custom variables
      var hasFSClassName = 'sals_hasFullscreen';

      // Hide the default controls
      video[i].controls = false;
      video[i].volume = 0.5;
      unmuteBtn[i].style.display = 'none';


      // hide loading
      loadingElm.style.display = 'none';

      videoContainer[i].oncontextmenu = function() {
        return false;
      }

      // fix height of video ad
      ads[i].style.height = videoContainer[i].clientHeight + "px"

      // Display the user defined video controls
      videoControls[i].setAttribute('data-state', 'visible');

      // Control volumechange
      volumeController[i].addEventListener('click', function(e) {
        var uid = this.getAttribute('data-uid');
        var pointerElm = this.querySelector('.sals_volume__pointer');
        var pos = e.pageX - this.getBoundingClientRect().left;
        volumeIcon[uid].setAttribute('data-state', 'unmuted');
        unmuteBtn[uid].style.display = 'none';

        if (pos) {
          video[uid].volume = pos / 100;
          pointerElm.style.left = pos + "px"
        }
      })

      // Check if the browser supports the Fullscreen API
      var fullScreenEnabled = !!(document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled ||
        document.webkitSupportsFullscreen ||
        document.webkitFullscreenEnabled ||
        document.createElement('video').webkitRequestFullScreen);
      // If the browser doesn't support the Fulscreen API then hide the fullscreen button
      if (!fullScreenEnabled) {
        fullscreen[i].style.display = 'none';
      }


      // Checks if the document is currently in fullscreen mode
      var isFullScreen = function() {
        return !!(document.fullScreen ||
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullscreenElement ||
          document.fullscreenElement);
      }

      // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
      if (document.addEventListener) {

        // Add event listeners for video specific events
        video[i].addEventListener('play', function() {
          var uid = this.getAttribute('data-uid')
          changeButtonState('playpause', uid);

          // play action
          clearInterval(increaseTime[uid])


          // var playTime = parseFloat(sessionStorage.getItem('playTime-' + uid));
          // if (!playTime) {
          //   video[uid].currentTime = sals_liveTime[uid];
          // } else {
          //   video[uid].currentTime = playTime;
          // }

          checkAds[uid] = setInterval(function() {
            if (Math.floor(video[uid].duration) > video[uid].currentTime) {
              adToggle(video[uid].currentTime, uid)
            } else {
              clearInterval(checkAds[uid]);
              return;
            }
          }, 1000);


        }, false);

        video[i].addEventListener('pause', function() {
          var uid = this.getAttribute('data-uid');
          changeButtonState('playpause', uid);

          // pause action
          clearInterval(checkAds[uid]);
          sals_liveTime[uid] = video[uid].currentTime;

          if (!pausedByAd) {
            increaseTime[uid] = setInterval(function() {
              if (Math.floor(video[uid].duration) > sals_liveTime[uid]) {
                adToggle(sals_liveTime[uid], uid)
                sals_liveTime[uid] += 1
              } else {
                clearInterval(increaseTime[uid]);
                return;
              }
            }, 1000)
          }
        }, false);

        video[i].addEventListener('ended', function() {
          var uid = this.getAttribute('data-uid');
          playVideo(video[uid]);
        })

        // Add events for all buttons
        sals_liveTime.push(0);
        increaseTime.push('');
        checkAds.push('');

        playpause[i].addEventListener('click', function(e) {
          var uid = this.getAttribute("data-uid");
          if (video[uid].paused || video[uid].ended) {
            playVideo(video[uid]);
          } else {
            video[uid].pause();
          }

        });

        fullscreen[i].addEventListener('click', function(e) {
          var fuid = this.getAttribute('data-uid');
          // vertically center video
          handleFullscreen(fuid);
        });
        volumeIcon[i].addEventListener('click', function() {
          var uid = this.getAttribute('data-uid');
          if (this.getAttribute('data-state') !== 'muted') {
            video[uid].muted = true;
            this.setAttribute('data-state', 'muted')
          } else {
            video[uid].muted = false;
            this.setAttribute('data-state', 'unmuted');
            unmuteBtn[uid].style.display = 'none';
          }
        })
      }

      if (i === 0) {
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome) {
          video[i].muted = true;
          unmuteBtn[i].style.display = 'block';
          unmuteBtn[i].addEventListener('click', function() {
            var uid = this.getAttribute('data-uid');
            video[uid].muted = false;
            unmuteBtn[uid].style.display = 'none';
            volumeIcon[uid].setAttribute('data-state', 'unmuted')
          })
        }
        playVideo(video[i]);
      }
    }

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


    // custom functions

    // Changes the button state of certain button's so the correct visuals can be displayed with CSS
    var changeButtonState = function(type, uid) {
      // Play/Pause button
      if (type == 'playpause') {
        if (video[uid].paused || video[uid].ended) {
          playpause[uid].setAttribute('data-state', 'play');
        } else {
          pausedByAd = false;
          playpause[uid].setAttribute('data-state', 'pause');
        }
      }
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
    var adToggle = function(sals_liveTime, uid) {

      var singleAdStartElm = ads[uid]
        .querySelector("[data-adstart='" + Math.floor(sals_liveTime) + "']");

      // save paused time into session storage
      // if (typeof(Storage) !== 'undefined') {
      //   sessionStorage.setItem('playTime-' + uid, Math.floor(sals_liveTime));
      // }
      // var playTime = parseFloat(sessionStorage.getItem('playTime-' + uid));

      if (singleAdStartElm) {
        // video of Ad which is streaming now
        var adVideo = singleAdStartElm.querySelector('.sals__video_ad');
        var skipBtnElm = singleAdStartElm.querySelector('.sals__skip_btn');
        var counter = 5;

        if (singleAdStartElm.getAttribute('data-addisplayed') !== "true") {
          // display ads pause main video
          singleAdStartElm.setAttribute('data-addisplayed', true)

          if (!video[uid].paused || !video[uid].ended) {
            clearInterval(increaseTime[uid]);
            video[uid].pause();
            pausedByAd = true;
          }

          ads[uid].style.display = 'block'
          singleAdStartElm.style.display = 'block'
          adVideo.volume = video[uid].volume
          adVideo.play()
          // after ads video ended
          adVideo.addEventListener('ended', function() {
            ads[uid].style.display = 'none';
            singleAdStartElm.style.display = 'none';
            playVideo(video[uid], adVideo.duration);
          })

          // skip button handler
          var skipTimer = setInterval(function() {
            counter--
            if (counter === 0) {
              clearInterval(skipTimer)
              skipBtnElm.innerHTML = "Skip Now"

              // click on skip button
              skipBtnElm.addEventListener('click', function() {
                adVideo.pause();
                ads[uid].style.display = 'none';
                singleAdStartElm.style.display = 'none';
                playVideo(video[uid], adVideo.currentTime);
                adVideo.currentTime = 0;
              })

            } else {
              skipBtnElm.innerHTML = "Skip in " + counter + "s"
            }
          }, 1000)


        }
      }
    }

    var getVcuid = function(elm) {
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

  }

})();