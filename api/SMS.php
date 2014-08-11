<?php

//Twilio connectors
require('Twilio.php'); 

function sendSMS($Number, $Message){
	try{
		$account_sid = 'AC0b0dad90111358a74ba2de77d0e41791'; 
		$auth_token = '5a046d46f819d90c677be93037451f7d'; 
		$client = new Services_Twilio($account_sid, $auth_token); 
 
	$client->account->messages->create(array( 
	'To' => "$Number", 
	'From' => "+441672500046", 
	'Body' => "$Message",   
));
		echo "Success";
	}
	catch (Exception $error){
		echo 'Error: ', $error->getMessage(), "\n"; 
	
	}
}


//Inserts number into db for sending
function subscribeNumber($number, $message, $data){
	//Send welcome SMS
	if (sendSMS($number, "You've been signed up to receive sunset alerts from beforedark.co") == "Success"){
	
	// Create connection
	$con = mysqli_connect("127.0.0.1","root","","beforedark");
	// Check connection
	if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

	$number = mysqli_real_escape_string($number);

	 foreach($data as $atTime){
    
	$sql="INSERT INTO queue (number, message, atTime) VALUES ('$number', '$message', '$atTime')";
	

	mysqli_close($con);
	echo "Success";
	}
	}
	else {
	echo "Failure";
	}
}

$Number = $_POST['number'];

$message = json_decode(stripslashes($_POST['message']));

$data = json_decode(stripslashes($_POST['data']));

subscribeNumber($Number, $message, $data);



?>