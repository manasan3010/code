<?php
session_start();

if (!isset($_SESSION['user'])) {
    echo "not_logged";
    exit();
}
if (!isset($_POST["ring"])) {
    print_r($_SESSION);
    // echo '`print_r`';
    exit();
}
require 'db.php';

// if (($_POST['ring'] == $_POST['mother']) || ($_POST['ring'] == $_POST['father'])) {
//     echo "error: ";
//     exit();
// }

$files = array(
    "a_image" => [],
);
$error = false;
$_POST['ring'] = str_replace(' ', '', strtoupper($_POST['ring']));
// var_dump($_POST);
$_POST['father'] = strtoupper($_POST['father']);
$_POST['mother'] = strtoupper($_POST['mother']);

foreach (array_keys($_POST) as $item) {
    // echo $_POST[$item];
    if ($_POST["$item"] == '' || $_POST["$item"] == ' ') {
        $_POST["$item"] = NULL;
    }
}


var_dump($_POST);
foreach (['file', 'p_image'] as $item) {
    if ($_FILES[$item]['name']) {
        $uploadFileDir = '../uploads/';
        $newFileName = uniqid(date('d-m-y') . "_") . strrchr($_FILES[$item]['name'], '.');
        $dest_path = $uploadFileDir . $newFileName;
        if (move_uploaded_file($_FILES[$item]['tmp_name'], $dest_path) != true) {
            $error = true;
        } else {
            $files[$item] = $newFileName;
        }
    }
}

$i = 0;
while ($_FILES['a_image']['name'][$i]) {


    $uploadFileDir = '../uploads/';
    $newFileName = uniqid(date('d-m-y') . "_") . strrchr($_FILES['a_image']['name'][$i], '.');
    $dest_path = $uploadFileDir . $newFileName;
    // echo $newFileName;
    // print_r($_FILES["a_image"]['name'][$i]);
    if (move_uploaded_file($_FILES['a_image']['tmp_name'][$i], $dest_path) != true) {
        $error = true;
    } else {
        array_push($files['a_image'], $newFileName);
    }

    $i++;
}
if (json_encode($files['a_image']) == "[]") {
    $a_image = null;
} else {
    $a_image = json_encode($files['a_image']);
}

$sql = "INSERT INTO pigeons (ring,name,description,color,sex,breeder,owner,owner_add_1,owner_add_2,country,performance,father,mother,file,p_image,a_image)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

$stmt = mysqli_prepare($conn, $sql);
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssssssssss", $_POST['ring'], $_POST['name'], $_POST['description'], $_POST['color'], $_POST['sex'], $_POST['breeder'], $_POST['owner'], $_POST['owner_add_1'], $_POST['owner_add_2'], $_POST['country'], $_POST['performance'], $_POST['father'], $_POST['mother'], $files['file'], $files['p_image'], $a_image);

if ($stmt->execute() === TRUE) {
    echo "ring=&" . $_POST['ring'] . '&';
} else {
    echo "error: " . $sql . "<br>" . $stmt->error;
}
$stmt->close();

if ($error == true) {
    echo "upload_error";
}








// echo "test 123456";
// ob_start();
// echo $_GET["type"];
// var_dump($_POST);
// var_dump($_POST);
// echo print_r($_FILES['file']);
// /
// $fileTmpPath = $_FILES['file']['tmp_name'][0];
// print_r($fileTmpPath);
// $fileName = $_FILES['file']['name'][0];
// $fileSize = $_FILES['file']['size'][0];
// $fileType = $_FILES['file']['type'][0];
// $fileNameCmps = explode(".", $fileName);
// $fileExtension = strtolower(end($fileNameCmps));
// echo $_POST['4'];


// echo $message;

// $htmlStr = ob_get_contents();
// Clean (erase) the output buffer and turn off output buffering
// ob_end_clean();
// Write final string to file
// file_put_contents("txt.txt", $htmlStr);
// echo $_POST["ring"];
// echo "hi";
