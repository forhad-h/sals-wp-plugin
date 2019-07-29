!(function() {
  // variables fro required elements
  var addWrapperElm = document.querySelector('.sals_ads_wrapper');
  var addNewBtnElm = document.querySelector('.sals_new_ad_btn');
  var adsWrapper = document.querySelector('.sals_ads_wrapper');
  var shortcodeContainerElm = document.querySelector('.sals_shortcode_container');
  var shortcodeGenerateElm = document.querySelector('.sals_generate_btn');
  var previewButton = document.querySelector('.sals_preview_btn');

  var mainVideoURLElm = document.getElementById('main_video_url');
  var mainVideoPosterElm = document.getElementById('main_video_poster');
  var videoStartDatetimeElm = document.getElementById('video_start_datetime');
  var videoPlaceholderElm = document.getElementById('video_placeholder');

  var videoInfoElm = document.getElementById('video_info');

  var controlPlaypauseElm = document.getElementById('control_playpause');
  var controlSoundElm = document.getElementById('control_sound');
  var controlVolumeElm = document.getElementById('control_volume');
  var controlLiveElm = document.getElementById('control_live');
  var controlFullscreenElm = document.getElementById('control_fullscreen');

  var serialNo = 0;

  if (addNewBtnElm) {
    addNewBtnElm.addEventListener('click', function() {
      serialNo++;
      return makeAdSection(serialNo);
    });
  }

  if (shortcodeGenerateElm) {
    shortcodeGenerateElm.addEventListener('click', function() {
      return addShortcode();
    })
  }
  if (previewButton) {
    previewButton.addEventListener('click', function() {
      var attr = getAttr();
      if (validateInput(attr)) {
        window.open(getPrivewLink(attr), '_blank');
      } else return;
    });
  }

  if (shortcodeContainerElm) {
    shortcodeContainerElm.addEventListener('click', function() {
      this.select();
    })
  }

  var date = new Date();
  var DateTimeISONow = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString();
  var DateTimeArr = DateTimeISONow.split(':');
  DateTimeArr.pop()
  DateTimeISONow = DateTimeArr.join(':')
  if (videoStartDatetimeElm) {
    videoStartDatetimeElm.value = DateTimeISONow;
  }

  function makeAdSection(serial) {
    // make options elements

    // single ad wrapper
    var singleAd = document.createElement('div')
    var singleAdClassAttr = document.createAttribute('class')
    singleAdClassAttr.value = 'sals_single_ad'
    singleAd.setAttributeNode(singleAdClassAttr)

    // url title
    var urlTitle = document.createElement('h4')
    var urlTitleText = document.createTextNode("Ad's video URL *")
    urlTitle.appendChild(urlTitleText)

    // url input
    var urlInput = document.createElement('input')
    var urlInputTypeAttr = document.createAttribute('type')
    urlInputTypeAttr.value = 'text'
    urlInput.setAttributeNode(urlInputTypeAttr)
    var urlInputNameAttr = document.createAttribute('name')
    urlInputNameAttr.value = 'sals_ad_url[]'
    urlInput.setAttributeNode(urlInputNameAttr)
    var urlInputClassAttr = document.createAttribute('class')
    urlInputClassAttr.value = 'sals_ad_url'
    urlInput.setAttributeNode(urlInputClassAttr)


    var urlInputRequiredAttr = document.createAttribute('data-required')
    urlInputRequiredAttr.value = 'true'
    urlInput.setAttributeNode(urlInputRequiredAttr)

    // start time title
    var startTimeTitle = document.createElement('h4')
    var startTimeTitleText = document.createTextNode("Ad's start time (in second) *")
    startTimeTitle.appendChild(startTimeTitleText)

    // start time input
    var startTimeInput = document.createElement('input')
    var startTimeInputTypeAttr = document.createAttribute('type')
    startTimeInputTypeAttr.value = 'number'
    startTimeInput.setAttributeNode(startTimeInputTypeAttr)
    var startTimeInputNameAttr = document.createAttribute('name')
    startTimeInputNameAttr.value = 'sals_ad_start_time[]'
    startTimeInput.setAttributeNode(startTimeInputNameAttr)
    var startTimeInputClassAttr = document.createAttribute('class')
    startTimeInputClassAttr.value = 'sals_ad_start_time'
    startTimeInput.setAttributeNode(startTimeInputClassAttr)

    var startTimeInputRequiredAttr = document.createAttribute('data-required')
    startTimeInputRequiredAttr.value = 'true'
    startTimeInput.setAttributeNode(startTimeInputRequiredAttr)

    // close button
    var closeButton = document.createElement('button');
    var closeButtonText = document.createTextNode('x');
    closeButton.appendChild(closeButtonText)
    var closeButtonClassAttr = document.createAttribute('class');
    closeButtonClassAttr.value = 'sals_close_btn scb_' + serialNo;
    closeButton.setAttributeNode(closeButtonClassAttr);
    var closeButtonTypeAttr = document.createAttribute('type');
    closeButtonTypeAttr.value = 'button';
    closeButton.setAttributeNode(closeButtonTypeAttr);




    // push options elements
    singleAd.appendChild(urlTitle);
    singleAd.appendChild(urlInput);
    singleAd.appendChild(startTimeTitle);
    singleAd.appendChild(startTimeInput);
    singleAd.appendChild(closeButton);
    adsWrapper.appendChild(singleAd);

    // close button handler
    var closeBtnElm = document.querySelector('.scb_' + serialNo);
    closeBtnElm.addEventListener('click', function() {
      this.parentNode.remove()
    })
  }

  function addShortcode() {
    var attr = getAttr();
    shortcodeContainerElm.value = generateShortcode(attr);
  }

  function generateShortcode(attr) {
    if (validateInput(attr)) {
      var shortcode = '';
      shortcode += '[sals-video ';
      shortcode += 'main_video_url="' + attr.mUrl + '" ';
      shortcode += 'main_video_poster="' + attr.mPoster + '" ';
      shortcode += 'video_start_time="' + attr.vStart + '" ';
      shortcode += 'video_placeholder="' + attr.vPlaceholder + '" ';
      shortcode += 'video_info="' + attr.vInfo + '" ';

      shortcode += 'control_playpause="' + attr.cPP + '" ';
      shortcode += 'control_sound="' + attr.cSound + '" ';
      shortcode += 'control_volume="' + attr.cVolume + '" ';
      shortcode += 'control_live="' + attr.cLive + '" ';
      shortcode += 'control_fullscreen="' + attr.cFs + '" ';

      shortcode += 'ad_video_urls="' + attr.aUrls.join(',') + '" ';
      shortcode += 'ad_start_times="' + attr.aStarts.join(',') + '" ';
      shortcode += ']';

      return shortcode
    }
    return '';
  }


  function getPrivewLink(attr) {
    var mUrl = encodeURIComponent(attr.mUrl) || '%27%27'
    var link = '';
    link += sals.previewPage;
    link += '?main_video_url=' + (encodeURIComponent(attr.mUrl) || '%27%27');
    link += '&main_video_poster=' + (encodeURIComponent(attr.mPoster) || '%27%27');
    link += '&video_start_time=' + (attr.vStart || '%27%27');
    link += '&video_placeholder=' + (attr.vPlaceholder || '%27%27');
    link += '&video_info=' + (attr.vInfo || '%27%27');
    link += '&control_playpause=' + (attr.cPP || false);
    link += '&control_sound=' + (attr.cSound || false);
    link += '&control_volume=' + (attr.cVolume || false);
    link += '&control_live=' + (attr.cLive || false);
    link += '&control_fullscreen=' + (attr.cFs || false);
    link += '&ad_video_urls=' + (encodeURIComponent(attr.aUrls) || '%27%27');
    link += '&ad_start_times=' + (attr.aStarts || '%27%27');

    return link + "/";
  }

  function getAttr() {

    var singleAdElms = document.querySelectorAll('.sals_single_ad');

    // variables for shortcode values
    var mainVideoURL = '';
    var mainVideoPoster = '';
    var adsVideoURLs = [];
    var adsVideoStartTimes = [];

    mainVideoURL = mainVideoURLElm.value;
    mainVideoPoster = mainVideoPosterElm.value;
    videoStartDatetime = new Date(videoStartDatetimeElm.value).getTime() / 1000;
    videoPlaceholder = videoPlaceholderElm.value;
    videoInfo = videoInfoElm.value;
    controlPlaypause = controlPlaypauseElm.checked;
    controlSound = controlSoundElm.checked;
    controlVolume = controlVolumeElm.checked;
    controlLive = controlLiveElm.checked;
    controlFullscreen = controlFullscreenElm.checked;

    for (var j = 0; j < singleAdElms.length; j++) {
      var adURLElm = singleAdElms[j].querySelector('.sals_ad_url');
      var adStartTimeElm = singleAdElms[j].querySelector('.sals_ad_start_time');
      if (adURLElm.value) {
        adsVideoURLs.push(adURLElm.value)
      }
      if (adStartTimeElm.value) {
        adsVideoStartTimes.push(adStartTimeElm.value)
      }
    }

    return {
      mUrl: mainVideoURL,
      mPoster: mainVideoPoster,
      vStart: videoStartDatetime,
      vPlaceholder: videoPlaceholder,
      vInfo: videoInfo,
      cPP: controlPlaypause,
      cSound: controlSound,
      cVolume: controlVolume,
      cLive: controlLive,
      cFs: controlFullscreen,
      aUrls: adsVideoURLs,
      aStarts: adsVideoStartTimes
    }

  }

  function validateInput(attr) {
    // just checking is any field value is empty
    var singleAdElm = document.querySelectorAll('.sals_single_ad');
    var allInputs = document.querySelectorAll('#sals_video_options_form input');

    if (
      !attr.mUrl || !attr.mPoster || !attr.vStart ||
      (singleAdElm.length > 0 &&
        (attr.aUrls.length <= 0 || attr.aStarts.length <= 0)) ||
      singleAdElm.length !== attr.aUrls.length ||
      singleAdElm.length !== attr.aStarts.length
    ) {

      for (var i = 0; i < allInputs.length; i++) {
        if (!allInputs[i].value) {
          if (allInputs[i].getAttribute('data-required') === 'true') {
            allInputs[i].classList.add('sals_error_field')
          }
        }

        allInputs[i].addEventListener('input', function() {
          this.classList.remove('sals_error_field')
        })
      }
      return false;
    }
    if (date.getTime() > new Date(videoStartDatetimeElm.value).getTime()) {
      videoStartDatetimeElm.classList = 'sals_error_field';
      videoStartDatetimeElm.addEventListener('input', function() {
        this.classList.remove('sals_error_field');
      })
      return false;
    }
    return true;
  }

})()