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
require("spelloutamount.php");
function addleadingzeros($number)
{ $len=strlen($number);
	for($i=0;$i<8-$len;$i++){
		$number="0".$number;
	}
	return $number;
}
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

$colname_receipt = "-1";
if (isset($_GET['receiptID'])) {
  $colname_receipt = $_GET['receiptID'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_receipt = sprintf("SELECT * FROM cashreceipt WHERE receiptID = %s", GetSQLValueString($colname_receipt, "int"));
$receipt = mysql_query($query_receipt, $revenuecon) or die(mysql_error());
$row_receipt = mysql_fetch_assoc($receipt);
$totalRows_receipt = mysql_num_rows($receipt);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<style type="text/css">
td {
	font-family: Verdana, Geneva, sans-serif;
}
td {
	font-family: Arial, Helvetica, sans-serif;
}
td {
	font-family: MS Serif, New York, serif;
}
td {
	font-family: Palatino Linotype, Book Antiqua, Palatino, serif;
}
td {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
}
</style>
</head>

<body>
<table width="auto" height="439" border="0">
  <tr>
    <td width="116">Original</td>
    <td width="247">&nbsp;</td>
    <td width="122">N.P.C 172</td>
  </tr>
  <tr>
    <td><img src="SriLankaGovernmentLogo.jpg" width="62" height="79" alt="Gov. Logo" /></td>
    <td><div align="center">
      <h4>NORTHERN PROVINCIAL COUNCIL</h4>
    </div></td>
    <td align="right" valign="bottom"><?php echo addleadingzeros($row_receipt['receiptID']); ?></td>
  </tr>
  <tr>
    <td height="34">&nbsp;</td>
    <td>&nbsp;</td>
    <td>Date: <?php echo $row_receipt['date']; ?></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td align="center"><h3>CASH RECEIPT</h3></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="37">Received From:</td>
    <td><?php echo strtoupper($row_receipt['Reservedfrom']); ?></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="36">Reason:</td>
    <td><?php echo strtoupper($row_receipt['reason']).' FOR FILE No: ' . $row_receipt['fileno']; ?></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="37">&nbsp;</td>
    <td> <?php echo 'Stamp Duty: Rs. '. number_format($row_receipt['duty'],2,'.',','). ' + Penalty Rs. '.number_format($row_receipt['duty'],2,'.',','); ?></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="35">Total in words</td>
    <td><?php echo 'Rs. '.convert_number_to_words($row_receipt['amount'])." Only."; ?></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="39">Total</td>
    <td> <?php echo 'Rs. '.number_format($row_receipt['amount'],2,'.',','); ?></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="45">&nbsp;</td>
    <td>Signature and Designation :</td>
    <td>&nbsp;</td>
  </tr>
</table>
<p>&nbsp;</p>
<a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a><HR />
<table width="auto" border="0">
  <tr>
    <td><div align="center"><strong>PAYING IN VOUCHER</strong></div></td>
    <td style="font-size: 8px"><div align="right">GENERAL 118</div></td>
  </tr>
  <tr>
    <td colspan="2"><div align="right">.</div></td>
  </tr>
  <tr>
    <td height="28" colspan="2">To : Commissioner, DPR-NP</td>
  </tr>
  <tr>
    <td height="33">Head of Receipt: 2003-99-00.</td>
    <td>Date: <?php echo $row_receipt['date']; ?></td>
  </tr>
  <tr>
    <td height="30" colspan="2">Name of Payee: <?php echo strtoupper($row_receipt['Reservedfrom']); ?></td>
  </tr>
  <tr>
    <td height="30" colspan="2">Please receive to the credit of the government of Sri Lanka the sum of money discribed below.</td>
  </tr>
  <tr>
    <td height="35" colspan="2"> <?php echo 'Rs. '. convert_number_to_words($row_receipt['amount'])." Only."; ?></td>
  </tr>
  <tr>
    <td height="33" colspan="2">Reason for Payment: Additional Stamp Duty / Penalty</td>
  </tr>
  <tr>
    <td><p>Stamp Duty Rs: <?php echo number_format($row_receipt['duty'],2,'.',','); ?> + Penalty Rs: <?php echo number_format($row_receipt['penalty'],2,'.',','); ?></p>
    <p>Total: Rs. <?php echo number_format($row_receipt['amount'],2,'.',','); ?></p>
    <p>&nbsp;</p></td>
    <td><p>&nbsp;</p>
      <p>&nbsp;</p>
    <p>Signature</p></td>
  </tr>
  <tr>
    <td colspan="2"><hr></td>
  </tr>
  <tr>
    <td><p>(For the use of Shroff of the receiving department only)</p>
    <p>Receive the above amount</p>
    <p>&nbsp;</p>
    <p>Signature:.......................</p></td>
    <td><p>&nbsp;</p>
      <p>&nbsp;</p>
    <p>Date:...................</p></td>
  </tr>
</table>

</body>
</html>
<?php
mysql_free_result($receipt);
?>
