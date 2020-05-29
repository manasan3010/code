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

if ((isset($_POST["MM_update"])) && ($_POST["MM_update"] == "form1")) {
  $updateSQL = sprintf("UPDATE stampduty SET fileNo=%s, chargeno=%s, nameofpayer=%s, address1=%s, address2=%s, address3=%s, duty=%s, penalty=%s, bank=%s, chequeno=%s, `date`=%s, slipno=%s WHERE id=%s",
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
                       GetSQLValueString($_POST['hiddenField'], "int"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());

  $updateGoTo = "home.php";
  if (isset($_SERVER['QUERY_STRING'])) {
    $updateGoTo .= (strpos($updateGoTo, '?')) ? "&" : "?";
    $updateGoTo .= $_SERVER['QUERY_STRING'];
  }
  header(sprintf("Location: %s", $updateGoTo));
}

$colname_Recordset1 = "-1";
if (isset($_GET['id'])) {
  $colname_Recordset1 = $_GET['id'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = sprintf("SELECT * FROM stampduty WHERE id = %s", GetSQLValueString($colname_Recordset1, "int"));
$Recordset1 = mysql_query($query_Recordset1, $revenuecon) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<script src="SpryAssets/SpryValidationTextField.js" type="text/javascript"></script>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
<script>
function goBack() {
    window.history.back();
}
</script>
</head>

<body>
<h1>Update Additional Stamp Duty Bank Slip</h1>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a><img src="back.jpg" width="40" height="40" alt="Back" onclick="goBack()" />
<form action="<?php echo $editFormAction; ?>" id="form1" name="form1" method="POST">
  <table width="300" border="1">
  
    <tr>
      <th width="128" scope="row">Slip No</th>
      <td width="156"><label for="slipno"></label>
      <input name="slipno" type="text" id="slipno" value="<?php echo $row_Recordset1['slipno']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">File No</th>
      <td><label for="fileno"></label>
      <input name="fileno" type="text" id="fileno" value="<?php echo $row_Recordset1['fileNo']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Charge No</th>
      <td><label for="chargeno"></label>
      <input name="chargeno" type="text" id="chargeno" value="<?php echo $row_Recordset1['chargeno']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Name</th>
      <td><label for="name"></label>
      <input name="name" type="text" id="name" value="<?php echo $row_Recordset1['nameofpayer']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Address1</th>
      <td><label for="address1"></label>
      <input name="address1" type="text" id="address1" value="<?php echo $row_Recordset1['address1']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Address2</th>
      <td><label for="address2"></label>
      <input name="address2" type="text" id="address2" value="<?php echo $row_Recordset1['address2']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Address3</th>
      <td><label for="address3"></label>
      <input name="address3" type="text" id="address3" value="<?php echo $row_Recordset1['address3']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Duty</th>
      <td><label for="duty"></label>
      <input name="duty" type="number" id="duty" value="<?php echo $row_Recordset1['duty']; ?>" step="0.01"/></td>
    </tr>
    <tr>
      <th scope="row">Penalty</th>
      <td><label for="penalty"></label>
      <input name="penalty" type="number" id="penalty" step="0.01" value="<?php echo $row_Recordset1['penalty']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Name of Bank</th>
      <td><label for="bank"></label>
        <label for="bank2"></label>
        <select name="bank" id="bank2">
          <option value="Bank of Ceylon" <?php if (strcmp($row_Recordset1['bank'],'Bank of Ceylon')==0) echo "selected='selected'"; ?>>Bank of Ceylon</option>
          <option value="Peoples Bank" <?php if (strcmp($row_Recordset1['bank'],'Peoples Bank')==0) echo "selected='selected'"; ?>>Peoples Bank</option>
          <option value="Commercial Bank" <?php if (strcmp($row_Recordset1['bank'],'Commercial Bank')==0) echo "selected='selected'"; ?>>Commercial Bank</option>
          <option value="Hatton National Bank" <?php if (strcmp($row_Recordset1['bank'],'Hatton National Bank')==0) echo "selected='selected'"; ?>>Hatton National Bank</option>
          <option value="HSBC" <?php if (strcmp($row_Recordset1['bank'],'HSBC')==0) echo "selected='selected'"; ?>>HSBC</option>
          <option value="DFCC" <?php if (strcmp($row_Recordset1['bank'],'DFCC')==0) echo "selected='selected'"; ?>>DFCC</option>
          <option value="NDB" <?php if (strcmp($row_Recordset1['bank'],'NDB')==0) echo "selected='selected'"; ?>>NDB</option>
          <option value="HDFC" <?php if (strcmp($row_Recordset1['bank'],'HDFC')==0) echo "selected='selected'"; ?>>HDFC</option>
          <option value="Sampath Bank" <?php if (strcmp($row_Recordset1['Sampath Bank'],'Commercial Bank')==0) echo "selected='selected'"; ?>>Sampath Bank</option>
          <option value="Pan Asia Bank" <?php if (strcmp($row_Recordset1['bank'],'Commercial Bank')==0) echo "selected='selected'"; ?>>Pan Asia Bank</option>
      </select></td>
    </tr>
    <tr>
      <th scope="row">Cheque No</th>
      <td><label for="chequeno"></label>
      <input name="chequeno" type="text" id="chequeno" value="<?php echo $row_Recordset1['chequeno']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Date</th>
      <td><input name="paymentdate" type="date" id="paymentdate" value="<?php echo $row_Recordset1['date']; ?>" /></td>
    </tr>
   
  
  </table>
  <p>
    <input type="submit" name="submit" id="submit" value="Submit" />
    <input name="hiddenField" type="hidden" id="hiddenField" value="<?php echo $row_Recordset1['id']; ?>" />
  </p>
  <input type="hidden" name="MM_update" value="form1" />
</form>


</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
