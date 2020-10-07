<?php
/**
* Plugin Name: Video Scheduler
* Plugin URI: https://github.com/forhad-h/vs-wp-plugin
* Description: Video Scheduler is a wordpress plugin for play video with 'video Ads' in a scheduled time
* Version: 1.2.3
* Author: Forhad Hosain
**/
require_once 'shortcode.php';
define('vs_PREVIEW_PAGE_NAME', 'vs-preview-page.php');
define('PREVIEW_PAGE', ABSPATH.vs_PREVIEW_PAGE_NAME);
define('vs_VERSION', '1.2.3');

// when plugin activate_plugin
register_activation_hook(__FILE__, 'create_vs_priview_page');
register_deactivation_hook(__FILE__, 'delete_vs_priview_page');

if ( is_admin() ){
  add_action( 'admin_menu', 'vs_menu' );

  function vs_menu() {
  	add_menu_page(
      'Mange Static Videos',
      'Video Scheduler',
      'publish_posts',
      'manage-static-videos',
      'vs_static_video_options',
      'dashicons-format-video', 61
    );
  }

  /*display options field*/
  function vs_static_video_options() {
    require_once 'admin_options.php';
  }
}

// load scripts to frontend
add_action('wp_enqueue_scripts', 'vs_frontend_scripts');
function vs_frontend_scripts() {
  // load js for video player
  wp_enqueue_script('vs-video-player', plugin_dir_url(__FILE__).'js/video-player.js', array(), vs_VERSION, true);
  wp_localize_script('vs-video-player', 'vs', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
  ));

  // load css for frontend
  wp_enqueue_style('vs-styles-frontend', plugin_dir_url(__FILE__).'css/styles.css', array(), vs_VERSION);
}
// load scripts to backend
add_action('admin_enqueue_scripts', 'vs_backend_scripts');
function vs_backend_scripts() {
  // load admin js fro custom operation
  wp_enqueue_script('vs-admin-js', plugin_dir_url(__FILE__).'js/admin.js', array(), vs_VERSION, true);
  wp_localize_script('vs-admin-js', 'vs', array(
    'previewPage' => esc_url(site_url(vs_PREVIEW_PAGE_NAME))
  ));
  // load css for admin frontend
  wp_enqueue_style('vs-admin-css', plugin_dir_url(__FILE__).'css/admin.css', array(), vs_VERSION);
}

// ajax request
add_action('wp_ajax_vs_play_time', 'get_vs_play_time');
add_action('wp_ajax_nopriv_vs_play_time', 'get_vs_play_time');
if(!function_exists('get_vs_play_time')) {

  function get_vs_play_time() {
      include 'get_play_time.php';
      wp_die();
  }
}

// create preview page
if(!function_exists('create_vs_priview_page')) {
  function create_vs_priview_page() {
    if(!is_file(ABSPATH.'vs-preview-page.php')) {
      $preview_page = fopen(PREVIEW_PAGE, 'w') or die('Cannot open file');
      $page_content = "<?php \n";
      $page_content .= "require_once './wp-load.php';\n";

      $page_content .= "?>\n<div class='vs_priview_container'>\n<?php\n";

      $page_content .= "echo do_shortcode(\"\n";
      $page_content .= "[vs-video \n";
      $page_content .= "main_video_url={\$_GET['main_video_url']} \n";
      $page_content .= "main_video_poster={\$_GET['main_video_poster']} \n";
      $page_content .= "video_start_time={\$_GET['video_start_time']} \n";
      $page_content .= "video_placeholder={\$_GET['video_placeholder']} \n";
      $page_content .= "video_info={\$_GET['video_info']} \n";
      $page_content .= "control_playpause={\$_GET['control_playpause']} \n";
      $page_content .= "control_sound={\$_GET['control_sound']} \n";
      $page_content .= "control_volume={\$_GET['control_volume']} \n";
      $page_content .= "control_fullscreen={\$_GET['control_fullscreen']} \n";
      $page_content .= "ad_video_urls={\$_GET['ad_video_urls']} \n";
      $page_content .= "ad_start_times={\$_GET['ad_start_times']} \n";

      $page_content .= "]\");\n?>\n</div>\n<?php\n";

      $page_content .= "\$ajaxUrl = admin_url('admin-ajax.php');\n?>\n";
      $page_content .= "<script src='<?= plugins_url(\"vs\").\"/js/video-player.js?ajaxUrl=\$ajaxUrl\";?>' id=\"vs_video_player_prev_script\"></script>\n";
      $page_content .= "<link rel='stylesheet' href='<?= plugins_url(\"vs\").\"/css/styles.css\"?>'/>";


      fwrite($preview_page, $page_content);
      fclose($preview_page);
    }
  }
}
if(!function_exists('delete_vs_priview_page')) {
  function delete_vs_priview_page() {
    if(is_file(ABSPATH.'vs-preview-page.php')) {
      unlink(PREVIEW_PAGE);
    }
  }
}
?>
