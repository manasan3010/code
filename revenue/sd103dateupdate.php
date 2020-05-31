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
  $updateSQL = sprintf("UPDATE stampdutyfirst SET sd103date=%s WHERE fileno=%s",
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
.ten {
	font-size: 10pt;
}
.Tamil09 {
	font-size: 9pt;
}
.English12 {
	font-size: 12pt;
}
.footer {
    position: relative;
   left: 0;
   bottom: 0;
   width: 100%;
   text-align: center;
  }
</style>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<?php include 'letterheadBW.php';?>
<form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
  <div align="right">
   <a href="home.php"> SD 103  <img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a> 
   <input type="hidden" name="MM_update" value="form1" />
    <input name="hiddendate" type="hidden" id="hiddendate" value="currentdate" />
    <input type="hidden" name="hiddenID" id="hiddenID" />
    <input class="hide-from-printer" onclick="printpage()" type="submit" name="Print" id="Print" value="Date" /><br/>
  <?php echo Date('Y-m-d'); ?> </div>
</form>


<table width="auto" border="0">
  <tr>
    <td><span class="ten">கோவை இல-<?php echo $_GET['fileno']; ?></span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td><span class="ten">திரு/திருமதி/செல்வி</span></td>
    <td><span class="ten"><?php echo ' '.$_GET['receiver']; ?></span></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td><span class="ten"><?php echo $_GET['address1']; ?></span></td>
  </tr>
</table>
<p class="ten">ஐயா/அம்மணி,<br />
Sir/Madam,</p>
<h3><font size="2">முத்திரைத் தீர்வைப் பெறுமதியைத் தீர்மானம் செய்தல் </font><br />Ascertaining of the Value of Stamp Duty</h3>
<p align="justify" class="ten"><span class="Tamil09">2014ம் ஆண்டு 01ம் இலக்க வடக்கு மாகாண நிதிநியதிச் சட்டத்தின் 71(8) ஆம் பந்தியின் கீழ் முத்திரைக் கட்டணம் அறவிடுவது தொடர்பான தகவல்கள் கோருதல், </span><span class="English12"><b><?php echo "Mr./Mrs./Miss " . $_GET['loyer']; ?></b></span><span class="Tamil09"> நொத்தாரிசு அவர்களால் உறுதிப்படுத்திய </span><span class="English12"><b><?php echo $_GET['deeddate']; ?></b></span><span class="Tamil09"> ம் திகதியையும் </span><span class="English12"><b><?php echo $_GET['deedno']; ?></b></span><span class="Tamil09"> இலக்கத்தையும் கொண்ட உறுதி.</span><br />
  <span class="English12">Stamp Duty - Furnishing Information in terms of Section 71(8) of the Northern Province Finance Statute No: 01 of 2014 Deed No: <b><?php echo $_GET['deedno']; ?></b> Dated :<b> <?php echo $_GET['deeddate']; ?></b> Name of Notary Public : <b><?php echo "Mr./Mrs./Miss " .$_GET['loyer']; ?></b></span></p>
<hr />
<ol>
  <li>
    <span class="Tamil09">தங்களுக்கு எழுதி வழங்கப்பட்ட உறுதி தொடர்பாகப் பின்வரும் ஆவணங்களையும் தகவல்களையும் 14 நாட்களுக்குள் எமது திணைக்களத்திற்கு நேரில் அல்லது அஞ்சலில் சமர்ப்பிக்குமாறு தயவுடன் அறிவித்துக் கொள்கின்றேன்.<br />
  </span>
      <span class="English12">Please furnish following documents and information pertaining to the above deed written in your name, within 14 days by post or directly..
      </span></li>
      <ol type="I">
        <li><span class="Tamil09">மேற்குறித்த உறுதியின் நிழற்படம் மற்றும் நில அளவையாளர் வரைபடத்தின் நிழற்பிரதியொன்று.<br /></span>
      <span class="English12">Photocopy of above deed and survey plan.</span></li>
        <li><span class="Tamil09">நன்கொடையாயின் நன்கொடைக்கு முன் உள்ள நில உறுதிப்பத்திரத்தின் நிழற்பிரதி.<br /></span>
      <span class="English12">Photocopy of previous deed, if it is a deed of gift</span></li>
        <li><span class="Tamil09">காணியில் கட்டிடங்கள் இருப்பின் அவற்றின் பரப்பளவு (சதுர அடிகளில்) , கட்டப்பட்ட வருடம், உள்ளூராட்சி அமையத்தின் மூலம் பெறுமதி கணிக்கப்பட்டிருப்பின் அவற்றின் வருடாந்தப் பெறுமதி போன்ற விபரங்கள்..<br />
        </span>
      <span class="English12">If there any buildings in the land, furnish its floor space (in square feet), year of construction, annual value assessed by the Local Government Institution</span></li>
        <li><span class="Tamil09">இவை தொடர்பாக ஏனைய ஆவணங்கள் இருப்பின் அவை, (உதாரணம் - வங்கிக் கடன் ஏதேனும் பெற்றிருப்பின் வங்கியின் மதிப்பீட்டு அறிக்கை, தடை உத்தரவுகள்)<br /></span>
      <span class="English12">Any other related documents regarding this property (Eg:(If obtained bank loan) Valuation reports Injunction order if available)</span></li>
        <li><span class="Tamil09">பிரதான நகரத்திலிருந்து குறிப்பிட்ட காணிக்குப் பிரவேசிப்பதற்கான மாதிரி வரைவு.<br /></span>
      <span class="English12">A rough sketch to approach the property from the main town</span></li>
        <li><span class="Tamil09">ஆதனத்தின் தன்மை (வதிவிடம், வியாபாரம் அல்லது விவசாயம்)<br />
        </span>
      <span class="English12">Type of property (Residential, Commercial, or agriculture)</span> .....................</li>
        <li><span class="Tamil09">குறித்த ஆதனத்தின் முகவரி.<br />
        </span>
      <span class="English12"> Address of the property</span> ............................................</li>
        <li><span class="Tamil09">தொடர்பை ஏற்படுத்தக்கூடிய தொலைபேசி இலக்கங்கள்.<br />
        </span>
      <span class="English12">Your telephone numbers.</span> ...........................</li>
        <li><span class="Tamil09">தேசிய அடையாள அட்டை இலக்கம்.<br />
        </span>
      <span class="English12">
          National Identity Card number.</span> ...................</li>
      </ol>
  </li>
  <li>
    <span class="Tamil09">இந்த ஆதனத்தின் பெறுமதி பற்றிய அபிப்பிராயம் ஒன்று மாகாண இறைவரித் திணைக்களத்தின் மூலம் பெறப்பட்டுள்ளதெனின் அதன் பிரதி ஒன்றையோ அல்லது கோவை இலக்கத்தையோ முன்வைக்கவும்.<br />
    </span>
      <span class="English12">If an opinion regarding value of this property has taken by the Department of Provincial Revenue, furnish detail with a copy of the document given by the department or its reference number.</span>
  </li>
  <li>
    <span class="Tamil09">பதில் எழுதும்போது ஒவ்வொரு தடவையும் கோவை இலக்கத்தைக் குறிப்பிடவும்.<br /></span>
      <span class="English12">Please mention the file number when replay.</span>
  </li>
  
</ol>
<p align="justify"><strong><span class="Tamil09">தயவுசெய்து கவனிக்கவும்<br /></span>
      <span class="English12">Please Note</span></strong><br/>
<span class="Tamil09">மேற்குறிப்பிட்ட தகவல்களை சமர்ப்பிக்கத் தவறும் இடத்து 2014 ஆம் ஆண்டு 01 ஆம் இலக்க வடக்கு மாகாண நிதிநியதிச் சட்டத்தின் 67 ஆம் பிரிவின் கீழ் நடவடிக்கை எடுக்கப்படும் என்பதைத் தெரிவித்துக் கொள்கின்றேன்.</span><br/>
      <span class="English12">If you fail to produce the above information, action will be taken under the provisions of the section 67 of Northern Province Finance statute No. 01 of 2014.</span></p>


<p class="ten"><br /><br />
  <br />
  ஆணையாளர் / பிரதி ஆணையாளர்.<br />
  <span class="English12">Commissioner / Deputy Commissioner</span></p>

</body>
</html>

