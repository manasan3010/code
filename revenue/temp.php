<?php
$hostname_revenuecon = "localhost";
$database_revenuecon = "revenuedb";
$username_revenuecon = "root";
$password_revenuecon = "0778043341";
$revenuecon = mysql_pconnect($hostname_revenuecon, $username_revenuecon, $password_revenuecon) or trigger_error(mysql_error(),E_USER_ERROR); 
$updateSQL = sprintf("UPDATE stampduty SET dataentrydate='2018-08-08' where id=29520 or id=29521");
$Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());

?>