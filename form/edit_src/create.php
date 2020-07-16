<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";



$conn = new mysqli($servername, $username, $password,"suitecrm");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
 

date_default_timezone_set('Asia/Colombo'); 
$today = date("Y-m-d H:i:s");

$query = "SELECT COUNT(*) FROM bugs";
$result = mysqli_query($conn,$query);
$rows = mysqli_fetch_row($result);
echo $rows[0];

$sql = "INSERT INTO bugs (name,id)
values('{$_POST["service"]}','{$rows[0]}')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "ErrorRecord: " . $sql . "<br>" . $conn->error;
}
echo $today;
$conn->close();
