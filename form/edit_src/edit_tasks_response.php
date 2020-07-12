<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";

parse_str(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY), $queries);

$conn = new mysqli($servername, $username, $password,"suitecrm");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


$sql = "SELECT id,name,field1,field2,field3,field4 FROM tasks_extra WHERE id='{$queries['record']}'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "[";
    while($row = $result->fetch_assoc()) {
        echo "{\"id\": \"" . $row["id"]."\",\"name\": \"" . $row["name"]."\",\"field1\": \"" . $row["field1"]."\",\"field2\": \"" . $row["field2"]."\",\"field3\": \"" . $row["field3"]."\",\"field4\": \"" . $row["field4"]."\"},";
    }
	echo "{}]";
} else {
    echo '"Not Found"';
}

?>
