<?php require_once('Connections/revenuecon.php'); ?>
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

$colname_Recordset1 = "-1";
if (isset($_GET['fileno'])) {
  $colname_Recordset1 = $_GET['fileno'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = sprintf("SELECT * FROM stampdutyfirst, loyers1 WHERE fileno = %s and stampdutyfirst.notaryid=loyers1.id", GetSQLValueString($_POST['fileno'], "text"));
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
<?php include 'letterheadBW.php';?>
<p align="right"><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>Form No: SD 150<br /><?php echo Date('Y-m-d'); ?></p>
<table width="642" height="718" border="0">
  <tr>
    <td colspan="3">கோவை இல-NP/SD/<?php echo $_POST['fileno']; ?></td>
    <td width="91">வரிவிதிப்பு இலக்கம்</td>
    <td width="143"><?php echo $_POST['chargeno']; ?></td>
  </tr>
  <tr>
    <td colspan="2">சொத்து உரிமையாளரின் பெயரும் முகவரியும்</td>
    <td width="180"><p><?php echo $row_Recordset1['granteename']; ?></p>
    <p><?php echo $row_Recordset1['granteeaddress']; ?></p></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td width="115">நொத்தாரிஸ்</td>
    <td width="91">&nbsp;</td>
    <td><?php echo $row_Recordset1['loyername']; ?></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="2">உறுதி இலக்கம்</td>
    <td><?php echo $row_Recordset1['deedno']; ?></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="2">உறுதிப்படுத்தப்பட்ட திகதி</td>
    <td><?php echo $row_Recordset1['deeddate']; ?></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="5"><div align="justify">மேலே காட்டப்பட்டுள்ள அன்பளிப்பு உரித்துடைமை உறுதி / விற்பனை உறுதி தொடர்பாக 2014ம் ஆண்டு 1ம் இலக்க வடக்கு மாகாணசபையின் நிதிநியதிச் சட்டப் பிரிவு 55(1) இன் ஏற்பாடுகளின்படி பெறுமதியின் அடிப்படையில் செலுத்தப்படவேண்டிய முத்திரைத் தீர்வை கீழே காட்டப்பட்டுள்ளது.</div></td>
  </tr>
  <tr>
    <td colspan="4">அசையாச் சொத்துக்களின் சந்தைப் பெறுமதி</td>
    <td><div align="right"><?php echo $row_Recordset1['marketvalue']; ?></div></td>
  </tr>
  <tr>
    <td colspan="3">முத்திரைக் கட்டணம் முதல்</td>
    <td><?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo '50,000.00 * 3%'; else echo '100,000.00 X 3%' ;?></td>
    <td><div align="right">
      <?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo 50000.00 *0.03; else echo 100000.00 * 0.03 ;?>
    </div></td>
  </tr>
  <tr>
    <td colspan="2">எஞ்சியது</td>
    <td>&nbsp;</td>
    <td><?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo ($row_Recordset1['marketvalue']-50000) . '* 2%'; else echo ($row_Recordset1['marketvalue']-100000) . 'X 4%'; ?></td>
    <td><div align="right">
      <?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo ($row_Recordset1['marketvalue']-50000)*0.02; else echo ($row_Recordset1['marketvalue']-100000)*0.04; ?>
    </div></td>
  </tr>
  <tr>
    <td colspan="4">அசையாச் சொத்துக்களின் சந்தைப் பெறுமதியின்படி செலுத்தவேண்டிய முத்திரைத் தீர்வை</td>
    <td><div align="right">
      <?php if (strcmp($row_Recordset1['nature'],'Donation')==0)
		{ $actualduty= (50000.00 * 0.03) + (($row_Recordset1['marketvalue']-50000)*0.02);
			echo $actualduty;}
	 else 
	 	{$actualduty=  (100000.00 * 0.03)+ (($row_Recordset1['marketvalue']-100000)*0.04) ;
	 		echo $actualduty;}?>
    </div></td>
  </tr>
  <tr>
    <td colspan="4">கழிக்கப்பட்டுள்ளது- உறுதியில் காட்டப்பட்டுள்ள பெறுமதி அடிப்படையில் செலுத்தப்பட்டுள்ள முத்திரைத் தீர்வை</td>
    <td><div align="right"><?php echo $row_Recordset1['amount']; ?></div></td>
  </tr>
  <tr>
    <td colspan="4">குறைந்த முத்திரைத் தீர்வை</td>
    <td><div align="right">
      <?php $lacking=$actualduty- $row_Recordset1['amount']; echo $lacking; ?>
    </div></td>
  </tr>
  <tr>
    <td colspan="2">முத்திரைத் தீர்வைக்கான தண்டம்</td>
    <td colspan="2"><?php echo $lacking . ' X '. $_POST['penaltyrate'] . '%'; ?></td>
    <td><div align="right">
      <?php $penalty= ($lacking*$_POST['penaltyrate'])/100; echo $penalty; ?>
    </div></td>
  </tr>
  <tr>
    <td colspan="4">செலுத்தவேண்டிய முத்திரைத் தீர்வையும் தண்டமும்</td>
    <td><div align="right"><?php echo $lacking+$penalty; ?></div></td>
  </tr>
  <tr>
    <td colspan="4">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="5">மேற்குறிப்பிட்ட நிதிநியதிச் சட்டத்தின் 55(1)(ஆ) பிரிவின் படி தகுந்த முத்திரைத் தீர்வையின் 300% வரை தண்டம் விதிக்கமுடியும்.</td>
  </tr>
  <tr>
    <td colspan="5">இவ்வரி மதிப்பீட்டு அறிவித்தல் திகதி : <?php echo Date('Y-m-d'); ?></td>
  </tr>
  <tr>
    <td colspan="5">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="5">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="5"><div align="right">ஆணையாளர்</div></td>
  </tr>
</table>
<p align="right">&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
