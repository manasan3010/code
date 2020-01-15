<?php

ob_start();

$servername = "pigeon.jaffnait.com";
$username = "pigeonja_ffna";
$password = "9L14t1T@QAj;";
$database = "pigeonja_pms";

date_default_timezone_set('Asia/Colombo');
$today = date("Y-m-d H:i:s");

if ("localhost" == $_SERVER["HTTP_HOST"]) {
    $servername = "localhost:2811";
    $username = "root";
    $password = "";
    $database = "pms";

    $conn = new mysqli($servername, $username, $password);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "CREATE DATABASE IF NOT EXISTS $database";
    if ($conn->query($sql) === TRUE) {
        echo "Database created successfully";
    } else {
        echo "Error creating database: " . $conn->error;
    }
}


$conn = new mysqli($servername, $username, $password, $database);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}



// sql to create table
$sql = "CREATE TABLE IF NOT EXISTS users (
id SMALLINT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
username TINYTEXT ,
password TINYTEXT ,
mod_date TINYTEXT NULL, 
ipdata TINYTEXT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table Users created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$sql = "CREATE TABLE IF NOT EXISTS pigeons (
id SMALLINT(10) UNSIGNED UNIQUE AUTO_INCREMENT PRIMARY KEY ,
ring VARCHAR(200)  NOT NULL UNIQUE,
name TINYTEXT ,
description MEDIUMTEXT ,
file LONGTEXT ,
color TINYTEXT ,
sex TINYTEXT ,
p_image LONGTEXT ,
a_image LONGTEXT ,
breeder TINYTEXT ,
owner TINYTEXT ,
owner_add_1 TINYTEXT ,
owner_add_2 TINYTEXT ,
country TINYTEXT ,
performance MEDIUMTEXT ,
father VARCHAR(200) ,
mother VARCHAR(200) ,
created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

)";

if ($conn->query($sql) === TRUE) {
    echo "Table Pigeons created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}


$sql = "SELECT id FROM users";
$result = $conn->query($sql);

if ($result->num_rows < 1) {

    $sql = "INSERT INTO users (username,password)
    values('admin','admin')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    ob_end_clean();
}
