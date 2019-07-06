<?php
/**
* Plugin Name: SaLS
* Plugin URI: https://github.com/forhad-h/sals-wp-plugin
* Description: SaLS (Static as Live Streaming) is a wordpress plugin for play static video like live video streaming with 'video Ads'
* Version: 1.0.0
* Author: Forhad Hosain
**/
require_once 'shortcode.php';
register_activation_hook( __FILE__, 'sals_db_install' );

if ( is_admin() ){
  add_action( 'admin_menu', 'sals_menu' );
} else {
  // non-admin enqueues, actions, and filters
}

function sals_menu() {
	add_menu_page(
    'Mange Static Videos',
    'SaLS',
    'publish_posts',
    'manage-static-videos',
    'sals_static_video_options',
    'dashicons-format-video', 61
  );
}

/*display options field*/
function sals_static_video_options() {
?>


<div class="sals_wrapper">
  <div class="sals_options_area">
    <h1>Add Static video with Ads</h1>

    <form id="sals_video_options_form" method="post" action="#">
        <div class="sals_fields_wrapper">
            <div class="sals_single_option">
                <h3>Main video URL *</h3>
                <input type="text" name="main_video_url" id="main_video_url" value="" />
                <h3>Main video Poster URL *</h3>
                <input type="text" name="main_video_poster" id="main_video_poster" value="" />
            </div>
            <div class="sals_single_option">
                <h3>Ads</h3>
                <div class="sals_ads_wrapper"></div>
                <button class="sals_new_ad_btn" type="button">New Ad</button>
            </div>
        </div>
        <div class="sals_submit_btn_wrapper">
           <button class="sals_generate_btn" type="button">Generate Shortcode</button>
        </div>

    </form>
  </div>
  <div class="sals_shortcode_area">
    <h2>Copy this shortcode and paste your desired pages</h2>
    <textarea class="sals_shortcode_container" readonly></textarea>
  </div>
</div>

<?php }
// load scripts to frontend
add_action('wp_enqueue_scripts', 'sals_frontend_scripts');
function sals_frontend_scripts() {
  // load js for video player
  wp_enqueue_script('sals-video-player', plugin_dir_url(__FILE__).'js/video-player.js', array(), '1.0.0', true);

  // load css for frontend
  wp_enqueue_style('sals-styles-frontend', plugin_dir_url(__FILE__).'css/styles.css', '1.0.0');
}

// load scripts to backend
add_action('admin_enqueue_scripts', 'sals_backend_scripts');
function sals_backend_scripts() {
  // load admin js fro custom operation
  wp_enqueue_script('sals-admin-js', plugin_dir_url(__FILE__).'js/admin.js', array(), '1.0.0', true);

  // load css for admin frontend
  wp_enqueue_style('sals-admin-css', plugin_dir_url(__FILE__).'css/admin.css', array(), '1.0.0');
}
?>
