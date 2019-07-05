!(function() {
  // variables fro required elements
  var addWrapperElm = document.querySelector('.sals_ads_wrapper');
  var addNewBtnElm = document.querySelector('.sals_new_ad_btn');
  var adsWrapper = document.querySelector('.sals_ads_wrapper');
  var shortcodeContainerElm = document.querySelector('.sals_shortcode_container');
  var shortcodeGenerateElm = document.querySelector('.sals_generate_btn');
  var saveBtnElm = document.querySelector('.sals_submit_btn');



  addNewBtnElm.addEventListener('click', function() {
    // make options elements
    var singleAd = document.createElement('div')
    var singleAdClassAttr = document.createAttribute('class')
    singleAdClassAttr.value = 'sals_single_ad'
    singleAd.setAttributeNode(singleAdClassAttr)

    var urlTitle = document.createElement('h4')
    var urlTitleText = document.createTextNode("Ad's video URL *")
    urlTitle.appendChild(urlTitleText)

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


    var startTimeTitle = document.createElement('h4')
    var startTimeTitleText = document.createTextNode("Ad's start time (in second) *")
    startTimeTitle.appendChild(startTimeTitleText)

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

    // push options elements
    singleAd.appendChild(urlTitle)
    singleAd.appendChild(urlInput)
    singleAd.appendChild(startTimeTitle)
    singleAd.appendChild(startTimeInput)
    adsWrapper.appendChild(singleAd)

  })

  shortcodeGenerateElm.addEventListener('click', function() {
    var mainVideoURLElm = document.getElementById('main_video_url')
    var singleAdElms = document.querySelectorAll('.sals_single_ad')

    // variables for shortcode values
    var mainVideoURL = '';
    var adsVideoURLs = [];
    var adsVideoStartTimes = [];

    mainVideoURL = mainVideoURLElm.value
    for (var j = 0; j < singleAdElms.length; j++) {
      var adURL = singleAdElms[j].querySelector('.sals_ad_url').value
      var adStartTime = singleAdElms[j].querySelector('.sals_ad_start_time').value
      adsVideoURLs.push(adURL)
      adsVideoStartTimes.push(adStartTime)
    }
    shortcodeContainerElm.value = generateShortcode(mainVideoURL, adsVideoURLs, adsVideoStartTimes)
    saveBtnElm.disabled = false
  })

  shortcodeContainerElm.addEventListener('click', function() {
    this.select();
  })

  function generateShortcode(mainVideoURL, adsVideoURLs, adsVideoStartTimes) {
    var shortcode = ''
    shortcode += '[sals-video '
    shortcode += 'main_video_url="' + mainVideoURL + '" '
    shortcode += 'ad_video_urls="' + adsVideoURLs.join(',') + '" '
    shortcode += 'ad_start_times="' + adsVideoStartTimes.join(',') + '" '
    shortcode += ']'

    return shortcode
  }

})()