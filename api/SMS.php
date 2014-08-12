<?php
require 'SMSWorker.php';
$Worker = new SMSWorker;
$Worker->Subscribe(json_decode($_POST['Alerts']));
?>