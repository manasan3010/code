<?php
require 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   // username and password sent from form 

   $myusername = mysqli_real_escape_string($conn, $_POST['username']);
   $mypassword = mysqli_real_escape_string($conn, $_POST['password']);

   $sql = "SELECT id FROM users WHERE username = '$myusername' and password = '$mypassword'";
   $result = mysqli_query($conn, $sql);
   $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
   $active = $row['id'];

   $count = mysqli_num_rows($result);

   // If result matched $myusername and $mypassword, table row must be 1 row

   if ($count >= 1) {
      //   session_register("myusername");
      $_SESSION['user'] = $myusername;
      echo $_SESSION["user"];
      echo "logged";
   } else {
      $error = "Your Login Name or Password is invalid";
      echo "incorrect";
   }
}
