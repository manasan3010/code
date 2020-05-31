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

$colname_stamp = "-1";
if (isset($_GET['id'])) {
  $colname_stamp = $_GET['id'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_stamp = sprintf("SELECT * FROM stampdutyfirst WHERE id = %s", GetSQLValueString($colname_stamp, "int"));
$stamp = mysql_query($query_stamp, $revenuecon) or die(mysql_error());
$row_stamp = mysql_fetch_assoc($stamp);
$totalRows_stamp = mysql_num_rows($stamp);
?>
<?php require_once('Connections/revenuecon.php'); 
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
  
   $updateSQL = sprintf("UPDATE stampdutyfirst SET sd105date=%s WHERE id=%s",
                       GetSQLValueString(Date('Y-m-d'), "date"),
                       GetSQLValueString($_GET['id'], "int"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<style type="text/css">
.font10 {
	font-size: 10pt;
}
.Tamil09 {
	font-size: 9pt;
}
.English12 {
	font-size: 12pt;
}
</style>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<?php include 'letterheadBW.php';?>
<p align="right"><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a> Form No: SD 105<br />
</p>
<form id="form1" name="form1" method="POST">
  <input name="fileno" type="hidden" id="fileno" value="$_GET['fileno']" />
  <input type="submit" name="submit" id="submit" class="hide-from-printer" value="Date" />
  <input type="hidden" name="MM_update" value="form1" />
  <?php echo Date('Y-m-d'); ?>
</form>

<p><span class="Tamil09">கோவை இல</span>-<span class="English12"><?php echo $row_stamp['fileno']; ?><br />File No.</span></p>
<table width="auto" border="0">
  <tr>
    <td class="Tamil09">திரு /திருமதி/ செல்வி</td>
    <td><span class="English12"><?php echo $row_stamp['granteename']; ?><br />
    <?php echo $row_stamp['granteeaddress']; ?></span></td>
  </tr>
</table>

<p><span class="Tamil09">ஐயா / அம்மணி,</span><br />
  <span class="English12">Sir / Madam,</span><br />
  
</p>
<h4 align="center"> <span class="Tamil09">முத்திரைத் தீர்வைப் பெறுமதியைத் தீர்மானம் செய்தல்.</span><br />Ascertaining of the Value of Stamp Duty</h4><hr>
<p align="left" class="font10"><span class="Tamil09">எமது  </span><span class="English12"><?php echo $row_stamp['sd104date']; ?></span><span class="Tamil09"> ம் திகதிய கடிதம் தொடர்பானது.</span><br />
<span class="English12">Reference my letter dated <?php echo $row_stamp['sd104date']; ?></span></p>
<p align="justify" class="font10"> <span class="Tamil09">தங்களுக்கு எழுதி வழங்கப்பட்ட உறுதி இல </span><span class="English12"><?php echo $row_stamp['deedno']; ?></span><span class="Tamil09"> தொடர்பாக, எமது </span><span class="English12"><?php echo $row_stamp['sd104date']; ?></span><span class="Tamil09"> திகதிய கடிதத்தில் கோரப்பட்டிருந்த பின்வரும் அடையாளப்படுத்தப்பட்ட ஆவணங்களை உடன் அனுப்பிவைக்குமாறு தயவுடன் கேட்டுக்கொள்கின்றோம்.</span><br />
  <span class="English12">Please immediately send the following documents requested by our letter dated <?php echo $row_stamp['sd104date']; ?> regarding above deed certified  No. <?php echo $row_stamp['deedno']; ?> written in your name.</span></p>
<ol>
  <li class="font10">
    <input type="checkbox" name="c1" id="c1" />
  <span class="Tamil09">தேசிய அடையாள அட்டை இலக்கம்.</span> <span class="English12">National Identity Card No.</span></li>
  <li class="font10">
    <input type="checkbox" name="c2" id="c2" />
  <span class="Tamil09">தொலைபேசி இலக்கம்.</span> <span class="English12">Telephone No.</span></li>
  <li class="font10">
    <input type="checkbox" name="c3" id="c3" />
  <span class="Tamil09">மேற்குறித்த உறுதியின் நிழற்படம்</span>. <span class="English12">Photocopy of the above deed.</span></li>
  <li class="font10">
    <input type="checkbox" name="c4" id="c4" />
  <span class="Tamil09">நில அளவையாளர் வரைபடத்தின் நிழற்படம்</span>. <span class="English12">Photocopy of the Survey Plan of the above deed.</span></li>
  <li class="font10">
    <input type="checkbox" name="c5" id="c5" />
  <span class="Tamil09">பிரதான நகரிலிருந்து குறிப்பிட்ட காணிக்குப் பிரவேசிப்பதற்கான மாதிரி வரைபு.</span> <span class="English12">A rough sketch to approach the property from the main town.</span></li>
</ol>

<p align="justify" class="font10"><br /><br />
  <span class="Tamil09">ஆணையாளர் / பிரதி ஆணையாளர்.</span><br />
<span class="English12">Commissioner / Deputy Commissioner</span></p>
</body>
</html>
<?php
mysql_free_result($stamp);
?>
