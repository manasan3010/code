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
<style type="text/css">
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
<?php include 'letterheadBW.php';?>

<table width="661" height="718" border="0">
  <tr>
    <td colspan="3"><span class="Tamil09">கோவை இல</span>-<span class="English12">NP/SD/<?php echo $_POST['fileno']; ?></span><br />
    <span class="English12">File No.</span></td>
    <td width="110"><span class="Tamil09">வரிவிதிப்பு இலக்கம்</span><br />
    <span class="English12">Charge No.</span></td>
    <td width="115"><span class="English12"><?php echo $_POST['chargeno']; ?></span></td>
    <td width="187" align="right"><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="25" height="25" alt="Home" /></a><span class="English12"><span class="English12">Form No: SD 150</span><br />
    <?php echo Date('Y-m-d'); ?></td>
  </tr>
  <tr>
    <td colspan="3"><span class="Tamil09">சொத்து உரிமையாளரின் பெயரும் முகவரியும்</span><br />
    <span class="English12">Name and address of property holder.</span></td>
    <td colspan="2"><span class="English12"><?php echo $row_Recordset1['granteename']; ?><br />
    <?php echo $row_Recordset1['granteeaddress']; ?></span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="3"><span class="ninezise"><span class="Tamil09">நொத்தாரிஸ்</span><br />
    </span><span class="English12">Notary Public</span></td>
    <td colspan="2"><span class="English12"><?php echo $row_Recordset1['loyername']; ?></span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="2"><span class="ninezise"><span class="Tamil09">உறுதி இலக்கம்</span><br />
    </span><span class="English12">Deed No.</span></td>
    <td width="164"><span class="English12"><?php echo $row_Recordset1['deedno']; ?></span></td>
    <td colspan="2"><span class="ninezise"><span class="Tamil09">உறுதிப்படுத்தப்பட்ட திகதி</span><br />
    </span><span class="English12">Date of Attestation</span></td>
    <td><span class="English12"><?php echo $row_Recordset1['deeddate']; ?></span></td>
  </tr>
  <tr>
    <td width="30">&nbsp;</td>
    <td width="29">&nbsp;</td>
    <td>&nbsp;</td>
    <td colspan="2">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td colspan="6"><div align="justify"><span class="ninezise"><span class="Tamil09">மேலே காட்டப்பட்டுள்ள அன்பளிப்பு உரித்துடைமை உறுதி / விற்பனை உறுதி தொடர்பாக 2014ம் ஆண்டு 1ம் இலக்க வடக்கு மாகாணசபையின் நிதிநியதிச் சட்டப் பிரிவு 55(1) இன் ஏற்பாடுகளின்படி &quot;பெறுமதி&quot;  அடிப்படையில் செலுத்தப்படவேண்டிய முத்திரைத் தீர்வை கீழே காட்டப்பட்டுள்ளது.</span><br />
    </span><span class="English12">Stamp duty payable on the value of property of the above deed of transfer / deed of gift in accordance with the section 55(1) of the Finance Statute No. 01 of 2014 of the Northern Provincial Council has been calculated as follows:</span></div></td>
  </tr>
  <tr>
    <td colspan="5"><span class="ninezise"><span class="Tamil09">அசையாச் சொத்துக்களின் சந்தைப் பெறுமதி</span><br />
    </span><span class="English12">Market value of immovable property</span></td>
    <td><div align="right"><span class="English12"><?php echo $row_Recordset1['marketvalue']; ?></span></div></td>
  </tr>
  <tr>
    <td colspan="3"><span class="ninezise"><span class="Tamil09">முத்திரைக் கட்டணம் முதல்</span><br />
    </span><span class="English12">Stamp Duty of first Rs.</span></td>
    <td colspan="2">      <span class="English12">
      <?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo '50,000.00 * 3%'; else echo '100,000.00 X 3%' ;?>    
    </span></td>
    <td><div align="right">
      
      <span class="English12">
        <?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo 50000.00 *0.03; else echo 100000.00 * 0.03 ;?>
    </span></div></td>
  </tr>
  <tr>
    <td colspan="2"><span class="English12"><span class="Tamil09">எஞ்சியது</span><br />On Balance</span></td>
    <td>&nbsp;</td>
    <td colspan="2">
      <span class="English12">
      <?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo ($row_Recordset1['marketvalue']-50000) . '* 2%'; else echo ($row_Recordset1['marketvalue']-100000) . 'X 4%'; ?>    
      </span></td>
    <td><div align="right">
      
      <span class="English12">
        <?php if (strcmp($row_Recordset1['nature'],'Donation')==0) echo ($row_Recordset1['marketvalue']-50000)*0.02; else echo ($row_Recordset1['marketvalue']-100000)*0.04; ?>
    </span></div></td>
  </tr>
  <tr>
    <td colspan="5"><span class="English12"><span class="Tamil09">அசையாச் சொத்துக்களின் சந்தைப் பெறுமதியின்படி செலுத்தவேண்டிய முத்திரைத் தீர்வை</span><br />The Stamp duty payable on the market value of the immoveable property.</span></td>
    <td><div align="right">
      
      <span class="English12">
      <?php if (strcmp($row_Recordset1['nature'],'Donation')==0)
		{ $actualduty= (50000.00 * 0.03) + (($row_Recordset1['marketvalue']-50000)*0.02);
			echo $actualduty;}
	 else 
	 	{$actualduty=  (100000.00 * 0.03)+ (($row_Recordset1['marketvalue']-100000)*0.04) ;
	 		echo $actualduty;}?>
    </span></div></td>
  </tr>
  <tr>
    <td colspan="5"><span class="English12"><span class="Tamil09"><b>கழிக்கப்பட்டது</b>- உறுதியில் காட்டப்பட்டுள்ள பெறுமதி அடிப்படையில் செலுத்தப்பட்டுள்ள முத்திரைத் தீர்வை</span><br />
    <b>Deducted</b> : The value of the stamp duty paid as per in deed.</span></td>
    <td><div align="right"><span class="English12"><?php echo $row_Recordset1['amount']; ?></span></div></td>
  </tr>
  <tr>
    <td colspan="5"><span class="English12"><span class="Tamil09">குறைந்த முத்திரைத் தீர்வை</span><br />The stamp duty deficiency.</span></td>
    <td><div align="right">
      
      <span class="English12">
      <?php $lacking=$actualduty- $row_Recordset1['amount']; echo $lacking; ?>
    </span></div></td>
  </tr>
  <tr>
    <td colspan="3"><span class="English12"><span class="Tamil09">முத்திரைத் தீர்வைக்கான தண்டம்</span><br />The penalty for stamp duty.</span></td>
    <td colspan="2"><span class="English12"><?php echo $actualduty . ' X '. $_POST['penaltyrate'] . '%'; ?></span></td>
    <td><div align="right">
      
      <span class="English12">
        <?php $penalty= ($actualduty*$_POST['penaltyrate'])/100; echo $penalty; ?>
    </span></div></td>
  </tr>
  <tr>
    <td colspan="5"><span class="English12"><span class="Tamil09">செலுத்தவேண்டிய முத்திரைத் தீர்வையும் தண்டமும்</span><br />The penalty and deficiency of stamp duty payable.</span></td>
    <td><div align="right"><span class="English12"><?php echo $lacking+$penalty; ?></span></div></td>
  </tr>
  <tr>
    <td colspan="6"><span class="English12"><span class="Tamil09">மேற்குறிப்பிட்ட நிதிநியதிச் சட்டத்தின் 55(1)(ஆ) பிரிவின் படி தகுந்த முத்திரைத் தீர்வையின் 300% வரை தண்டம் விதிக்கமுடியும்.</span><br />
    Under section 55(1)(b) of the above Statute penalty can be imposed up to 300% on proper stamp duty.</span></td>
  </tr>
  <tr>
    <td colspan="6">
    <span class="English12">This Assessment is issued as per the agreement reached on </span><br/><span class="Tamil09">இவ்வரி மதிப்பீட்டு அறிவித்தல் திகதி </span><span class="English12">: <?php echo Date('Y-m-d'); ?><br />
    </span></td>
  </tr>
  
  <tr>
    <td colspan="6">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="6"><div align="right"><span class="English12"><span class="Tamil09">ஆணையாளர்</span><br />Commissioner</span></div></td>
  </tr>
</table>

<p><span class="Tamil09">செலுத்த வேண்டிய  தொகையை இவ் அலுவலகத்தில் உடனடியாகச் செலுத்துதல் வேண்டும்.</span><br />
  <span class="English12">Payable  amount must be paid to this office forth with.</span></p>
<p><br />
  <span class="Tamil09">எல்லாக் கடிதத்  தொடர்புகளிலும் உங்களது கோவை இலக்கத்தைக் குறிப்பிடுங்கள். மேலும் இந்த முத்திரைத்தீர்வையின்  படி கட்டணம் செலுத்தப்படும்போது வரி விதிப்பு இலக்கத்தையும் குறிப்பிடுங்கள்.</span><br />
<span class="English12">Please quote  your file number in all correspondence. If the payment is made according to  this assessment, please indicate the charge number.</span></p>
<p><br />
  <span class="Tamil09">காசோலையாகச் செலுத்துவதாயின்  எல்லாக் காசோலைகளும் &rdquo;மாகாண இறைவரி ஆணையாளர், இறைவரித் திணைக்களம், வடக்கு மாகாணம்&rdquo;  என எழுதப்பட்டு இலங்கை வங்கியின் எந்தவொரு கிளையிலும் செலுத்த முடியும்.</span><br />
<span class="English12">All chargers,  should be drawn in favor of the &ldquo;Commissioner of Provincial Revenue, Department  of Provincial Revenue, Northern Province&rdquo; and paid to any one of the branches  of Bank of Ceylon.</span></p>
<br />
<p align="center"><b>
  மேன்முறையீடு<br />
  Appeals</b></p>
 <div class="boxed"> 
  <span class="Tamil09">I) வரி மதிப்பீட்டுப்  படிவத்திகதியிலிருந்து 30 நாட்களுக்குள் எழுத்து மூலம் அனுப்பிவைக்கப்படுதல் வேண்டும்.</span><br />
  <span class="English12">Should be  made in writing within 30 days from the date of the notice of assessment.</span></p>
<p><br />
  <span class="Tamil09">II) மேன்முறையீடானது  மாகாண இறைவரி ஆணையாளர், வடக்கு மாகாணம் என முகவரியிடப்படுதல் வேண்டும்.</span><br />
  <span class="English12">Appeals  should be addressed to the Commissioner of Provincial Revenue, Northern Province.</span></p>
<p><br />
  <span class="Tamil09">III) மேன்முறையீட்டிற்குரிய  காரணங்கள் சுருக்கமாகக் கூறப்பட்டிருத்தல் வேண்டும்.</span><br />
  <span class="English12">Should be  stated precisely the ground of such appeals.</span></p>
<p><br />
  <span class="Tamil09">IV) வரி மதிப்பீட்டு  மேன்முறையீட்டைக் கொண்ட கடிதங்களை மாகாண இறைவரி ஆணையாளர், இறைவரித்திணைக்களம், வடக்கு  மாகாணம், இல 15, நல்லூர் குறுக்கு வீதி, யாழ்ப்பாணம் என்ற முகவரிக்கு அனுப்புதல் வேண்டும்.</span><br />
  <span class="English12">The envelope  containing the letter of appeal should be addressed to the Commissioner of Provincial  Revenue, Department of Provincial Revenue, Northern Province, No. 15, Nallur  Cross Road, Jaffna.</span></p>
<p><br />
  <span class="Tamil09">V) குறித்தொதுக்கப்  பட்டுள்ள முத்திரைத் தீர்வை இடைநிறுத்தப்பட்டிராவிடின் கோரிக்கையொன்று இருந்தாலும்  செலுத்துதல் வேண்டும்.</span><br />
  <span class="English12">Stamp duty is  payable if not held over not withstanding any appeal.</span></p></div>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
