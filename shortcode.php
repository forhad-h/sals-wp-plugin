<?php
add_shortcode('sals-video', 'sals_video_shortcode');
function sals_video_shortcode($attr) {
  extract(shortcode_atts(array(
    'main_video_url' => plugin_dir_url(__FILE__).'video/tears-of-steel-battle-clip-medium.mp4',
    'main_video_poster' => plugin_dir_url(__FILE__).'img/poster.jpg',
    'ad_video_urls' => plugin_dir_url(__FILE__).'video/movie.mp4',
    'ad_start_times' => 3,
  ), $attr));

  $ad_video_urls_arr = explode(',', $ad_video_urls);
  $ad_start_times_arr = explode(',', $ad_start_times);

  ob_start();
?>
  <figure class="sals_videoContainer" data-fullscreen="false">
    <div class="sals_video_main">
      <video class="sals_video" controls preload="metadata" poster="<?= $main_video_poster;?> ">
        <source src="<?= $main_video_url; ?>" type="video/mp4">
      </video>
      <div class="sals_ads" style="display:none">
        <?php
          for($i=0; $i < count($ad_video_urls_arr); $i++ ) {

        ?>

          <div class="sals__single_ad" data-adstart="<?= $ad_start_times_arr[$i]; ?>" data-addisplayed="false" style="display:none">
            <video class="sals__video_ad">
              <source src="<?= $ad_video_urls_arr[$i]; ?>" type="video/mp4">
            </video>
            <button class="sals__skip_btn" type="button">Skip 5s</button>
          </div>

        <?php } ?>

      </div>
      <div class="sals_video-controls" data-state="hidden">
        <button class="sals_playpause" type="button" data-state="play">Play/Pause</button>
        <button class="sals_volume" type="button">
          <span class="sals_volume__icon"></span>
          <span class="sals_volume__controller">
            <span class="sals_volume__pointer"></span>
          </span>
        </button>
        <button class="sals_fs" type="button" data-state="go-fullscreen">Fullscreen</button>
      </div>
    </div>
  </figure>
<?php
  return ob_get_clean();
}
 ?>
