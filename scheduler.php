<?php
// custom shcedule recurrence
if(!function_exists('sals_cron_schedule')) {

  add_filter('cron_schedules', 'sals_cron_schedule');

  function sals_cron_schedule($schedules) {
    if(!isset($schedules['30min'])) {
      $schedules['30min'] = array(
        'interval' => 30 * 60,
        'display' => 'Once every 30 minitues'
      );
    }
    return $schedules;
  }
}

// execute with event reccurence
if(!function_exists('sals_handle_video')) {

  add_action('sals_check_event', 'sals_handle_video');

  function sals_handle_video() {

  }

}
