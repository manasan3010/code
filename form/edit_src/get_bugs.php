<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$arrayString=array();

$conn = new mysqli($servername, $username, $password,"suitecrm");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


$sql = "SELECT name FROM bugs";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	// echo "[";
	while($row = $result->fetch_assoc()) {
		// echo "{\"name\": \"" . $row["name"]."\"},";
		array_push($arrayString,["name" => $row["name"] ]);
    }
	// echo "]";
} else {
    
}
echo json_encode($arrayString);
?>
