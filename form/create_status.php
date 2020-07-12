<?php
header('Access-Control-Allow-Origin: *');

$servername = "root";
$username = "id2705128_epiz_23990772";
$password = "vnGicwJG";


echo $conn;
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 



// sql to create table
$sql = "CREATE TABLE tasks_status (
id SMALLINT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
addno SMALLINT(6) UNSIGNED, 
name TINYTEXT ,
ipdata MEDIUMTEXT,
gpslocation MEDIUMTEXT,
classtimes MEDIUMTEXT,
adjtimes MEDIUMTEXT,
reg_date TINYTEXT 
)";

if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

date_default_timezone_set('Asia/Colombo'); // I am in Athens Greece
$today = date("Y-m-d H:i:s");


// $sql = "INSERT INTO classtable (name,ipdata) 
// VALUES ('{$_POST["name"]}','$v')";

$sql = "INSERT INTO classtable (addno,name,ipdata,gpslocation,classtimes,adjtimes,reg_date)
values('{$_POST["addno"]}','{$_POST["name"]}','{$_POST["ipdata"]}','{$_POST["gpslocation"]}','{$_POST["classtimes"]}','{$_POST["adjtimes"]}','{$today}')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
echo $today;
$conn->close();

?>
