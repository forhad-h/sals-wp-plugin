!(function() {
  var vsOptionsAreaElm = document.querySelector('.vs_options_area');
  // variables form required elements
  var addWrapperElm = document.querySelector('.vs_ads_wrapper');
  var addNewBtnElm = document.querySelector('.vs_new_ad_btn');
  var adsWrapper = document.querySelector('.vs_ads_wrapper');
  var shortcodeContainerElm = document.querySelector('.vs_shortcode_container');
  var shortcodeGenerateElm = document.querySelector('.vs_generate_btn');
  var previewButton = document.querySelector('.vs_preview_btn');

  var mainVideoURLElm = document.getElementById('main_video_url');
  var mainVideoPosterElm = document.getElementById('main_video_poster');
  var videoStartDatetimeElm = document.getElementById('video_start_datetime');
  var videoPlaceholderElm = document.getElementById('video_placeholder');

  var videoInfoElm = document.getElementById('video_info');

  var controlPlaypauseElm = document.getElementById('control_playpause');
  var controlSoundElm = document.getElementById('control_sound');
  var controlVolumeElm = document.getElementById('control_volume');
  var controlFullscreenElm = document.getElementById('control_fullscreen');

  /* Video Type */
  var videoTypeElm = document.querySelector('.video_type');
  var selfHosted = 'self-hosted'
  var youtube = 'youtube'
  var vimeo = 'vimeo'
  var videoType = selfHosted // default value should be self-hosted


  videoTypeElm.addEventListener('change', function(event) {
    switch (event.target.value) {
      case selfHosted:
        mainVideoURLElm.setAttribute('placeholder', 'Enter your Self-hosted video URL');
        videoType = selfHosted;
        break;
      case youtube:
        mainVideoURLElm.setAttribute('placeholder', 'Enter your Youtube video URL');
        videoType = youtube;
        break;
      case vimeo:
        mainVideoURLElm.setAttribute('placeholder', 'Enter your Vimeo video URL');
        videoType = vimeo;
        break;
      default:
        return;
    }
  })

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
      var attr = getInputs();
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

  /*
   * Remove error class and message when input
   */
  vsOptionsAreaElm.addEventListener('input', function(event) {
    if (event.target.classList.contains('vs_error_field')) {
      event.target.classList.remove('vs_error_field')
    }
  })

  function makeAdSection(serial) {
    // make options elements

    // single ad wrapper
    var singleAd = document.createElement('div')
    var singleAdClassAttr = document.createAttribute('class')
    singleAdClassAttr.value = 'vs_single_ad'
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
    urlInputNameAttr.value = 'vs_ad_url[]'
    urlInput.setAttributeNode(urlInputNameAttr)
    var urlInputClassAttr = document.createAttribute('class')
    urlInputClassAttr.value = 'vs_ad_url'
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
    startTimeInputNameAttr.value = 'vs_ad_start_time[]'
    startTimeInput.setAttributeNode(startTimeInputNameAttr)
    var startTimeInputClassAttr = document.createAttribute('class')
    startTimeInputClassAttr.value = 'vs_ad_start_time'
    startTimeInput.setAttributeNode(startTimeInputClassAttr)

    var startTimeInputRequiredAttr = document.createAttribute('data-required')
    startTimeInputRequiredAttr.value = 'true'
    startTimeInput.setAttributeNode(startTimeInputRequiredAttr)

    // close button
    var closeButton = document.createElement('button');
    var closeButtonText = document.createTextNode('x');
    closeButton.appendChild(closeButtonText)
    var closeButtonClassAttr = document.createAttribute('class');
    closeButtonClassAttr.value = 'vs_close_btn scb_' + serialNo;
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

  // Display shortcode
  function addShortcode() {
    var attr = getInputs();
    shortcodeContainerElm.value = generateShortcode(attr);
  }

  /*
   * Shortcode generator function
   */
  function generateShortcode(attr) {
    if (validateInput(attr)) {
      var shortcode = '';
      shortcode += '[vs-video ';
      shortcode += 'video_type="' + videoType + '" ';
      shortcode += 'main_video_url="' + attr.mUrl + '" ';
      shortcode += 'main_video_poster="' + attr.mPoster + '" ';
      shortcode += 'video_start_time="' + attr.vStart + '" ';
      shortcode += 'video_placeholder="' + attr.vPlaceholder + '" ';
      shortcode += 'video_info="' + attr.vInfo + '" ';

      shortcode += 'control_playpause="' + attr.cPP + '" ';
      shortcode += 'control_sound="' + attr.cSound + '" ';
      shortcode += 'control_volume="' + attr.cVolume + '" ';
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
    link += vs.previewPage;
    link += '?main_video_url=' + (encodeURIComponent(attr.mUrl) || '%27%27');
    link += '&main_video_poster=' + (encodeURIComponent(attr.mPoster) || '%27%27');
    link += '&video_start_time=' + (attr.vStart || '%27%27');
    link += '&video_placeholder=' + (attr.vPlaceholder || '%27%27');
    link += '&video_info=' + (attr.vInfo || '%27%27');
    link += '&control_playpause=' + (attr.cPP || false);
    link += '&control_sound=' + (attr.cSound || false);
    link += '&control_volume=' + (attr.cVolume || false);
    link += '&control_fullscreen=' + (attr.cFs || false);
    link += '&ad_video_urls=' + (encodeURIComponent(attr.aUrls) || '%27%27');
    link += '&ad_start_times=' + (attr.aStarts || '%27%27');

    return link + "/";
  }

  // Get all input values as an object
  function getInputs() {

    var singleAdElms = document.querySelectorAll('.vs_single_ad');

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
    controlFullscreen = controlFullscreenElm.checked;

    for (var j = 0; j < singleAdElms.length; j++) {
      var adURLElm = singleAdElms[j].querySelector('.vs_ad_url');
      var adStartTimeElm = singleAdElms[j].querySelector('.vs_ad_start_time');
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
      cFs: controlFullscreen,
      aUrls: adsVideoURLs,
      aStarts: adsVideoStartTimes
    }

  }

  function validateInput(attr) {
    // just checking is any field value is empty
    var singleAdElm = document.querySelectorAll('.vs_single_ad');
    var allInputs = document.querySelectorAll('#vs_video_options_form input');

    // validate required fields
    if (!(isValidRequiredFields() && isValidDateTimeFields())) return false;

    return true;
  }

  /*
   * Check validation of all inputs
   */
  function isValidInput(attr) {
    var urlPattern = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/
    var isUrl = urlPattern.test(attr.mUrl)

    if (!attr.mUrl || !attr.mPoster || !attr.vStart ||
      (singleAdElm.length > 0 &&
        (attr.aUrls.length <= 0 || attr.aStarts.length <= 0)) ||
      singleAdElm.length !== attr.aUrls.length ||
      singleAdElm.length !== attr.aStarts.length) return true

    return
  }

  /*
   * Check validation for required fields
   */
  function isValidRequiredFields() {

    var requiredElms = document.querySelectorAll('[data-required=true]');
    var isValid = false;

    requiredElms.forEach(function(item) {
      if (!item.value) {
        item.classList.add('vs_error_field');
        isValid = false;
      } else {
        isValid = true;
      }
    });

    return isValid;

  }

  /*
   * Check validation for Date and Time input
   */
  function isValidDateTimeFields() {
    var isValid = false;
    if (date.getTime() > new Date(videoStartDatetimeElm.value).getTime()) {
      videoStartDatetimeElm.classList.add('vs_error_field');
      isValid = false;
    } else {
      isValid = true
    }
    return isValid;
  }

})()