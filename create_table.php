<?php
global $sals_version;
$sals_version = '1.0.0';

function sals_db_install() {
	global $wpdb;
	global $sals_version;

	$table_name = $wpdb->prefix . 'sals_options';

	$charset_collate = $wpdb->get_charset_collate();

	$sals_info = "CREATE TABLE $table_name (
		id int NOT NULL AUTO_INCREMENT,
		main_video_url varchar(300) NOT NULL,
		ads_video_url text,
		ads_start varchar(200),
		PRIMARY KEY  (id)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sals_info ); // run query

	add_option( 'sals_version', $sals_version );
}
