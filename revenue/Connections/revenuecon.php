<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"
$hostname_revenuecon = "localhost:2811";
$database_revenuecon = "revenuedb";
$username_revenuecon = "root";
$password_revenuecon = "";
$revenuecon = mysqli_connect($hostname_revenuecon, $username_revenuecon, $password_revenuecon) or trigger_error(mysql_error(),E_USER_ERROR); 
?>