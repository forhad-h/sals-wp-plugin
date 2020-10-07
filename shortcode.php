<?php
add_shortcode('vs-video', 'vs_video_shortcode');
function vs_video_shortcode($attr) {
  extract(shortcode_atts(array(
    'main_video_url' => '',
    'main_video_poster' => '',
    'video_start_time' => "",
    'video_placeholder' => "Coming soon...",
    'video_info' => 'Some Info. about this video',
    'control_playpause' => false,
    'control_sound' => false,
    'control_volume' => false,
    'control_fullscreen' => false,
    'ad_video_urls' => '',
    'ad_start_times' => 3,
  ), $attr));

  $ad_video_urls_arr = explode(',', $ad_video_urls);
  $ad_start_times_arr = explode(',', $ad_start_times);
  ob_start();
  $isPreviewPage = preg_match('/vs-preview-page/', $_SERVER['REQUEST_URI']);
  if($isPreviewPage) {
    $video_start_time = time();
  }
  if($video_start_time <= time()) :
?>
  <figure class="vs_videoContainer" data-fullscreen="false">
    <div class="vs_video_loading" style="display: none">
      <img src="<?= plugin_dir_url(__FILE__).'img/loading.gif';?>">
    </div>
    <div class="play_pause_animation animate_focus" data-icon="play" style="display: none"></div>
    <div class="vs_unmute_btn">Click to play sound</div>
    <div class="vs_video_main">
      <video class="vs_video" preload="metadata" data-videostart="<?= $video_start_time; ?>"
        poster="<?= $main_video_poster;?> " >
        <source src="<?= $main_video_url; ?>" type="video/mp4">
      </video>
      <div class="vs_ads" style="display:none">
        <?php
          for($i=0; $i < count($ad_video_urls_arr); $i++ ) {

        ?>

          <div class="vs__single_ad" data-adstart="<?= $ad_start_times_arr[$i]; ?>" data-addisplayed="false" style="display:none">
            <video class="vs__video_ad">
              <source src="<?= $ad_video_urls_arr[$i]; ?>" type="video/mp4">
            </video>
            <button class="vs__skip_btn" type="button">Skip in 5s</button>
          </div>

        <?php } ?>

      </div>
      <div class="vs_video-controls" data-state="hidden">
        <button class="vs_playpause" type="button" data-state="play"
        style="display: <?= $control_playpause === 'true' ? 'block' : 'none';?>">
        Play/Pause</button>
        <button class="vs_volume" type="button">
          <span class="vs_volume__icon" data-state="muted"
          style="display: <?= $control_sound === 'true' ? 'block' : 'none';?>"></span>
          <span class="vs_volume__controller"
          style="display: <?= $control_volume === 'true' ? 'block' : 'none';?>">
            <span class="vs_volume__pointer"></span>
          </span>
        </button>
        <button class="vs_fs" type="button" data-state="go-fullscreen"
        style="display: <?= $control_fullscreen === 'true' ? 'block' : 'none';?>">Fullscreen</button>
      </div>
    </div>
  </figure>
  <p class="vs_video_info"><?= $video_info; ?></p>
<?php else : ?>
  <div class="vs_video_placeholder">
    <img src="<?= plugin_dir_url( __FILE__ );?>/img/video.png" />
    <h2><?= $video_placeholder; ?></h2>
  </div>
<?php
  endif;
  return ob_get_clean();
}
 ?>
