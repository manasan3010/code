<?php require_once('Connections/revenuecon.php'); ?>
<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataupdate,dataentry,dataentrydown";
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
	if (strcmp($_SESSION['MM_UserGroup'],'dataupdate')==0) 
	{
		 $updateSQL = sprintf("UPDATE stampdutyfirst SET  grantorname=%s, grantoraddress=%s, granteename=%s, granteeaddress=%s,  landvillage=%s, landname=%s,  nature=%s, updateok=1, extend=%s, consideration=%s, gndivisionno=%s WHERE id=%s",
                      
                       GetSQLValueString($_POST['grantorname'], "text"),
                       GetSQLValueString($_POST['grantoraddress'], "text"),
                       GetSQLValueString($_POST['granteename'], "text"),
                       GetSQLValueString($_POST['granteeaddress'], "text"),
                       GetSQLValueString($_POST['landvillage'], "text"),
                       GetSQLValueString($_POST['landname'], "text"),
                       GetSQLValueString($_POST['nature'], "text"),
					   GetSQLValueString($_POST['extend'], "text"),
					   GetSQLValueString($_POST['consideration'], "double"),
                       GetSQLValueString($_POST['gndivisionno'], "text"),
					   GetSQLValueString($_POST['hiddenField'], "int"));
		}
	else if (strcmp($_SESSION['MM_UserGroup'],'dataentry')==0) 
	{
  $updateSQL = sprintf("UPDATE stampdutyfirst SET deedno=%s, deeddate=%s, grantorname=%s, grantoraddress=%s, granteename=%s, granteeaddress=%s, amount=%s, landdistrict=%s, landvillage=%s, landname=%s, notaryid=%s, localauthorityid=%s, slipno=%s, `date`=%s, nature=%s, fileno=%s, marketvalue=%s, extend=%s, consideration=%s, gndivisionno=%s WHERE id=%s",
                       GetSQLValueString($_POST['deedno'], "text"),
                       GetSQLValueString($_POST['deeddate'], "date"),
                       GetSQLValueString($_POST['grantorname'], "text"),
                       GetSQLValueString($_POST['grantoraddress'], "text"),
                       GetSQLValueString($_POST['granteename'], "text"),
                       GetSQLValueString($_POST['granteeaddress'], "text"),
                       GetSQLValueString($_POST['amount'], "double"),
                       GetSQLValueString($_POST['landdistrict'], "text"),
                       GetSQLValueString($_POST['landvillage'], "text"),
                       GetSQLValueString($_POST['landname'], "text"),
                       GetSQLValueString($_POST['notaryid'], "int"),
                       GetSQLValueString($_POST['localauthorityid'], "int"),
                       GetSQLValueString($_POST['slipno'], "int"),
                       GetSQLValueString($_POST['date'], "date"),
					   GetSQLValueString($_POST['nature'], "text"),
					   GetSQLValueString($_POST['fileno'], "text"),
					   GetSQLValueString($_POST['marketvalue'], "text"),
					   GetSQLValueString($_POST['extend'], "text"),
					   GetSQLValueString($_POST['consideration'], "double"),
                       GetSQLValueString($_POST['gndivisionno'], "text"),
                       GetSQLValueString($_POST['hiddenField'], "int"));
	}
	else if (strcmp($_SESSION['MM_UserGroup'],'dataentrydown')==0) 
	{
  $updateSQL = sprintf("UPDATE stampdutyfirst SET nature=%s, fileno=%s, marketvalue=%s WHERE id=%s",
                       GetSQLValueString($_POST['nature'], "text"),
					   GetSQLValueString($_POST['fileno'], "text"),
					   GetSQLValueString($_POST['marketvalue'], "text"),
                       GetSQLValueString($_POST['hiddenField'], "int"));
	}
	
  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());


$currentloid=$_POST['localauthorityid'];
if (($previousloid==0 || $previousloid==35) && ($currentloid>0 && $currentloid<>35))
{
	$updateSQL = sprintf("UPDATE stampdutyfirst SET loidentifieddate=%s WHERE id=%s",
                       GetSQLValueString($_POST['loidentifieddate'], "date"),
                       GetSQLValueString($_POST['hiddenField'], "int"));
	
	
  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());
  }
// goto next record to update
  $updateGoTo = "updateStampDutyEntry.php?id=". ($_POST['hiddenField']+1);
  /*
   if (isset($_SERVER['QUERY_STRING'])) {
    $updateGoTo .= (strpos($updateGoTo, '?')) ? "&" : "?";
    $updateGoTo .= $_SERVER['QUERY_STRING'];
  }
  */
   header(sprintf("Location: %s", $updateGoTo));
  
 
}

mysql_select_db($database_revenuecon, $revenuecon);
$query_loyer = "SELECT id, loyername, address FROM loyers1 order by loyername";
$loyer = mysql_query($query_loyer, $revenuecon) or die(mysql_error());
$row_loyer = mysql_fetch_assoc($loyer);
$totalRows_loyer = mysql_num_rows($loyer);

mysql_select_db($database_revenuecon, $revenuecon);
$query_localautho = "SELECT * FROM localauthorities";
$localautho = mysql_query($query_localautho, $revenuecon) or die(mysql_error());
$row_localautho = mysql_fetch_assoc($localautho);
$totalRows_localautho = mysql_num_rows($localautho);

mysql_select_db($database_revenuecon, $revenuecon);
$query_districts = "SELECT * FROM districtlist";
$districts = mysql_query($query_districts, $revenuecon) or die(mysql_error());
$row_districts = mysql_fetch_assoc($districts);
$totalRows_districts = mysql_num_rows($districts);



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
      <td><input type="text" name="deedno" value="<?php echo $row_stampduty['deedno']; ?>" size="32" 
	  <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Deed Date:</td>
      <td><input type="date" name="deeddate" value="<?php echo $row_stampduty['deeddate']; ?>" size="32" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Grantor Name:</td>
      <td><input name="grantorname" type="text" value="<?php echo $row_stampduty['grantorname']; ?>" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantor Address:</td>
      <td><input type="text" name="grantoraddress" value="<?php echo $row_stampduty['grantoraddress']; ?>" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantee Name:</td>
      <td><input type="text" name="granteename" value="<?php echo $row_stampduty['granteename']; ?>" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantee Address:</td>
      <td><input type="text" name="granteeaddress" value="<?php echo $row_stampduty['granteeaddress']; ?>" size="32" /></td>
    </tr>
    <tr  >
      <td  >Amount:</td>
      <td><input name="amount" type="number" step="0.01" value="<?php echo $row_stampduty['amount']; ?>" size="32" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Land District:</td>
      <td><select name="landdistrict" title="<?php echo $row_stampduty['landdistrict']; ?>" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " disabled='disabled'"; ?>>
        <?php 
do {  
?>
        <option value="<?php echo $row_districts['district']?>" <?php if (strcmp($row_districts['district'],$row_stampduty['landdistrict'])==0) echo "selected='selected'"; ?>><?php echo $row_districts['district']?></option>
        <?php
} while ($row_districts = mysql_fetch_assoc($districts));
?>
      </select></td>
    </tr>
   <tr> 
    <td>Land GS Division</td>
     <td><input type="text" name="landvillage" value="<?php echo $row_stampduty['landvillage']; ?>" size="32"/></td>
    </tr>
    <tr>
      <td>Land GS Division No</td>
      <td><input name="gndivisionno" type="text"  id="gndivisionno" value="<?php echo $row_stampduty['gndivisionno']; ?>" size="32" <?php // if (strcmp($_SESSION['MM_UserGroup'],'dataupdate')==0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr> 
    <td>Land Address</td>
     <td><textarea name="landname" cols="32"><?php echo $row_stampduty['landname']; ?></textarea></td>
    </tr>
    <tr  >
      <td  >Notary :</td>
     
      <td><select name="notaryid" title="<?php echo $row_stampduty['notaryid']; ?>" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentrydown')==0 || strcmp($_SESSION['MM_UserGroup'],'dataupdate')==0 ) echo " disabled='disabled'"; ?>>
        <?php 
do {  
?>
        <option value="<?php echo $row_loyer['id']?>" <?php if (strcmp($row_loyer['id'],$row_stampduty['notaryid'])==0) echo "selected='selected'"; ?> ><?php echo $row_loyer['loyername'].' : '.$row_loyer['address']?></option>
        <?php
} while ($row_loyer = mysql_fetch_assoc($loyer));
?>
      </select></td>
      
    </tr>
    <tr  >
      <td  >Local Authority :</td>
      <td><select name="localauthorityid" title="<?php echo $row_stampduty['localauthorityid']; ?>" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " disabled='disabled'"; ?>>
        <?php 
do {  
?>
        <option value="<?php echo $row_localautho['id']?>" <?php if (strcmp($row_localautho['id'],$row_stampduty['localauthorityid'])==0) echo "selected='selected'"; ?>><?php echo $row_localautho['name']?></option>
        <?php
} while ($row_localautho = mysql_fetch_assoc($localautho));
?>
      </select></td>
    </tr>
    <tr  >
      <td  >Slip No:</td>
      <td><input type="text" name="slipno" value="<?php echo $row_stampduty['slipno']; ?>" size="32" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Payment Date</td>
      <td><input type="date" name="date" value="<?php echo $row_stampduty['date']; ?>" size="32" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataentry')!=0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Nature of Instrument</td>
      <td><select name="nature" id="nature">
        <option value="Transfer" <?php if (strcmp($row_stampduty['nature'],"Transfer")==0) echo "selected='selected'";?>>Transfer</option>
        <option value="Donation" <?php if (strcmp($row_stampduty['nature'],"Donation")==0) echo "selected='selected'";?>>Donation</option>
      </select></td>
    </tr>
    <tr  >
      <td  >File No</td>
      <td><input name="fileno" type="text" id="fileno" value="<?php echo $row_stampduty['fileno']; ?>" size="32" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataupdate')==0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Market Value</td>
      <td><input name="marketvalue" type="number" step="0.01" id="marketvalue" value="<?php echo $row_stampduty['marketvalue']; ?>" size="32" <?php if (strcmp($_SESSION['MM_UserGroup'],'dataupdate')==0) echo " readonly='readonly'"; ?>/></td>
    </tr>
    <tr  >
      <td  >Consideration</td>
      <td><input name="consideration" type="number" step="0.01" id="consideration" value="<?php echo $row_stampduty['consideration']; ?>" size="32" /></td>
    </tr>
    <tr  >
      <td  >Extend of Land</td>
      <td><input type="text" name="extend" value="<?php echo $row_stampduty['extend']; ?>" size="32" /></td>
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

mysql_free_result($localautho);

mysql_free_result($districts);

mysql_free_result($stampduty);
?>
