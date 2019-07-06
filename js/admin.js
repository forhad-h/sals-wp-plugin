!(function() {
  // variables fro required elements
  var addWrapperElm = document.querySelector('.sals_ads_wrapper');
  var addNewBtnElm = document.querySelector('.sals_new_ad_btn');
  var adsWrapper = document.querySelector('.sals_ads_wrapper');
  var shortcodeContainerElm = document.querySelector('.sals_shortcode_container');
  var shortcodeGenerateElm = document.querySelector('.sals_generate_btn');
  var serialNo = 0;



  addNewBtnElm.addEventListener('click', function() {
    serialNo++;
    return makeAdSection(serialNo);
  })

  shortcodeGenerateElm.addEventListener('click', function() {
    return addShortcode();
  })

  shortcodeContainerElm.addEventListener('click', function() {
    this.select();
  })

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
    var mainVideoURLElm = document.getElementById('main_video_url')
    var mainVideoPosterElm = document.getElementById('main_video_poster')
    var singleAdElms = document.querySelectorAll('.sals_single_ad')

    // variables for shortcode values
    var mainVideoURL = '';
    var mainVideoPoster = '';
    var adsVideoURLs = [];
    var adsVideoStartTimes = [];

    mainVideoURL = mainVideoURLElm.value
    mainVideoPoster = mainVideoPosterElm.value

    for (var j = 0; j < singleAdElms.length; j++) {
      var adURLElm = singleAdElms[j].querySelector('.sals_ad_url')
      var adStartTimeElm = singleAdElms[j].querySelector('.sals_ad_start_time')
      adsVideoURLs.push(adURLElm.value)
      adsVideoStartTimes.push(adStartTimeElm.value)
    }


    shortcodeContainerElm.value = generateShortcode(mainVideoURL,
      mainVideoPoster,
      adsVideoURLs,
      adsVideoStartTimes);
  }

  function generateShortcode(mUrl, mPoster, aUrls, aTimes) {
    if (validateInput(mUrl, mPoster, aUrls, aTimes)) {
      var shortcode = '';
      shortcode += '[sals-video ';
      shortcode += 'main_video_url="' + mUrl + '" ';
      shortcode += 'main_video_poster="' + mPoster + '" ';
      shortcode += 'ad_video_urls="' + aUrls.join(',') + '" ';
      shortcode += 'ad_start_times="' + aTimes.join(',') + '" ';
      shortcode += ']';

      return shortcode
    }
    return '';
  }

  function validateInput(mUrl, mPoster, aUrls, aTimes) {
    // just checking is any field value is empty
    if (
      !mUrl || !mPoster ||
      (document.querySelectorAll('.sals_single_ad').length > 0 &&
        (aUrls.length <= 0 || aTimes.length <= 0)) ||
      document.querySelectorAll('.sals_single_ad').length !== aUrls.length ||
      document.querySelectorAll('.sals_single_ad').length !== aTimes.length
    ) {
      var allInputs = document.querySelectorAll('#sals_video_options_form input');

      for (var i = 0; i < allInputs.length; i++) {
        if (!allInputs[i].value) {
          allInputs[i].classList.add('sals_error_field')
        }

        allInputs[i].addEventListener('input', function() {
          this.classList.remove('sals_error_field')
        })
      }
      return false;
    }
    return true;
  }

})()