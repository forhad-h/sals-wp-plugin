<?php
global $sals_version;
$sals_version = '1.0';

function sals_db_install() {
	global $wpdb;
	global $sals_version;

	$table_name = $wpdb->prefix . 'sals_options';

	$charset_collate = $wpdb->get_charset_collate();

	$sals_info = "CREATE TABLE $table_name (
		id int NOT NULL AUTO_INCREMENT,
		uid tinyint NOT NULL,
		video_url_main varchar(300) NOT NULL,
		video_url_ads text,
		ad_start varchar(200),
		PRIMARY KEY  (id)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sals_info ); // array($cookie_info, $product_info, $visitor_info)

	add_option( 'sals_version', $sals_version );
}
