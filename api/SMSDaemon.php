<?php
// Create connection
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