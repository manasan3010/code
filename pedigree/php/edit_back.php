<?php session_start();
if (!isset($_SESSION['user'])) {
    echo "not_logged";
    exit();
}

require 'db.php';
if (isset($_POST["delete"])) {
    $id = str_replace(' ', '', strtoupper($_POST['delete']));

    $sql = "DELETE FROM pigeons WHERE id='$id' ";

    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
    exit();
}
// var_dump($_POST);

if (!isset($_POST["id"])) {
    exit();
}

if (($_POST['ring'] == $_POST['mother']) || ($_POST['ring'] == $_POST['father'])) {
    echo "error: ";
    exit();
}

$sql = "SELECT file, p_image,a_image,ring FROM pigeons WHERE id='{$_POST["id"]}'";
$result = mysqli_query($conn, $sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $old_ring = $row['ring'];
        $old_file = $row['file'];
        $old_p_image = $row['p_image'];
        $old_a_image = $row['a_image'];
    }
}

$sql = "DELETE FROM pigeons WHERE id='{$_POST["id"]}'";
$conn->query($sql);
$sql = "UPDATE pigeons SET father='{$_POST["ring"]}' WHERE father='$old_ring'";
$conn->query($sql);
$sql = "UPDATE pigeons SET mother='{$_POST["ring"]}' WHERE mother='$old_ring'";
$conn->query($sql);

$files = array(
    "a_image" => [],
);
$error = false;
$_POST['ring'] = str_replace(' ', '', strtoupper($_POST['ring']));
$_POST['father'] = strtoupper($_POST['father']);
$_POST['mother'] = strtoupper($_POST['mother']);

foreach (array_keys($_POST) as $item) {
    // echo $_POST[$item];
    if ($_POST["$item"] == '' || $_POST["$item"] == ' ') {
        $_POST["$item"] = NULL;
    }
}

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

if (!$files['file']) {
    $files['file'] = $old_file;
}
if (!$files['p_image']) {
    $files['p_image'] = $old_p_image;
}
if (!$a_image) {
    $a_image = $old_a_image;
}

$sql = "INSERT INTO pigeons (id,ring,name,description,color,sex,breeder,owner,owner_add_1,owner_add_2,country,performance,father,mother,file,p_image,a_image)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

$stmt = mysqli_prepare($conn, $sql);
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssssssssssss", $_POST["id"], $_POST['ring'], $_POST['name'], $_POST['description'], $_POST['color'], $_POST['sex'], $_POST['breeder'], $_POST['owner'], $_POST['owner_add_1'], $_POST['owner_add_2'], $_POST['country'], $_POST['performance'], $_POST['father'], $_POST['mother'], $files['file'], $files['p_image'], $a_image);

if ($stmt->execute() === TRUE) {
    echo "ring=&" . $_POST['ring'] . '&';
} else {
    echo "error: " . $sql . "<br>" . $stmt->error;
}
$stmt->close();

if ($error == true) {
    echo "upload_error";
}
