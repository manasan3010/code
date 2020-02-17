<?php
require_once 'db.php';

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
