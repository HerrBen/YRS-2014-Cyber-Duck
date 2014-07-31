<?php

//Twilio connectors

function sendSMS($Number,$Message){
	try{
		require('Twilio.php'); 
		$account_sid = 'AC0b0dad90111358a74ba2de77d0e41791'; 
		$auth_token = '5a046d46f819d90c677be93037451f7d'; 
		$client = new Services_Twilio($account_sid, $auth_token); 
 
	$client->account->messages->create(array( 
	'To' => "$Number", 
	'From' => "+441672500046", 
	'Body' => "$Message",   
));
		echo "Sending the message $Message to $Number was successful";
	}
	catch (Exception $error){
		echo 'Error: ', $error->getMessage(), "\n"; 
	
	}
	
}

//Creates a cron job for sending text at certain time

function subscribeNumber($number, $message, $atTime){
//	exec("at $atTime /usr/local/bin/php /www/api/TwilioSMS.php?sendSMS($number, $message)");	
	echo "at $atTime /usr/local/bin/php /www/api/TwilioSMS.php?sendSMS($number, $message)";
}

?>