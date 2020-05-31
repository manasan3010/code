<?php

if ($_GET['password'] != 'admin') {
    echo '{"state":"Wrong Secret Key"}';
    die;
}

require_once 'db.php';

$sql = "DROP TABLE classtable";

if (mysqli_query($conn, $sql)) {
    echo '{"state":"Table Deleted"}';
} else {
    echo '{"state":"Deletion Error"}';
}
mysqli_close($conn);
