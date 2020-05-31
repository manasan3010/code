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

$editFormAction = $_SERVER['PHP_SELF'];
if (isset($_SERVER['QUERY_STRING'])) {
  $editFormAction .= "?" . htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_POST["MM_insert"])) && ($_POST["MM_insert"] == "form2")) {
  $insertSQL = sprintf("INSERT INTO stampdutyfirst (deedno, deeddate, grantorname, grantoraddress, granteename, granteeaddress, amount, landdistrict, landvillage, landname, notaryid, localauthorityid, slipno, `date`, dataentrydate, nature) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
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
					   GetSQLValueString(date('Y-m-d'), "date"),
					   GetSQLValueString($_POST['nature'], "text"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($insertSQL, $revenuecon) or die(mysql_error());
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
</head>

<body>
<h1>Add Stamp Duty Entry</h1>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<form action="<?php echo $editFormAction; ?>" method="post" name="form2" id="form2">
  <table>
    <tr>
      <td>Deed No:</td>
      <td><input type="text" name="deedno" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Deed Date:</td>
      <td><input type="date" name="deeddate" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantor Name:</td>
      <td><input type="text" name="grantorname" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantor Address:</td>
      <td><input type="text" name="grantoraddress" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantee Name:</td>
      <td><input type="text" name="granteename" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Grantee Address:</td>
      <td><input type="text" name="granteeaddress" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Amount:</td>
      <td><input type="number" step="0.01" name="amount" value="" size="32" required="required" /></td>
    </tr>
    <tr  >
      <td  >Land District:</td>
      <td><select name="landdistrict">
        <?php 
do {  
?>
        <option value="<?php echo $row_districts['district']?>" ><?php echo $row_districts['district']?></option>
        <?php
} while ($row_districts = mysql_fetch_assoc($districts));
?>
      </select></td>
    </tr>
    <tr> 
    <td>Land GS Division</td>
     <td><input type="text" name="landvillage" value="" size="32" /></td>
    </tr>
    <tr> 
    <td>Land Address</td>
     <td><textarea name="landname" cols="32"></textarea></td>
    </tr>
    <tr  >
      <td  >Notary Id:</td>
      <td><select name="notaryid">
        <?php 
do {  
?>
        <option value="<?php echo $row_loyer['id']?>" ><?php echo $row_loyer['loyername']?></option>
        <?php
} while ($row_loyer = mysql_fetch_assoc($loyer));
?>
      </select></td>
    </tr>
    <tr> </tr>
    <tr  >
      <td  >Local Authority Id:</td>
      <td><select name="localauthorityid">
        <?php 
do {  
?>
        <option value="<?php echo $row_localautho['id']?>" ><?php echo $row_localautho['name']?></option>
        <?php
} while ($row_localautho = mysql_fetch_assoc($localautho));
?>
      </select></td>
    </tr>
    <tr> </tr>
    <tr  >
      <td  >Slip No:</td>
      <td><input type="number" name="slipno" value="" size="32" /></td>
    </tr>
    <tr  >
      <td  >Payment Date</td>
      <td><input type="date" name="date" value="<?php echo date('Y-m-d'); ?>" size="32" /></td>
    </tr>
    <tr  >
      <td  >Nature of Instrument</td>
      <td><select name="nature" id="nature">
        <option> </option>
        <option value="Transfer">Transfer</option>
        <option value="Donation">Donation</option>
      </select></td>
    </tr>
  </table>
  <p>
    <input type="hidden" name="MM_insert" value="form2" />
    <input type="submit" value="Insert record" />
  </p>
 
</form>
<p>&nbsp;</p>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($loyer);

mysql_free_result($localautho);

mysql_free_result($districts);
?>
