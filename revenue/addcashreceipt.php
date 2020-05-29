<?php require_once('Connections/revenuecon.php'); ?>
<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentry,dataentrydown";
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

if ((isset($_POST["MM_insert"])) && ($_POST["MM_insert"] == "form1")) {
  $insertSQL = sprintf("INSERT INTO cashreceipt (`date`, Reservedfrom, duty, penalty, amount, reason, fileno) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                       GetSQLValueString($_POST['date'], "date"),
                       GetSQLValueString($_POST['receivedfrom'], "text"),
                       GetSQLValueString($_POST['duty'], "double"),
					   GetSQLValueString($_POST['penalty'], "double"),
					   GetSQLValueString($_POST['duty']+ $_POST['penalty'], "double"),
                       GetSQLValueString($_POST['reason'], "text"),
                       GetSQLValueString($_POST['fileno'].$_POST['filenotext'], "text"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($insertSQL, $revenuecon) or die(mysql_error());
echo "\x07";
  $insertGoTo = "cashreceipt.php";
  if (isset($_SERVER['QUERY_STRING'])) {
    $insertGoTo .= (strpos($insertGoTo, '?')) ? "&" : "?";
    $insertGoTo .= $_SERVER['QUERY_STRING'];
  }
  header(sprintf("Location: %s", $insertGoTo));
}

mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = "SELECT distinct fileNo FROM stampdutyfirst ORDER BY fileNo DESC";
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
</head>

<body>
<h1>Add Cash Receipt</h1>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
  <table width="auto" border="0">
    <tr>
      <th scope="row">Date</th>
      <td><label for="date"></label>
      <input type="date" name="date" id="date" value="<?php echo date('Y-m-d'); ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Received From</th>
      <td><label for="receivedfrom"></label>
      <input type="text" name="receivedfrom" id="receivedfrom" required="required"/></td>
    </tr>
    <tr>
      <th scope="row">Stamp Duty</th>
      <td>
        <input type="number" name="duty" id="duty" step=".01" />
      </label></td>
    </tr>
     <tr>
       <th scope="row">Penalty</th>
       <td><input type="number" name="penalty" id="penalty" step=".01" /></td>
     </tr>
     <tr>
       <th scope="row">Total</th>
       <td><input type="number" name="amount" id="amount" disabled="disabled"step=".01" /></td>
     </tr>
     <tr>
      <th scope="row">Amount in words</th>
      <td><label for="amount">
        <input name="amountword" type="text" disabled="disabled" id="amountword" readonly="readonly" />
      </label></td>
    </tr>
    <tr>
      <th scope="row">Reason</th>
      <td><label for="reason"></label>
      <input name="reason" type="text" id="reason" value="Additional Stamp Duty / Penalty" readonly="readonly"/></td>
    </tr>
    <tr>
      <th scope="row">fileno</th>
      <td><p>
        <label for="fileno"></label>
        <label for="fileno2"></label>
        <select name="fileno" id="fileno2">
          <?php
do {  
?>
          <option value="<?php echo $row_Recordset1['fileNo']?>"><?php echo $row_Recordset1['fileNo']?></option>
          <?php
} while ($row_Recordset1 = mysql_fetch_assoc($Recordset1));
  $rows = mysql_num_rows($Recordset1);
  if($rows > 0) {
      mysql_data_seek($Recordset1, 0);
	  $row_Recordset1 = mysql_fetch_assoc($Recordset1);
  }
?>
        </select>
      </p>
      <p>
        <label for="filenotext"></label>
        <input type="text" name="filenotext" id="filenotext" />
      </p></td>
    </tr>
  </table>
  <p>
    <input type="submit" name="submit" id="submit" value="Submit" />
  </p>
  <input type="hidden" name="MM_insert" value="form1" /> 
 
</form>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
