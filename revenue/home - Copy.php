<?php
//initialize the session
include("letterhead.php");
if (!isset($_SESSION)) {
  session_start();
}

// ** Logout the current user. **
$logoutAction = $_SERVER['PHP_SELF']."?doLogout=true";
if ((isset($_SERVER['QUERY_STRING'])) && ($_SERVER['QUERY_STRING'] != "")){
  $logoutAction .="&". htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_GET['doLogout'])) &&($_GET['doLogout']=="true")){
  //to fully log out a visitor we need to clear the session varialbles
  $_SESSION['MM_Username'] = NULL;
  $_SESSION['MM_UserGroup'] = NULL;
  $_SESSION['PrevUrl'] = NULL;
  unset($_SESSION['MM_Username']);
  unset($_SESSION['MM_UserGroup']);
  unset($_SESSION['PrevUrl']);
	
  $logoutGoTo = "home.php";
  if ($logoutGoTo) {
    header("Location: $logoutGoTo");
    exit;
  }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
<style type="text/css">
body {
	background-image: url(backtile.jpg);
	background-repeat: repeat;
}
</style>
</head>

<body>

<hr>
<a href="<?php if (isset($_SESSION['MM_Username'])) 			{echo $logoutAction; }
	  else {echo 'login.php';}
	  ?>" 
      class="button button2"> <?php if (isset($_SESSION['MM_Username'])) { echo 'Logout '.$_SESSION['MM_Username'];} else {echo 'Login';} ?></a>
      
<div align="left">
  <table width="1070" border="0"  >
    <tr>
      <td width="220" height="43"><a href="AddStampDutyEntry.php" class="button button1">Add Stamp Duty Bank Slip</a></td>
      <td width="207"><a href="addcashreceipt.php" class="button button3">Add Cash Receipt Detail</a></td>
      <td width="207"><a href="datepicker.php?selection=13" class="button button3">Stamp Duty Monthly Summary</a></td>
      <td width="207"><a href="datepicker.php?selection=14" class="button button1">Stamp Duty Monthly Report</a></td>
      <td width="207"><a href="datepicker.php?selection=15" class="button button1">Stamp Duty Entry Date Summary</a></td>
    </tr>
    <tr>
      <td><a href="datepicker.php?selection=21" class="button button1">Stamp Duty Bank Slip Summary</a></td>
      <td><a href="cashreceiptsummary.php" class="button button3">Cash Receipt Detail Summary</a></td>
      <td><a href="AddmultipleStampDutyEntry.php" class="button button1">Add Multiple Stamp Duty  Slips</a></td>
      <td><a href="datepicker.php?selection=42" class="button button1">Additional Stamp Duty Monthly Report</a></td>
      <td><a href="datepicker.php?selection=25" class="button button1">Additional Stamp Duty Entry Date Summary</a></td>
    </tr>
    <tr>
      <td><a href="bankslip.php" class="button button2">Add Additional Stamp Duty Bank Slip</a></td>
      <td><a href="addloyer.php" class="button button5">Add New Attorney at Law</a></td>
      <td><a href="AddmultipleadditionalStampDuty.php" class="button button1">Add Multiple Additional Stamp Duty  Slips</a></td>
      <td><a href="datepicker.php?selection=34" class="button button3">Cash Receipt Monthly Report</a></td>
      <td><a href="datepicker.php?selection=35" class="button button1">Local Authority Wise Monthly Subtotal</a></td>
    </tr>
    <tr>
      <td><a href="datepicker.php?selection=41" class="button button2">Addtional Stamp Duty Summary</a></td>
      <td><a href="ListofAttornyatLaw.php" class="button button5">View List of Attorny at Law</a></td>
      <td><div align="center"><a href="Adduser.php" class="button button2">Add User</a></div></td>
      <td><a href="datepicker.php?selection=44" class="button button1">Notary Summary Report</a></td>
      <td><a href="datelopicker.php?" class="button button1">Local Authority Monthly Report</a></td>
    </tr>
  </table>
</div>
<p>&nbsp;</p>
<p>&nbsp;</p>
</body>
</html>
