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
<div align="left"><a href="<?php if (isset($_SESSION['MM_Username'])) 			{echo $logoutAction; }
	  else {echo 'login.php';}
	  ?>" 
      class="button button2"> <?php if (isset($_SESSION['MM_Username'])) { echo 'Logout '.$_SESSION['MM_Username'];} else {echo 'Login';} ?>
</a><a href="handout.pdf">Help</a></div>
<table width="626" border="0"  >
<tr>
      <td width="100" height="100"><a href="AddStampDutyEntry.php" class="button button1"><img src="addstampduty.jpg" width="100" height="100" alt="Add Stamp Duty Slip" title="Add Stamp Duty Slip"/></a></td>
      <td width="100"><a href="addcashreceipt.php" class="button button3"><img src="addcashreceipt.jpg" width="100" height="100" alt="Add Cash Receipt Detail" title="Add Cash Receipt Detail"/></a></td>
      <td width="100"><a href="datepicker.php?selection=13" class="button button3"><img src="liststampduty.jpg" width="100" height="100" alt="Stamp Duty Daily Summary" title="Stamp Duty Daily Summary"/></a></td>
      <td width="100"><a href="datepicker.php?selection=14" class="button button1"><img src="stampdutymonthlyreport.jpg" width="100" height="100" alt="Stamp Duty Monthly Report" title="Stamp Duty Monthly Report"/></a></td>
      <td width="100"><a href="datepicker.php?selection=15" class="button button1"><img src="stampdutydataentrydate.jpg" width="100" height="100" alt="Stamp Duty Entry Date Summary" title="Stamp Duty Entry Date Summary" /></a></td>
      <td width="100"><a href="datelopicker1.php?" class="button button1"><img src="lomonthlysummarybook.jpg" width="100" height="100" alt="Stamp Duty Monthly Report Book" title="Stamp Duty Monthly Report Book" /></a></td>
      
    </tr>
    <tr>
      <td><a href="datepickerinitialbalance.php?selection=21" class="button button1"><img src="liststampduty.jpg" width="100" height="100" alt="Stamp Duty Slip Detail" title="Stamp Duty Slip Detail"/></a></td>
      <td><a href="cashreceiptsummary.php" class="button button3"><img src="listcashreceipt.jpg" width="100" height="100" alt="Cash Receipt Detail Summary" title="Cash Receipt Detail Summary"/></a></td>
      <td><a href="datepicker.php?selection=23" class="button button1"><img src="liststampduty.jpg" width="100" height="100" alt="Stamp Duty Bank Slip Summary" title="Stamp Duty Bank Slip Summary"/></a></td>
      <td><a href="datepicker.php?selection=42" class="button button1"><img src="addtionalstampdutymonthlyreport.jpg" width="100" height="100" alt="Additional Stamp Duty Monthly Report" title="Additional Stamp Duty Monthly Report"/></a></td>
      <td><a href="datepicker.php?selection=25" class="button button1"><img src="additionalstampdutydataentrydate.jpg" width="100" height="100" alt="Additional Stampduty data entry date" title="Additional Stampduty Data Entry Date Summary"/></a></td>
      <td><a href="datepicker.php?selection=26" class="button button1"><img src="unidentifiedstamp.jpg" width="100" height="100" alt="Unidentified Stamp Duty Slip Detail" title="Unidentified Stamp Duty Slip Detail" /></a></td>
    </tr>
    <tr>
      <td><a href="bankslip.php" class="button button2"><img src="addadditionalstampduty.jpg" width="100" height="100" alt="Add Additional Stamp Duty Bank Slip" title="Add Additional Stamp Duty Bank Slip"/></a></td>
      <td><a href="addloyer.php" class="button button5"><img src="addloyer.jpg" width="100" height="100" alt="Add New Atorney at Law" title="Add New Atorney at Law"/></a></td>
      <td><a href="datepickerft.php" class="button button1"><img src="loyerupdate.jpg" width="100" height="100" alt="Update Attorny at Law Name" title="Update Attorny at Law Name"/></a></td>
      <td><a href="datepicker.php?selection=34" class="button button3"><img src="cashreceiptmonthlyreport.jpg" width="100" height="100" alt="Cash Receipt Monthly Report" title="Cash Receipt Monthly Report"/></a></td>
      <td><a href="datepickerinitialbalance.php?selection=35" class="button button1"><img src="losummaryReport.jpg" width="100" height="100" alt="Local Authority Wise Monthly Report" title="Local Authority Wise Monthly Report"/></a></td>
      <td><a href="datepicker.php?selection=36" class="button button1"><img src="checklist.jpg" width="100" height="100" alt="Stamp Duty Slip Check List" title="Stamp Duty Slip Check List" /></a></td>
    </tr>
    <tr>
      <td><a href="datepicker.php?selection=41" class="button button2"><img src="listadditionalstampduty.jpg" width="100" height="100" alt="Addtional Stamp Duty Summary" title="Addtional Stamp Duty Summary"/></a></td>
      <td><a href="ListofAttornyatLaw.php" class="button button5"><img src="listloyer.jpg" width="100" height="100" alt="View List of Attorny at Law" title="View List of Attorny at Law"/></a></td>
      <td><a href="Adduser.php" class="button button2"><img src="adduser.jpg" width="100" height="100" alt="Add User" title="Add User"/></a></td>
      <td><a href="datepicker.php?selection=44" class="button button1"><img src="loyerpenalty.jpg" width="100" height="100" alt="Loyer Penalty" title="Loyer Penalty"/></a></td>
      <td><a href="datelopicker.php?" class="button button1"><img src="onelosummaryreport.jpg" width="100" height="100" alt="Stamp Duty Transfer" title="Stamp Duty Transfer"/></a></td>
      <td><a href="datepickerinitialbalance.php?selection=46" class="button button1"><img src="liststampdutyblank.jpg" width="100" height="100" alt="Local Authority Update" title="Local Authority Update"/></a></td>
    </tr>
</table>
<font color="#0000FF">
</div>
<marquee behavior="scroll" direction="right">
Powered By ASTP Tec Pvt Ltd, No: 49, 1st Cross Street, Jaffna. Phone: 021-2222674, 021-2228147
</marquee>
</font>
<p>&nbsp;</p>
<p>&nbsp;</p>
</body>
</html>
