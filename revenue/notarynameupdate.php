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

$startdate_sdfirst = $_GET['startdate'];
if (isset($_GET['startdate'])) {
  $startdate_sdfirst = $_GET['startdate'];
}
$enddate_sdfirst = $_GET['enddate'];
if (isset($_GET['enddate'])) {
  $enddate_sdfirst = $_GET['enddate'];
}

mysql_select_db($database_revenuecon, $revenuecon);
$query_sdfirst = sprintf("SELECT stampdutyfirst.id, stampdutyfirst.deedno, stampdutyfirst.deeddate, stampdutyfirst.amount,  stampdutyfirst.dataentrydate, stampdutyfirst.`date` FROM stampdutyfirst WHERE stampdutyfirst.dataentrydate between  %s and %s and isnull(stampdutyfirst.notaryid) or stampdutyfirst.notaryid=0", GetSQLValueString($startdate_sdfirst, "date"),GetSQLValueString($enddate_sdfirst, "date"));
$sdfirst = mysql_query($query_sdfirst, $revenuecon) or die(mysql_error());
$row_sdfirst = mysql_fetch_assoc($sdfirst);
$totalRows_sdfirst = mysql_num_rows($sdfirst);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<h2>Notary Name Update</h2>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<table width="auto" border="1">
  <tr>
    <th scope="col">ID</th>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
    <th scope="col">Payment Date</th>
    <th scope="col">Amount</th>
    <th scope="col">Name of Notary</th>
    <th scope="col">Data Entry Date</th>
  </tr>
  <?php do { ?>
    <tr>
      <td><a href="updateStampDutyNotaryname.php?id=<?php echo $row_sdfirst['id']; ?>"><?php echo $row_sdfirst['id']; ?></a></td>
      <td><?php echo $row_sdfirst['deedno']; ?></td>
      <td><?php echo $row_sdfirst['deeddate']; ?></td>
      <td><?php echo $row_sdfirst['date']; ?></td>
      <td><?php echo $row_sdfirst['amount']; ?></td>
      <td>&nbsp;</td>
      <td><?php echo $row_sdfirst['dataentrydate']; ?></td>
    </tr>
    <?php } while ($row_sdfirst = mysql_fetch_assoc($sdfirst)); ?>
</table>
</body>
</html>
<?php
mysql_free_result($sdfirst);
?>
