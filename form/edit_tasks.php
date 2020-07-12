<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";

echo  count($_POST['name']);
// echo  json_encode($_POST);

parse_str(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY), $queries);
// echo $queries['record'];

$conn = new mysqli($servername, $username, $password,"suitecrm");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


$sql = "CREATE TABLE tasks_extra (
id TINYTEXT ,
name TINYTEXT ,
field1 TEXT,
field2 TEXT,
field3 TEXT,
field4 TEXT
)";

if ($conn->query($sql) === TRUE) {
    echo "Table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$sql = "DELETE FROM tasks_extra WHERE id='{$queries['record']}'";

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . $conn->error;
}
// $query = "SELECT COUNT(*) FROM bugs";
// $result = mysqli_query($conn,$query);
// $rows = mysqli_fetch_row($result);
// echo $rows[0];

$times=0;
foreach ($_POST['name'] as $re) {
   

$sql = "INSERT INTO tasks_extra (id,name,field1,field2,field3,field4)
values('{$queries['record']}','{$_POST["name"][$times]}','{$_POST["field1"][$times]}','{$_POST["field2"][$times]}','{$_POST["field3"][$times]}','{$_POST["field4"][$times]}')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully ".$sql;
} else {
    echo "ErrorRecord: " . $sql . "<br>" . $conn->error;
}

$times++;
}
$conn->close();

?>
