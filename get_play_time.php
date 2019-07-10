<?php

$start_time = $_GET['starttime'];
$duration = $_GET['duration'];
$time_difference = time() - $start_time;
$play_time = 0;

if($time_difference < $duration) {
  $play_time = $time_difference;
}else {
  $play_time = $time_difference % $duration;
}

echo $play_time;

?>
