<?php require_once('Connections/revenuecon.php'); ?>
<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentrydown";
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
  $insertSQL = sprintf("INSERT INTO stampduty (fileNo, chargeno, nameofpayer, address1, address2, address3, duty, penalty, bank, chequeno, `date`, slipno, dataentrydate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                       GetSQLValueString($_POST['fileno'], "text"),
                       GetSQLValueString($_POST['chargeno'], "text"),
                       GetSQLValueString($_POST['name'], "text"),
                       GetSQLValueString($_POST['address1'], "text"),
                       GetSQLValueString($_POST['address2'], "text"),
                       GetSQLValueString($_POST['address3'], "text"),
                       GetSQLValueString($_POST['duty'], "double"),
                       GetSQLValueString($_POST['penalty'], "double"),
                       GetSQLValueString($_POST['bank'], "text"),
                       GetSQLValueString($_POST['chequeno'], "int"),
                       GetSQLValueString($_POST['paymentdate'], "date"),
                       GetSQLValueString($_POST['slipno'], "int"),
					   GetSQLValueString(date('Y-m-d'), "date"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($insertSQL, $revenuecon) or die(mysql_error());
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<script src="SpryAssets/SpryValidationTextField.js" type="text/javascript"></script>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<h1>Additional Stamp Duty Bank Slip</h1>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
  <table width="300" border="1">
  
    <tr>
      <th width="128" scope="row">Slip No</th>
      <td width="156"><label for="slipno"></label>
      <input type="text" name="slipno" id="slipno" /></td>
    </tr>
    <tr>
      <th scope="row">File No</th>
      <td><label for="fileno"></label>
      <input type="text" name="fileno" id="fileno" required="required"/></td>
    </tr>
    <tr>
      <th scope="row">Charge No</th>
      <td><label for="chargeno"></label>
      <input type="text" name="chargeno" id="chargeno" /></td>
    </tr>
    <tr>
      <th scope="row">Name</th>
      <td><label for="name"></label>
      <input type="text" name="name" id="name" /></td>
    </tr>
    <tr>
      <th scope="row">Address1</th>
      <td><label for="address1"></label>
      <input type="text" name="address1" id="address1" /></td>
    </tr>
    <tr>
      <th scope="row">Address2</th>
      <td><label for="address2"></label>
      <input type="text" name="address2" id="address2" /></td>
    </tr>
    <tr>
      <th scope="row">Address3</th>
      <td><label for="address3"></label>
      <input type="text" name="address3" id="address3" /></td>
    </tr>
    <tr>
      <th scope="row">Duty</th>
      <td><label for="duty"></label>
      <input type="number" step="0.01" name="duty" id="duty" /></td>
    </tr>
    <tr>
      <th scope="row">Penalty</th>
      <td><label for="penalty"></label>
      <input type="number"  step="0.01" name="penalty" id="penalty" /></td>
    </tr>
    <tr>
      <th scope="row">Name of Bank</th>
      <td><label for="bank"></label>
        <label for="bank2"></label>
        <select name="bank" id="bank2">
          <option value="Bank of Ceylon" selected="selected">Bank of Ceylon</option>
          <option value="Peoples Bank">Peoples Bank</option>
          <option value="Commercial Bank">Commercial Bank</option>
          <option value="Hatton National Bank">Hatton National Bank</option>
          <option value="HSBC">HSBC</option>
          <option value="DFCC">DFCC</option>
          <option value="NDB">NDB</option>
          <option value="HDFC">HDFC</option>
          <option value="Sampath Bank">Sampath Bank</option>
          <option value="Pan Asia Bank">Pan Asia Bank</option>
      </select></td>
    </tr>
    <tr>
      <th scope="row">Cheque No</th>
      <td><label for="chequeno"></label>
      <input type="text" name="chequeno" id="chequeno" /></td>
    </tr>
    <tr>
      <th scope="row"> Payment Date</th>
      <td><input type="date" name="paymentdate" id="paymentdate" value="<?php echo date('Y-m-d'); ?>"/></td>
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