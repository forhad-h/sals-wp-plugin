<?php
/**
* Plugin Name: SaLS
* Plugin URI: https://github.com/forhad-h/sals-wp-plugin
* Description: SaLS (Static as Live Streaming) is a wordpress plugin for play static video like live video streaming with 'video Ads'
* Version: 1.0.0
* Author: Forhad Hosain
**/
require_once 'shortcode.php';


if ( is_admin() ){
  add_action( 'admin_menu', 'sals_menu' );
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
  require_once 'admin_options.php';
}
// load scripts to frontend
add_action('wp_enqueue_scripts', 'sals_frontend_scripts');
function sals_frontend_scripts() {
  // load js for video player
  wp_enqueue_script('sals-video-player', plugin_dir_url(__FILE__).'js/video-player.js', array(), '1.0.0', true);
  wp_localize_script('sals-video-player', 'sals', array(
    'pluginUrl' => plugin_dir_url(__FILE__),
  ));

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
