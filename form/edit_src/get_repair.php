<?php
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$arrayString=array([],[],[]);

$conn = new mysqli($servername, $username, $password,"suitecrm");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


$sql = "SELECT * FROM tasks_extra WHERE name='Third_Party_Repair'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		array_push($arrayString[0],["part" => $row["field1"] ]);
		array_push($arrayString[1],["repairer" => $row["field2"] ]);
    }
}

$sql = "SELECT * FROM tasks_extra WHERE name='Waiting_for_Parts'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		array_push($arrayString[0],["part" => $row["field1"] ]);
		array_push($arrayString[2],["model" => $row["field2"] ]);
    }
}

$sql = "SELECT model_name_c FROM tasks_cstm ";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		array_push($arrayString[2],["model" => $row["model_name_c"] ]);
    }
}

echo json_encode($arrayString);
?>
