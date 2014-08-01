<?php
// Create connection
//$con = mysqli_connect("f17a43ff7e3cf78753106f4e21796abd55c1da62.rackspaceclouddb.com","beforedark987654","trEDra8wewrUm8pa","beforedark");
$con = mysqli_connect("127.0.0.1","root","","beforedark");
// Check connection
if (mysqli_connect_errno()) {
 echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
$date = date('m/d/Y h:i:s a', time());
$result = mysqli_query($con,"SELECT * FROM queue WHERE atTime='Peter'");

while($row = mysqli_fetch_array($result)) {
  echo $row['FirstName'] . " " . $row['LastName'];
  echo "<br>";
}


?>