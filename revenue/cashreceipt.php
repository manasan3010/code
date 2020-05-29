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

mysql_select_db($database_revenuecon, $revenuecon);
$query_receipt = "SELECT * FROM cashreceipt ORDER BY receiptID DESC";
$receipt = mysql_query($query_receipt, $revenuecon) or die(mysql_error());
$row_receipt = mysql_fetch_assoc($receipt);
$totalRows_receipt = mysql_num_rows($receipt);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
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
	font-size: 12pt;
}
.receiptstyle {
	font-size: 10pt;
}
</style>
</head>

<body>
<table width="auto" height="377" border="0">
 
  <tr>
    <td height="99" align="center"><img src="SriLankaGovernmentLogo.jpg" alt="Gov. Logo" width="61" height="97" align="middle" /></td>
    <td><div align="center"> வடக்கு மாகாண சபை<br />NORTHERN PROVINCIAL COUNCIL </div></td>
    <td align="right" valign="bottom"><b>N.P.C 172<br /><?php echo addleadingzeros($row_receipt['receiptID']); ?></b></td>
  </tr>
 
  <tr>
    <td>&nbsp;</td>
    <td align="center"><span class="receiptstyle">பற்றுச் சீட்டு<br />CASH RECEIPT</span></td>
    <td><span class="receiptstyle">Date: <?php echo $row_receipt['date']; ?></span></td>
  </tr>
  <tr>
    <td height="32"><span class="receiptstyle">பணம் கொடுத்தவரின் பெயர்<br />Received From:</span></td>
    <td><span class="receiptstyle"><?php echo strtoupper($row_receipt['Reservedfrom']); ?></span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="29"><p><span class="receiptstyle">காரணம்<br />Reason:</span></p></td>
    <td colspan="2"><p><span class="receiptstyle"><?php echo strtoupper($row_receipt['reason']).' <br /> FILE No: ' . $row_receipt['fileno']; ?></span></p></td>
  </tr>
  <tr>
    <td height="31">&nbsp;</td>
    <td colspan="2"><span class="receiptstyle"><?php echo 'Stamp Duty: '. number_format($row_receipt['duty'],2,'.',','). ' + Penalty '.number_format($row_receipt['penalty'],2,'.',','); ?></span></td>
  </tr>
  <tr>
    <td height="34"><span class="receiptstyle">பெற்றுக்கொண்ட தொகை<br />Total in words</span></td>
    <td colspan="2"><span class="receiptstyle"><?php echo 'Rs. '.convert_number_to_words($row_receipt['amount'])." Only."; ?></span></td>
  </tr>
  <tr>
    <td height="34"><span class="receiptstyle">மொத்தம்<br />Total</span></td>
    <td><span class="receiptstyle">Rs. <?php echo number_format($row_receipt['amount'],2,'.',','); ?></span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="38">&nbsp;</td>
    <td><p>&nbsp;</p></td>
    <td><span class="receiptstyle">கையொப்பமும் பதவியும்<br />
    Signature and Designation :</span></td>
  </tr>
</table>
<a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a><hr />
<table width="auto" border="0">
  <tr>
    <td width="379"><div align="center"><strong>பணம் கட்டும் பத்திரம் PAYING IN VOUCHER</strong></div></td>
    <td width="127" style="font-size: 8px"><div align="right">GENERAL 118</div></td>
  </tr>
  <tr>
    <td colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td height="26" colspan="2"><span class="receiptstyle">To : commissioner, DPR-NP</span></td>
  </tr>
  <tr>
    <td height="28"><span class="receiptstyle">வருமானத் தலைப்பு<br />Head of Receipt: 2003-99-00.</span></td>
    <td><span class="receiptstyle">திகதி<br />Date: <?php echo $row_receipt['date']; ?></span></td>
  </tr>
  <tr>
    <td height="28" colspan="2"><span class="receiptstyle">பணம் கட்டுபவரின் பெயர்<br />Name of Payee: <?php echo strtoupper($row_receipt['Reservedfrom']); ?></span></td>
  </tr>
  <tr>
    <td height="27" colspan="2"><span class="receiptstyle">இத்தொகையைக் கீழே விபரிக்கப்பட்டபடி இலங்கை அரசாங்கத்தின் கணக்கில் வரவு வைக்கவும்.<br />Please receive to the credit of the government of Sri Lanka the sum of money discribed below.</span></td>
  </tr>
  <tr>
    <td height="27" colspan="2"><span class="receiptstyle">ரூபா Rupees <?php echo convert_number_to_words($row_receipt['amount'])." Only."; ?></span></td>
  </tr>
  <tr>
    <td height="31" colspan="2"><span class="receiptstyle">பணம் கட்டும் விபரம்<br />
      Reason for Payment: Additional Stamp Duty / Penalty</span></td>
  </tr>
  <tr>
    <td><span class="receiptstyle">முத்திரைத் தீர்வை Stamp Duty : <?php echo number_format($row_receipt['duty'],2,'.',','); ?> + தண்டம் Penalty : <?php echo number_format($row_receipt['penalty'],2,'.',','); ?></span><br />
      <span class="receiptstyle">மொத்தம் Total: Rs. <?php echo number_format($row_receipt['amount'],2,'.',','); ?></span>
      </td>
    <td><p>&nbsp;</p>
      
    <p><span class="receiptstyle">ஒப்பம்<br />Signature</span></p></td>
  </tr>
  <tr>
    <td colspan="2"><hr></td>
  </tr>
  <tr>
    <td><span class="receiptstyle">(பணம் பெறும் அரசாங்கத் துறையில் சிறாப்பர் பாவிப்பிற்கு மாத்திரம்<br />For the use of Shroff of the receiving department only)</span><br />
    <span class="receiptstyle">மேற்கண்ட தொகையைப் பெற்றுக்கொண்டேன்.<br />Receive the above amount</span>
    
    <p><span class="receiptstyle">ஒப்பம் Signature:..............................</span></p></td>
    <td><p>&nbsp;</p>
    <p>&nbsp;</p>
    <p><span class="receiptstyle">திகதி<br />Date:...................</span></p></td>
  </tr>
</table>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($receipt);
?>
