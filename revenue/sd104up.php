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

$editFormAction = $_SERVER['PHP_SELF'];
if (isset($_SERVER['QUERY_STRING'])) {
  $editFormAction .= "?" . htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_POST["MM_update"])) && ($_POST["MM_update"] == "form1")) {
  $updateSQL = sprintf("UPDATE stampdutyfirst SET sd104date=%s WHERE fileno=%s",
                       GetSQLValueString(Date('Y-m-d'), "date"),
                       GetSQLValueString($_GET['fileno'], "int"));

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
body p {
	font-size: 10pt;
}
.Tamil09 {
	font-size: 9pt;
}
.English12 {
	font-size: 11pt;
}
.footer {
    position: fixed;
   left: 0;
   bottom: 0;
   width: 100%;
   text-align: center;
  }
</style>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<font color="#FF0000">
<?php include 'letterheadBW.php';?>
<table width="670" border="0">
  <tr>
    <td width="315"><p><span class="Tamil09">கோவை இல</span> <span class="English12">File No-<?php echo $_GET['fileno']; ?><br />
    </span></p>
      <table width="auto" border="0">
        <tr>
          <td>Mr./Mrs./Miss. </td>
          <td><span class="English12"><?php echo $_GET['receiver']; ?><br />
          </span></td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td><span class="English12"><?php echo $_GET['address']; ?></span></td>
        </tr>
      </table></td>
    <td width="317"><div align="right"><span class="English12">Form No: SD 104</span><br />
        <form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
     <a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>   
          <input type="hidden" name="hiddenField" id="hiddenField" />
          <input class="hide-from-printer" onclick="printpage()" type="submit" name="Print" id="Print" value="Date" />
          <?php echo Date('Y-m-d'); ?>
          <input type="hidden" name="MM_update" value="form1" />
        </form>
    </div></td>
  </tr>
</table>
<h4 align="center"><font size="2" class="Tamil09">2014ம் ஆண்டின் 01ம் இலக்க வடக்கு மாகாண நிதிநியதிச் சட்டத்தின் 71(8) பிரிவின் கீழ் விபரம் கோரப்பட்டதற்கமைய விபரங்களை வழங்கத் தவறியமை - முத்திரைத்தீர்வை.</font><br />Failure to furnish the Information in terms of section 71(8) of the Financial Statute No. 01 of 2014 of Northern Province - Stamp Duty</h4>
<hr />
</font>
<ol>
  <li class="font10"><font color="#FF0000">
    i. <span class="Tamil09">உறுதி இலக்கம் </span>- <span class="English12"><?php echo $_GET['deedno']; ?></span> <br />
    <span class="English12">Deed No.</span><br />
    <span class="Tamil09">ii. உறுதிப்படுத்தப்பட்ட திகதி - </span><span class="English12"><?php echo ' '.$_GET['deeddate']. ' '; ?><br />
    Date Certified</span><br />
    iii. <span class="Tamil09">நொத்தாரிசின் பெயர் -</span><span class="English12"><?php echo ' '.$_GET['loyer'].' '; ?><br />
    Name of Notary
    </span></font></li>
  <li>
    <div align="justify" class="font10"><span class="Tamil09"><font color="#FF0000">மேலே இல 01 இன் கீழ் குறிப்பிடப்பட்டுள்ள விபரங்கள் தொடர்பாக <?php echo ' '.$_GET['sd103date'].' '; ?>திகதிய எமது கடிதத்தில் கோரப்பட்டுள்ள ஆவணங்கள் இதுவரை தங்களால் சமர்ப்பிக்கப்படவில்லை.</font></span><font color="#FF0000"><br />
    <span class="English12">The documents have not been forwarded by you to this office upto now, as requested vide my letter dated <?php echo ' '.$_GET['sd103date'].' '; ?> in connection with the matter mensioned in para No. 01 above.</span></font></div>
  </li>
  <li>
    <div align="justify" class="font10"><span class="Tamil09"><font color="#FF0000">இந்தத் திகதியிலிருந்து 14 நாட்களுக்குள் குறிப்பிட்ட ஆவணங்களைச் சமர்ப்பிக்கத் தவறுமிடத்து 2014ம் ஆண்டின் 01ம் இலக்க வடக்கு மாகாண நிதிநியதிச் சட்டவாக்கத்தின் 66(ஈ) உப பிரிவின் கீழ் அல்லது குறிப்பிட்ட சட்டவாக்கத்தின் 67ஆவது பிரிவின் கீழ் தீர்மானிக்கப்பட்டுள்ள தண்டனைக்கோ அல்லது சிறைத் தண்டனைக்கோ ஆளாக வேண்டிவரும் என்பதனைத் தங்களுக்குத் தாழ்மையுடன் அறியத்தருகின்றேன்.</font></span><font color="#FF0000"><br />
    <span class="English12">Please be informed that you are liable to fine or imprisonment or to both in accordance with sub section 66(d) or section 67 of the Financial Statute No. 01 of 2014 of Northern Province if you are failed to furnished the said document within 14 days from this date.</span></font></div>
  </li>
</ol>
<p><span class="Tamil09"><font color="#FF0000">இப்படிக்கு,<br>
உண்மையுள்ள</font></span><font color="#FF0000"><br />
<span class="English12">Yours faithfully</span></font></p>
<p><font color="#FF0000"><br />
    <span class="Tamil09"> ஆணையாளர் / பிரதி ஆணையாளர்</span><br />
    <span class="English12">Commissioner / Deputy Commissioner</span></font></p>
<div class="footer"> 
<?php include("footer.php") ;?>
</div>
</body>

 </html>

