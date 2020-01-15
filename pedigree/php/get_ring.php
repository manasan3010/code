<?php
require 'db.php';


session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" || true) {


    $sql = "SELECT ring, sex FROM pigeons";
    $result = mysqli_query($conn, $sql);
    $count = mysqli_num_rows($result);
    $ring = [[], []];

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            if ($row["sex"] == "cock") {
                array_push($ring[0], strval($row["ring"]));
            } elseif ($row["sex"] == "hen") {
                array_push($ring[1], strval($row["ring"]));
            }
        }
    }

    echo json_encode($ring);
}
