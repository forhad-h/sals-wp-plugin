
<div class="vs_options_wrapper">
  <div class="vs_options_area">
    <h1>Schedule Video</h1>

    <form id="vs_video_options_form" method="post" action="#">
        <div class="vs_fields_wrapper">
            <div class="vs_single_option">
                <h2>Main Video</h2>
                <div class="vs_inner_section">
                  <h3>Video URL *</h3>
                  <div class="video_type">
                    <label><input type="radio" name="video_type" value="self-hosted" checked/>Self-hosted</label>
                    <label><input type="radio" name="video_type" value="youtube"/>Youtube</label>
                    <label><input type="radio" name="video_type" value="vimeo"/>Vimeo</label>
                  </div>
                  <input type="url" name="main_video_url" id="main_video_url" value=""  data-required="true" placeholder="Enter your Self-hosted video URL"/>
                  <h3>Video Poster URL *</h3>
                  <input type="text" name="main_video_poster" id="main_video_poster" value="" data-required="true"/>
                  <h3>Video start date & time (month/date/year, hour:miniutes) * </h3>
                  <input type="datetime-local" name="video_start_datetime" id="video_start_datetime" value="" />
                  <span class="vs_info">Must be greater than current time</span>
                  <h3>Video placeholder</h3>
                  <input type="text" name="video_placeholder" id="video_placeholder" placeholder="Coming soon..." />
                  <h3>Video info.</h3>
                  <input type="text" name="video_info" id="video_info" placeholder="Some info. about video" />
                </div>
            </div>
            <div class="vs_single_option">
              <h2>Video controls</h2>
              <div class="vs_inner_section">
                <label><input type="checkbox" name="control_playpause" id="control_playpause" /> Play/Pause</label>
                <label><input type="checkbox" name="control_sound" id="control_sound" /> Sound/Mute</label>
                <label><input type="checkbox" name="control_volume" id="control_volume" /> Volume</label>
                <label><input type="checkbox" name="control_fullscreen" id="control_fullscreen" /> Fullscreen</label>
              </div>
            </div>
            <div class="vs_single_option">

              <h2>Ad Videos</h2>
              <div class="vs_inner_section">
                <div class="vs_ads_wrapper"></div>
                <button class="vs_new_ad_btn" type="button">New Ad</button>
              </div>

            </div>

        </div>

    </form>
  </div>
  <div class="vs_shortcode_area">
    <h3>Copy this shortcode and paste your desired pages</h3>
    <textarea class="vs_shortcode_container" readonly></textarea>
    <button class="vs_preview_btn" type="button">Preview</button>
    <div class="vs_submit_btn_wrapper">
       <button class="vs_generate_btn" type="button">Generate Shortcode</button>
    </div>
  </div>
</div>
