<?php require_once('Connections/revenuecon.php'); ?>
<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentry";
$MM_donotCheckaccess = "false";

// *** Restrict Access To Page: Grant or deny access to this page
function isAuthorized($strUsers, $strGroups, $UserName, $UserGroup) { 
  // For security, start by assuming the visitor is NOT authorized. 
  $isValid = False; 

  // When a visitor has logged into this site, the Session variable MM_Username set equal to their username. 
  // Therefore, we know that a user is NOT logged in if that Session variable is blank. 
  if (!empty($UserName)) { 
    // Besides being logged in, you may restrict access to only certain users based on an ID established when they login. 
    // Parse the strings into arrays. 
    $arrUsers = Explode(",", $strUsers); 
    $arrGroups = Explode(",", $strGroups); 
    if (in_array($UserName, $arrUsers)) { 
      $isValid = true; 
    } 
    // Or, you may restrict access to only certain users based on their username. 
    if (in_array($UserGroup, $arrGroups)) { 
      $isValid = true; 
    } 
    if (($strUsers == "") && false) { 
      $isValid = true; 
    } 
  } 
  return $isValid; 
}

$MM_restrictGoTo = "login.php";
if (!((isset($_SESSION['MM_Username'])) && (isAuthorized("",$MM_authorizedUsers, $_SESSION['MM_Username'], $_SESSION['MM_UserGroup'])))) {   
  $MM_qsChar = "?";
  $MM_referrer = $_SERVER['PHP_SELF'];
  if (strpos($MM_restrictGoTo, "?")) $MM_qsChar = "&";
  if (isset($_SERVER['QUERY_STRING']) && strlen($_SERVER['QUERY_STRING']) > 0) 
  $MM_referrer .= "?" . $_SERVER['QUERY_STRING'];
  $MM_restrictGoTo = $MM_restrictGoTo. $MM_qsChar . "accesscheck=" . urlencode($MM_referrer);
  header("Location: ". $MM_restrictGoTo); 
  exit;
}
?>
<?php
if (!function_exists("GetSQLValueString")) {
function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") 
{
  if (PHP_VERSION < 6) {
    $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
  }

  $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

  switch ($theType) {
    case "text":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;    
    case "long":
    case "int":
      $theValue = ($theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = ($theValue != "") ? doubleval($theValue) : "NULL";
      break;
    case "date":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
    case "defined":
      $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
      break;
  }
  return $theValue;
}
}
$colname_stampduty = "-1";
if (isset($_GET['id'])) {
  $colname_stampduty = $_GET['id'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_stampduty = sprintf("SELECT * FROM stampdutyfirst WHERE id = %s", GetSQLValueString($colname_stampduty, "int"));
$stampduty = mysql_query($query_stampduty, $revenuecon) or die(mysql_error());
$row_stampduty = mysql_fetch_assoc($stampduty);
$totalRows_stampduty = mysql_num_rows($stampduty);
$previousloid=$row_stampduty['localauthorityid'];

$editFormAction = $_SERVER['PHP_SELF'];
if (isset($_SERVER['QUERY_STRING'])) {
  $editFormAction .= "?" . htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_POST["MM_update"])) && ($_POST["MM_update"] == "form2")) {
		 $updateSQL = sprintf("UPDATE stampdutyfirst SET notaryid=%s  WHERE id=%s",
                       GetSQLValueString($_POST['notaryid'], "int"),
                       GetSQLValueString($_POST['hiddenField'], "int"));
	
  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());

// goto next record to update
  $updateGoTo = "updateStampDutyNotaryname.php?id=". ($_POST['hiddenField']+1);
  header(sprintf("Location: %s", $updateGoTo));
}

mysql_select_db($database_revenuecon, $revenuecon);
$query_loyer = "SELECT id, loyername, address FROM loyers1 order by loyername";
$loyer = mysql_query($query_loyer, $revenuecon) or die(mysql_error());
$row_loyer = mysql_fetch_assoc($loyer);
$totalRows_loyer = mysql_num_rows($loyer);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
<script>
function goBack() {
    window.history.back();
}
function next() {
	var i=Integer.parseInt(document.getElementById('next').alt)+1;
	alert(i);
   window.location.href = "updatestampdutyentry.php?id=" + i ;
}

</script>

</head>

<body>
<h1>Update Stamp Duty Entry</h1>
<a href="home.php"><img src="homelogo.jpg" width="40" height="40" alt="Home" /></a>
<img src="back.jpg" width="40" height="40" alt="Back" onclick="goBack()" /> 


<form action="<?php echo $editFormAction; ?>" method="POST" name="form2" id="form2"  >

  <table>
    <tr>
      <td>Deed No:</td>
      <td><input type="text" name="deedno" value="<?php echo $row_stampduty['deedno']; ?>" size="32"/> </td>
    </tr>
    <tr  >
      <td  >Deed Date:</td>
      <td><input type="date" name="deeddate" value="<?php echo $row_stampduty['deeddate']; ?>" size="32"/></td>
    </tr>
    <tr  >
      <td  >Payment Date</td>
     
      <td><input type="date" name="date" value="<?php echo $row_stampduty['date']; ?>" size="32" /></td>
      
    </tr>
    <tr  >
      <td  >Notary :</td>
      <td><select name="notaryid" title="<?php echo $row_stampduty['notaryid']; ?>" />
        <?php 
do {  
?>
        <option value="<?php echo $row_loyer['id']?>" <?php if (strcmp($row_loyer['id'],$row_stampduty['notaryid'])==0) echo " selected='selected'"; ?> ><?php echo $row_loyer['loyername'].' : '.$row_loyer['address']?></option>
        <?php
} while ($row_loyer = mysql_fetch_assoc($loyer));
?>
      </select></td>
    </tr>
  </table>
  <input type="submit" value="Update" accesskey="u" />
  <input name="hiddenField" type="hidden" id="hiddenField" value="<?php echo $row_stampduty['id']; ?>" />
  <input type="hidden" name="MM_update" value="form2" />
  <input name="previousloid" type="hidden" id="previousloid" value="<?php echo $row_stampduty['localauthorityid']; ?>" />
  <input type="hidden" name="loidentifieddate" id="loidentifieddate" value="<?php echo date('Y-m-d'); ?>" />
  
</form>

</body>
</html>
<?php
mysql_free_result($loyer);

mysql_free_result($stampduty);
?>
