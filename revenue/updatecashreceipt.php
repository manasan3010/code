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

if ((isset($_POST["MM_update"])) && ($_POST["MM_update"] == "form1")) {
  $updateSQL = sprintf("UPDATE cashreceipt SET `date`=%s, Reservedfrom=%s, amount=%s, reason=%s, amountword=%s, fileno=%s, penalty=%s, duty=%s WHERE receiptID=%s",
                       GetSQLValueString($_POST['date'], "date"),
                       GetSQLValueString($_POST['receivedfrom'], "text"),
                       GetSQLValueString($_POST['penalty']+$_POST['duty'], "double"),
                       GetSQLValueString($_POST['reason'], "text"),
                       GetSQLValueString($_POST['amountword'], "text"),
					   GetSQLValueString($_POST['fileno'], "text"),
                       
					   GetSQLValueString($_POST['penalty'], "double"),
					   GetSQLValueString($_POST['duty'], "double"),
					   GetSQLValueString($_POST['receiptID'], "int")
					   );
echo $updateSQL;
  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());
/*
  $updateGoTo = "home.php";
  if (isset($_SERVER['QUERY_STRING'])) {
    $updateGoTo .= (strpos($updateGoTo, '?')) ? "&" : "?";
    $updateGoTo .= $_SERVER['QUERY_STRING'];
  }
  header(sprintf("Location: %s", $updateGoTo));
  */
}

$colname_cashreceipt = "-1";
if (isset($_GET['receiptID'])) {
  $colname_cashreceipt = $_GET['receiptID'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_cashreceipt = sprintf("SELECT * FROM cashreceipt WHERE receiptID = %s", GetSQLValueString($colname_cashreceipt, "int"));
$cashreceipt = mysql_query($query_cashreceipt, $revenuecon) or die(mysql_error());
$row_cashreceipt = mysql_fetch_assoc($cashreceipt);
$totalRows_cashreceipt = mysql_num_rows($cashreceipt);

mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = "SELECT distinct fileno FROM stampduty order by fileno ";
$Recordset1 = mysql_query($query_Recordset1, $revenuecon) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);
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
</script>
</head>

<body>
<h1>Update Cash Receipt</h1>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a><img src="back.jpg" width="40" height="40" alt="Back" onclick="goBack()" />
<form action="<?php echo $editFormAction; ?>" id="form1" name="form1" method="POST">
  <table width="auto" border="0">
    <tr>
      <th scope="row">Date</th>
      <td><label for="date"></label>
      <input name="date" type="date" id="date" value="<?php echo $row_cashreceipt['date']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Received From</th>
      
      <td><label for="receivedfrom"></label>
      <input name="receivedfrom" type="text" id="receivedfrom" value="<?php echo $row_cashreceipt['Reservedfrom']; ?>" /></td>
    </tr>
     <tr>
      <th scope="row">Stamp Duty</th>
      <td>
        <input name="duty" type="number" id="duty" value="<?php echo $row_cashreceipt['duty']; ?>" step=".01" />
      </label></td>
    </tr>
     <tr>
       <th scope="row">Penalty</th>
       <td><input name="penalty" type="number" id="penalty" value="<?php echo $row_cashreceipt['penalty']; ?>" step=".01" /></td>
     </tr>
    <tr>
      <th scope="row">Amount in words</th>
      <td><label for="amountword"></label>
      <input name="amountword" type="text" id="amountword" value="<?php echo $row_cashreceipt['amountword']; ?>" readonly="readonly" /></td>
    </tr>
     <tr>
      <th scope="row">Amount</th>
      <td><label for="amount"></label>
      <input name="amount" type="text" disabled="disabled" id="amount" value="<?php echo $row_cashreceipt['amount']; ?>"  step="0.01"  /></td>
    </tr>
    <tr>
      <th scope="row">Reason</th>
      <td><label for="reason"></label>
      <input name="reason" type="text" id="reason" value="<?php echo $row_cashreceipt['reason']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">fileno</th>
      <td><label for="fileno"></label>
        <label for="fileno"></label>
        <label for="fileno2"></label>
        <select name="fileno" id="fileno2">
          <?php
do {  
?>
          <option value="<?php echo $row_Recordset1['fileno']?>" <?php if (strcmp($row_Recordset1['fileno'],$row_cashreceipt['fileno'])==0) echo "selected='selected'"; ?>><?php echo $row_Recordset1['fileno']?></option>
          <?php
} while ($row_Recordset1 = mysql_fetch_assoc($Recordset1));
  $rows = mysql_num_rows($Recordset1);
  if($rows > 0) {
      mysql_data_seek($Recordset1, 0);
	  $row_Recordset1 = mysql_fetch_assoc($Recordset1);
  }
?>
        </select></td>
    </tr>
  </table>
  <p>
    <input type="submit" name="submit" id="submit" value="Submit" />
    <input name="receiptID" type="hidden" id="receiptID" value="<?php echo $row_cashreceipt['receiptID']; ?>" />
  </p>
  <input type="hidden" name="MM_update" value="form1" />
</form>

</body>
</html>
<?php
mysql_free_result($cashreceipt);

mysql_free_result($Recordset1);
?>
