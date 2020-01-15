<?php
require 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   // username and password sent from form 

   $myusername = mysqli_real_escape_string($conn, $_POST['username']);
   $old_password = mysqli_real_escape_string($conn, $_POST['old_password']);
   $new_password = mysqli_real_escape_string($conn, $_POST['new_password']);

   $sql = "SELECT id FROM users WHERE username = '$myusername' and password = '$old_password'";
   $result = mysqli_query($conn, $sql);
   $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
   $active = $row['id'];

   $count = mysqli_num_rows($result);

   // If result matched $myusername and $mypassword, table row must be 1 row

   if ($count >= 1) {
      $sql = "UPDATE users SET password = '$new_password' WHERE username = '$myusername'";

      if ($conn->query($sql) === TRUE) {
         echo "updated";
      } else {
         echo "update_failed" . $conn->error . $myusername;
      }
   } else {
      $error = "Your Login Name or Password is invalid";
      echo "incorrect";
   }
}
