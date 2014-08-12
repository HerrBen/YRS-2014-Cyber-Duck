<?php
require('Twilio.php'); 

class SMSWorker{
	var $con;
	
	//Constructor sets up SQL connection for worker
	function __construct(){
		$this->con = mysql_connect("f17a43ff7e3cf78753106f4e21796abd55c1da62.rackspaceclouddb.com","beforedark987654","trEDra8wewrUm8pa");
//		$this->con = mysql_connect("127.0.0.1","root","");
		mysql_select_db("beforedark", $this->con);
	}
	
	//Cleans up SQL connection
	function __destruct(){
		mysql_close();
	}

	//Checks whether the text message should be sent at this time
	function TimeCheck(){
		$date = date('Y-m-d H:i', time())."%";
		$result = mysql_query("SELECT * FROM queue WHERE atTime LIKE '$date' AND processed = 0");
		if ($result){
			while($row = mysql_fetch_array($result)){
					echo $this->SendSMS($row['number'], $row['message']); 
					$rowID = $row['id'];
					mysql_query("UPDATE queue SET processed = 1 WHERE id = $rowID");
			}
		}	
	}	

	//Adds number to DB if it doesn't already exist, make sure time-zone differences are accounted for between server and client, send confirmation text message
	function Subscribe($Alerts){
		foreach ($Alerts as $Alert){
			$this->CalculateTime($Alert->Time,$Alert->TimeOffset);
			$sql="INSERT INTO queue (number, message, atTime) VALUES ('". $Alert->Number . "', '". $Alert->Message. "', '". $Alert->Time . "')";
			echo $result = mysql_query($sql);
		}
	if ($result == '1111'){
		$this->SendSMS($Alerts[0]->Number, "You've been signed up to receive sunset alerts from beforedark.co");
	}
}

	//Sends the SMS with Twilio REST api
	function SendSMS($Number, $Message){
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
	
	//Needs proper testing - takes local offset from UTC, adds it to client offset from UTC and adds the difference to the times transmitted by client
	function CalculateTime(&$Time, $TimeOffset){
		$difference = $TimeOffset + date('Z')/60;
		$Time = new DateTime($Time);
		$Time->add(new DateInterval('PT' . $difference . 'M'));
		$Time = $Time->format('Y-m-d H:i');
	}
	
}
?>