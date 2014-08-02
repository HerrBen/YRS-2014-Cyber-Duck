<?php
require 'SMS.php';
// Create connection
$con = mysqli_connect("f17a43ff7e3cf78753106f4e21796abd55c1da62.rackspaceclouddb.com","beforedark987654","trEDra8wewrUm8pa","beforedark");
//$con = mysql_connect("127.0.0.1","root","");
mysql_select_db("beforedark", $con);
// Check connection
if (mysqli_connect_errno()) {
 echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
$date = date('Y-m-d H:i', time())."%";
$result = mysql_query("SELECT * FROM queue WHERE atTime LIKE '$date' AND processed = 0");

if ($result) {
while($row = mysql_fetch_array($result)){
	if (sendSMS($row['number'],$row['message']) == "Success") {
	$rowNumber = $row['number'];
	$rowMessage = $row['message'];
		mysql_query("UPDATE queue SET processed = 1 WHERE number = $rowNumber AND message = '$rowMessage'");
	}
}
}
else{
echo "No results";
}


?>