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

$recordid_Recordset1 = "-1";
if (isset($_GET['id'])) {
  $recordid_Recordset1 = $_GET['id'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = sprintf("SELECT stampdutyfirst.*, loyers1.loyername FROM stampdutyfirst, loyers1 WHERE stampdutyfirst.id =%s  AND stampdutyfirst.notaryid=loyers1.id", GetSQLValueString($recordid_Recordset1, "int"));
$Recordset1 = mysql_query($query_Recordset1, $revenuecon) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);
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
</style>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<?php include 'letterheadBW.php';?>
<p align="right"><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>Form No: SD 116<br /><?php echo Date('Y-m-d'); ?></p>

<table width="auto" height="170" border="0">
  <tr>
    <td colspan="2" class="ten"><span class="Tamil09">கோவை இல</span>-<span class="English12"><?php echo $row_Recordset1['fileno']; ?><br />File No.</span></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td class="ten"><span class="Tamil09">சொத்து உரிமையாளரின் பெயரும் முகவரியும்</span><br />
    <span class="English12">Name and Address of the Property holder</span></td>
    <td colspan="3" class="ten"><span class="English12">Mr./Ms.<?php echo $row_Recordset1['granteename']; ?><br /><?php echo $row_Recordset1['granteeaddress']; ?></span><br /> 
    </td>
  </tr>
  <tr>
    <td colspan="4" class="ten"><h3><font size="2">மேலதிக முத்திரைக் கட்டணம் அறவிட நடவடிக்கை எடுப்பதாக அறிவித்தல்</font><br />Notice of Initiating Action for  Levying Additional Stamp Duty</h3></td>
  </tr>
  <tr>
    <td class="ten"><span class="Tamil09">நொத்தாரிசின் பெயர்</span><br />
    <span class="English12">Name of Notary Public</span></td>
    <td class="English12">Mr./Ms.<?php echo $row_Recordset1['loyername']; ?></td>
    <td class="ten"><span class="Tamil09">உறுதிப்படுத்தப்பட்ட திகதி</span><br />
    <span class="English12">Date of Attestation</span></td>
    <td class="English12"><?php echo $row_Recordset1['deeddate']; ?></td>
  </tr>
  <tr>
    <td class="ten"><span class="Tamil09">உறுதி இலக்கம்</span><br />
    <span class="English12">Deed No.</span></td>
    <td class="English12"><?php echo $row_Recordset1['deedno']; ?></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
</table>
<p align="justify" class="ten">1. <span class="Tamil09">மேற்குறித்த ஆதனத்தைக் கைமாற்றும்போது உரிய பெறுமதியின் மீது முத்திரைக் கட்டணம் செலுத்தப்பட்டுள்ளதா எனப் பரிசீலிப்பதற்காக நீங்கள் இதுவரை வழங்கியுள்ள ஆவணங்கள் தொடர்பாக மேலும் தகவல்களைப் பரிசீலிப்பதற்கென / மேலதிக விளக்கங்களைப் பெறுவதற்கென </span><span class="English12"><?php echo $row_Recordset1['sd103date']; ?>,  <?php echo $row_Recordset1['sd104date']; ?>, <?php echo $row_Recordset1['sd105date']; ?></span><span class="Tamil09"> ஆகிய திகதிகள் கொண்ட கடிதங்கள் மூலம் கேட்கப்பட்டிருந்த தகவல்களை நீங்கள் முன்வைக்கவில்லை / அழைக்கப்பட்ட நேர்முகக் கலந்துரையாடல்களுக்குச் சமுகம் தரவில்லை.</span><br />
  <span class="English12">This is to inform you that you have failed to furnish the information requested by letters dated <?php echo $row_Recordset1['sd103date']; ?>, <?php echo $row_Recordset1['sd104date']; ?> and<?php echo $row_Recordset1['sd105date']; ?> for enabling me to check further details / clarify further information regarding the documents already furnished by you for the purpose of determining whether the stamp duty is paid on the correct value of the property transferred by the above mentioned deed and you also have failed to attend the discussions summoned in this connection.
  </span>
<blockquote>
  <p align="justify" class="ten">i. <span class="English12"><?php echo $row_Recordset1['tpdate']; ?></span> <span class="Tamil09">ஆகிய தினங்களில் தொலைபேசி அழைப்புக்கள் / கடிதம் மூலம் அறிவுறுத்தப்பட்டுள்ளீர்கள்.</span><br />
  <span class="English12">You have been made aware of this matter by my telephone calls or letters dated <?php echo $row_Recordset1['tpdate']; ?></span></p>
  <p align="justify" class="ten">ii.  <span class="English12"><?php echo $row_Recordset1['marketdate']; ?></span> <span class="Tamil09">ஆகிய தினத்தில் உரிய ஆதனத்தின் அமைவிடத்திற்குச் சென்று இடப்பரிசோதனை செய்து அறிக்கையும் பெறப்பட்டுள்ளது.</span><br />
    <span class="English12">A report has been obtained on <?php echo $row_Recordset1['marketdate']; ?> after visiting the place and making on the spot inspection.</span></p>
</blockquote>
<p align="justify" class="ten">2. <span class="Tamil09">நீங்கள் வழங்கிய தகவல்கள் மற்றும் அவை தொடர்பில் மேற்கொள்ளப்பட்ட பரிசோதனைகளுக்கு அமைய மேற்குறித்த உறுதிப்பத்திரத்தில் குறிப்பிடப்பட்டுள்ள தாபிக்கப்பட்ட பெறுமதியை 2014 ஆம் ஆண்டின் 1ஆம் இலக்க நிதிநியதிச் சட்டங்களின் ஏற்பாடுகளுக்கென ஆதனங்களது சந்தைப் பெறுமதியாக ஏற்றுக்கொள்ள முடியாதெனத் தங்களுக்கு அறியத்தருகின்றேன். இதற்கமைய மேற்குறித்த உறுதிப் பத்திரம் போதுமான அளவு முத்திரைத் தீர்வை செலுத்தப்பட்ட ஒன்றாக ஏற்றுக்கொள்ளப்படாது. மேற்குறித்த நிதிநியதிச் சட்டத்தின் 55(1) ஆவது பிரிவின் கீழ் விதிக்கப்பட்டுள்ள ஏற்பாடுகளின் படி நடவடிக்கை மேற்கொள்ள உட்படுத்தப்பட்டுள்ளது என்பதை அறிவித்துக் கொள்கின்றேன்.</span><br />
<span class="English12">I have to inform you that according to information supplied by you and according to inspections carried up to now, the value mentioned in the document cannot be accepted, as the market value of this property for the purpose of Finance Statute No. 01 of 2014 and as such, I have to treat that the above mentioned document as a document without sufficient stamp duty (an under stamp document) and shall be subject to initiating action in terms of section 55(1) of the said Finance Statute.</span></p>
<p align="justify" class="ten">3. <span class="Tamil09">மேலதிக முத்திரைக் கட்டணம் பின்வரும் வகையில் கணிப்பிடப்படுகின்றது.</span><br />
<span class="English12">Additional Stamp Duty will be calculated as follows:</span></p>
<blockquote>
  <table width="auto" border="0">
    <tr>
      <td class="ten"><span class="English12">i. <span class="Tamil09">உறுதிப்பத்திரம் எழுதப்பட்ட திகதியிலான ஆதனத்தின் சந்தைப் பெறுமதி</span><br />The Market value of the property on the date attesting the deed as Rs.</span></td>
      <td align='right' class="ten"><span class="English12"><?php echo number_format($row_Recordset1['marketvalue'],2,'.',','); ?></span></td>
    </tr>
    <tr>
      <td class="ten"><span class="English12">ii. <span class="Tamil09">ஆதனத்தின் சந்தைப் பெறுமதியின்படி செலுத்தவேண்டிய முத்திரைத் தீர்வை</span><br />The Stamp Duty payable on the market value of the property.</span></td>
      <td align='right' class="ten"><span class="English12">
        <?php
	  if ($row_Recordset1['marketvalue']<=100000)
	  		$estimatedduty=$row_Recordset1['marketvalue']*0.03;
	  else
	   		$estimatedduty=100000*0.03 + ($row_Recordset1['marketvalue']-100000)*0.04;
	  echo number_format($estimatedduty,2,'.',','); 
	   ?>
      </span></td>
    </tr>
    <tr>
      <td class="ten"><span class="English12">iii. <span class="Tamil09">உறுதியில் காட்டப்பட்டுள்ள பெறுமதியின்படி செலுத்தப்பட்டுள்ள முத்திரைத் தீர்வை</span><br />The value of the Stamp Duty paid as per in deed.</span></td>
      <td align='right' class="ten"><span class="English12"><?php echo number_format($row_Recordset1['amount'],2,'.',','); ?></span></td>
    </tr>
    <tr>
      <td class="ten"><span class="English12">iv. <span class="Tamil09">மேற்குறித்த பெறுமதியின் கீழ் கணிக்கப்பட்ட மேலதிக முத்திரைத் தீர்வை</span><br />The Additional Stamp Duty calculated on the above value is Rs.</span></td>
      <td align='right' class="ten"><span class="English12"><?php echo number_format($estimatedduty-$row_Recordset1['amount'],2,'.',','); ?></span></td>
    </tr>
    <tr>
      <td class="ten"><span class="English12">v. <span class="Tamil09">முத்திரைத் தீர்வைக்கான தண்டம்</span><br />The Penalty for Stamp Duty</span></td>
      <td align='right' class="ten"><span class="English12">
        <?php $penalty=($estimatedduty-$row_Recordset1['amount'])*0.05; echo number_format($penalty,2,'.',','); ?>
      </span></td>
    </tr>
    <tr>
      <td class="ten"><span class="English12">vi. <span class="Tamil09">செலுத்தப்படவேண்டிய முத்திரைத் தீர்வையும் தண்டமும்.</span><br />The penalty deficiency of Stamp Duty payable.</span></td>
      <td align='right' class="ten"><span class="English12"><?php echo number_format($estimatedduty-$row_Recordset1['amount']+$penalty,2,'.',','); ?></span></td>
    </tr>
  </table>
</blockquote>
<p align="justify" class="ten"><span class="English12"><span class="Tamil09">(மேற்காட்டிய கணிப்பீடு பற்றிய  முறையான தகவல்களைக் கொண்ட உத்தியோகபூர்வ வரிமதிப்பீட்டு அறிவித்தல் எதிர்காலத்தில் தங்களுக்கு அனுப்புவதற்கு நடவடிக்கை எடுக்கப்படும்.)</span><br />
(Action will be taken forwared the 'Assessment Notice' which being the official notice containing further information regarding the above calculations)</span></p>
<p align="justify" class="ten"><span class="English12"><span class="Tamil09">மேற்படி மேலதிக முத்திரைக் கட்டணத்துடன் தகுந்த முத்திரைத் தீர்வையின் மும்மடங்கான (300% வரையான) தண்டம் ஒன்றையும் விதிக்க முடியுமான ஏற்பாடுகள் குறித்த நிதிநியதிச் சட்டத்தில் உள்ளடங்கியுள்ளன என்பதையும் தெரிவித்துக் கொள்கின்றேன்.</span><br />
  In addition to the above Additional Stamp Duty, I also have to inform you that there is provision in the above mentioned Finance Statute to impose a penalty of 3 times of the value of Stamp Duty, which being 300% penalty.</span></p>
<p align="justify" class="ten"><span class="English12"><span class="Tamil09">எனினும் மேற்குறித்த கணிப்பீடு தொடர்பாக தாங்கள் ஏதும் எதிர்ப்பையோ அல்லது மேலதிக தகவல்களையோ முன்வைப்பதாயின் அதற்கென  <?php echo ' '.$row_Recordset1['objectiondate'].' '; ?> ம் திகதி இந்த அலுவலகத்திற்கு வந்து அவ்வாறு செய்வதற்காக தங்களுக்கு இறுதிச் சந்தர்ப்பம் ஏற்படுத்தித் தரப்படுகின்றது.</span><br />
  However, as for offering you a last chance regarding this matter, you may attend this office on  <?php echo ' '.$row_Recordset1['objectiondate'].' '; ?> and forward any objections you have regarding the above calculations or forward any further facts and details, which you think relavant.</span></p>
<p align="justify" class="ten"><span class="English12"><span class="Tamil09">இந்த அறிவித்தல் தொடர்பில் தங்களிடமிருந்து பதில் கிடைக்கவில்லை எனத் தெரியும் பட்சத்தில் எந்தவித அறிவித்தலுமின்றி இந்தக் கடிதத்தின் 2, 3 ஆம் பந்திகளின்படி நடவடிக்கை மேற்கொள்ளப்படும் என்பதைத் தங்களுக்குத் தயவாக அறியத்தருகின்றேன்.</span><br />It is appear that there is no response from you regarding this notice, action will be taken under pare 2 and 3 of this letter, without giving you any further notice.</span></p>
<p class="ten"><span class="English12"><span class="Tamil09">இவ்வண்ணம் உண்மையுள்ள,</span><br />Yours truly,<br /><br /><br />
</span><span class="Tamil09">ஆணையாளர் / பிரதி ஆணையாளர்</span><span class="English12"><br />
Commissioner / Deputy Commissioner</span></p>

</blockquote>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
