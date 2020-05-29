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
<?php require_once('Connections/revenuecon.php'); 
  $recordcount=10;
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
 
  $currentrecord=0;
  mysql_select_db($database_revenuecon, $revenuecon);
   do { 
   $currentrecord+=1;	
  $insertSQL = sprintf("INSERT INTO stampduty (fileNo, chargeno, nameofpayer, address1, address2, address3, duty, penalty, bank, chequeno, `date`, slipno, dataentrydate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                       GetSQLValueString($_POST['fileno'. $currentrecord], "text"),
                       GetSQLValueString($_POST['chargeno'. $currentrecord], "text"),
                       GetSQLValueString($_POST['name'. $currentrecord], "text"),
                       GetSQLValueString($_POST['address1'. $currentrecord], "text"),
                       GetSQLValueString($_POST['address2'. $currentrecord], "text"),
                       GetSQLValueString($_POST['address3'. $currentrecord], "text"),
                       GetSQLValueString($_POST['duty'. $currentrecord], "double"),
                       GetSQLValueString($_POST['penalty'. $currentrecord], "double"),
                       GetSQLValueString($_POST['bank'. $currentrecord], "text"),
                       GetSQLValueString($_POST['chequeno'. $currentrecord], "int"),
                       GetSQLValueString($_POST['paymentdate'. $currentrecord], "date"),
                       GetSQLValueString($_POST['slipno'. $currentrecord], "int"),
					   GetSQLValueString(date('Y-m-d'), "date"));

  
  if (strlen($_POST['fileno'. $currentrecord])>0){
  $Result1 = mysql_query($insertSQL, $revenuecon) or die(mysql_error());
  }
  } while ($currentrecord<=$recordcount);   
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<h1>Additional Stamp Duty Summary</h1>

<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
  <div style="overflow-x:auto;">
<table width="auto" border="1" class="hovertable">
  <tr>
    <th scope="col">File No</th>
    <th scope="col">Charge No</th>
    <th scope="col">Name of Payer</th>
    <th scope="col">Address1</th>
    <th scope="col">Address2</th>
    <th scope="col">Address3</th>
    <th scope="col">Duty</th>
    <th scope="col">Penalty</th>
    <th scope="col">Bank</th>
    <th scope="col">Cheque No</th>
    <th scope="col">Payment Date</th>
    <th scope="col">Slip No</th>
   
  </tr>
  <?php
 
   $currentrecord=0;
   do {
	   $currentrecord+=1; ?>
    <tr>
      <td><input type="text" name="fileno<?php echo $currentrecord; ?>" id="fileno<?php echo $currentrecord; ?>" required="required"/></td>
      <td><input type="text" name="chargeno<?php echo $currentrecord; ?>" id="chargeno<?php echo $currentrecord; ?>" /></td>
      <td><input type="text" name="name<?php echo $currentrecord; ?>" id="name<?php echo $currentrecord; ?>" required="required"/></td>
      <td><input type="text" name="address1<?php echo $currentrecord; ?>" id="address1<?php echo $currentrecord; ?>" /></td>
      <td><input type="text" name="address2<?php echo $currentrecord; ?>" id="address2<?php echo $currentrecord; ?>" /></td>
      <td><input type="text" name="address3<?php echo $currentrecord; ?>" id="address3<?php echo $currentrecord; ?>" /></td>
      <td><input type="number" step="0.01" name="duty<?php echo $currentrecord; ?>" id="duty<?php echo $currentrecord; ?>" /></td>
      <td><input type="number" step="0.01"  name="penalty<?php echo $currentrecord; ?>" id="penalty<?php echo $currentrecord; ?>" /></td>
      <td><input type="text" name="bank<?php echo $currentrecord; ?>" id="bank<?php echo $currentrecord; ?>" value="Bank of Ceylon"/></td>
      <td><input type="number" name="chequeno<?php echo $currentrecord; ?>" id="chequeno<?php echo $currentrecord; ?>" /></td>
      <td><input type="date" name="paymentdate<?php echo $currentrecord; ?>" id="paymentdate<?php echo $currentrecord; ?>" value="<?php echo date('Y-m-d'); ?>"/></td>
      <td><input type="number" name="slipno<?php echo $currentrecord; ?>" id="slipno<?php echo $currentrecord; ?>" />
      </td>
    </tr>
    <?php } while ($currentrecord<=$recordcount); ?>
</table>
<p>
  <input type="submit" name="submit" id="submit" value="Insert" />
</p>
  </div>
  <input type="hidden" name="MM_insert" value="form1" />
</form>
<p>&nbsp;</p>
</body>
</html>

