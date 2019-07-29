<?php
/**
* Plugin Name: SaLS
* Plugin URI: https://github.com/forhad-h/sals-wp-plugin
* Description: SaLS (Static as Live Streaming) is a wordpress plugin for play static video like live video streaming with 'video Ads'
* Version: 1.1.2
* Author: Forhad Hosain
**/
require_once 'shortcode.php';
define('SALS_PREVIEW_PAGE_NAME', 'sals-preview-page.php');
define('PREVIEW_PAGE', ABSPATH.SALS_PREVIEW_PAGE_NAME);

// when plugin activate_plugin
register_activation_hook(__FILE__, 'create_sals_priview_page');
register_deactivation_hook(__FILE__, 'delete_sals_priview_page');

if ( is_admin() ){
  add_action( 'admin_menu', 'sals_menu' );

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
}

// load scripts to frontend
add_action('wp_enqueue_scripts', 'sals_frontend_scripts');
function sals_frontend_scripts() {
  // load js for video player
  wp_enqueue_script('sals-video-player', plugin_dir_url(__FILE__).'js/video-player.js', array(), '1.1.2', true);
  wp_localize_script('sals-video-player', 'sals', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
  ));

  // load css for frontend
  wp_enqueue_style('sals-styles-frontend', plugin_dir_url(__FILE__).'css/styles.css', array(), '1.1.1');
}
// load scripts to backend
add_action('admin_enqueue_scripts', 'sals_backend_scripts');
function sals_backend_scripts() {
  // load admin js fro custom operation
  wp_enqueue_script('sals-admin-js', plugin_dir_url(__FILE__).'js/admin.js', array(), '1.1.0', true);
  wp_localize_script('sals-admin-js', 'sals', array(
    'previewPage' => esc_url(site_url(SALS_PREVIEW_PAGE_NAME))
  ));
  // load css for admin frontend
  wp_enqueue_style('sals-admin-css', plugin_dir_url(__FILE__).'css/admin.css', array(), '1.1.1');
}

// ajax request
add_action('wp_ajax_sals_play_time', 'get_sals_play_time');
add_action('wp_ajax_nopriv_sals_play_time', 'get_sals_play_time');
if(!function_exists('get_sals_play_time')) {

  function get_sals_play_time() {
      include 'get_play_time.php';
      wp_die();
  }
}

// create preview page
if(!function_exists('create_sals_priview_page')) {
  function create_sals_priview_page() {
    if(!is_file(ABSPATH.'sals-preview-page.php')) {
      $preview_page = fopen(PREVIEW_PAGE, 'w') or die('Cannot open file');
      $page_content = "<?php \n";
      $page_content .= "require_once './wp-load.php';\n";

      $page_content .= "?>\n<div class='sals_priview_container'>\n<?php\n";

      $page_content .= "echo do_shortcode(\"\n";
      $page_content .= "[sals-video \n";
      $page_content .= "main_video_url={\$_GET['main_video_url']} \n";
      $page_content .= "main_video_poster={\$_GET['main_video_poster']} \n";
      $page_content .= "video_start_time={\$_GET['video_start_time']} \n";
      $page_content .= "video_placeholder={\$_GET['video_placeholder']} \n";
      $page_content .= "video_info={\$_GET['video_info']} \n";
      $page_content .= "control_playpause={\$_GET['control_playpause']} \n";
      $page_content .= "control_sound={\$_GET['control_sound']} \n";
      $page_content .= "control_volume={\$_GET['control_volume']} \n";
      $page_content .= "control_live={\$_GET['control_live']} \n";
      $page_content .= "control_fullscreen={\$_GET['control_fullscreen']} \n";
      $page_content .= "ad_video_urls={\$_GET['ad_video_urls']} \n";
      $page_content .= "ad_start_times={\$_GET['ad_start_times']} \n";

      $page_content .= "]\");\n?>\n</div>\n<?php\n";

      $page_content .= "\$ajaxUrl = admin_url('admin-ajax.php');\n?>\n";
      $page_content .= "<script src='<?= plugins_url(\"sals\").\"/js/video-player.js?ajaxUrl=\$ajaxUrl\";?>' id=\"sals_video_player_prev_script\"></script>\n";
      $page_content .= "<link rel='stylesheet' href='<?= plugins_url(\"sals\").\"/css/styles.css\"?>'/>";


      fwrite($preview_page, $page_content);
      fclose($preview_page);
    }
  }
}
if(!function_exists('delete_sals_priview_page')) {
  function delete_sals_priview_page() {
    if(is_file(ABSPATH.'sals-preview-page.php')) {
      unlink(PREVIEW_PAGE);
    }
  }
}
?>
