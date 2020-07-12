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


// $sql = "CREATE TABLE test_service_main_add (
// id SMALLINT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
// addno SMALLINT(6) UNSIGNED, 
// name TINYTEXT ,
// ipdata MEDIUMTEXT,
// gpslocation MEDIUMTEXT,
// classtimes MEDIUMTEXT,
// adjtimes MEDIUMTEXT,
// reg_date TINYTEXT 
// )";

// if ($conn->query($sql) === TRUE) {
    // echo "Table MyGuests created successfully";
// } else {
    // echo "Error creating table: " . $conn->error;
// }


date_default_timezone_set('Asia/Colombo'); // I am in Athens Greece
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

?>
