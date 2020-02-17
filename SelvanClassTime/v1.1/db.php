<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost:2811";
// $username = "id2705128_epiz_23990772";
// $password = "vnGicwJG";
$username = "root";
$password = "";
$dbName = 'class-time';

// $name = $_POST["name"];
// $classTimes = ($_POST["classtimes"]);



// $conn = new mysqli($servername, $username, $password);
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// } 

// $sql = "CREATE DATABASE id2705128_epiz_23990772_test";
// if ($conn->query($sql) === TRUE) {
//     echo "Database created successfully";
// } else {
//     echo "Error creating database: " . $conn->error;
// }


$conn = new mysqli($servername, $username, $password, $dbName);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (!mysqli_num_rows(mysqli_query($conn, "SHOW TABLES LIKE 'classtable'"))) {

    // sql to create table
    $sql = "CREATE TABLE classtable (
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
}
