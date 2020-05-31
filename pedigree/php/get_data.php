<?php
require 'db.php';


// session_start();

if (1) {


    $sql = "SELECT * FROM pigeons";
    $result = mysqli_query($conn, $sql);
    $count = mysqli_num_rows($result);
    $data = [];

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
            // if ($row["sex"] == "cock") {
            //     array_push($data[0], strval($row["data"]));
            // } elseif ($row["sex"] == "hen") {
            //     array_push($data[1], strval($row["data"]));
            // }
        }
    }

    $data = json_encode($data);
    echo ($data);
    // return json_encode($data);
}
