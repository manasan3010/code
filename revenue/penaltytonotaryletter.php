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
function penalty($theValue, $delay) 
{
	if ($delay >365)
		$rate=1;
	else if ($delay>180)
		$rate=0.5;
	else if ($delay>14)
		$rate=0.25;
	else $rate=0;
	
	return $theValue*$rate;
	}

$maxRows_stampdutyfirst = 20;
$pageNum_stampdutyfirst = 0;
if (isset($_GET['pageNum_stampdutyfirst'])) {
  $pageNum_stampdutyfirst = $_GET['pageNum_stampdutyfirst'];
}
$startRow_stampdutyfirst = $pageNum_stampdutyfirst * $maxRows_stampdutyfirst;

$selectedyear=date('Y',strtotime($_GET['reportdate']));
$selectedmonth=date('m',strtotime($_GET['reportdate']));
$startdate= new DateTime;
$startdate->setDate($selectedyear, $selectedmonth, 1);
$enddate= new DateTime;
if ($selectedmonth<12)
$enddate->setDate($selectedyear, $selectedmonth+1, 1);

else
$enddate->setDate($selectedyear+1, 1, 1);
mysql_select_db($database_revenuecon, $revenuecon);

$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, loyers1.address 
FROM stampdutyfirst, loyers1 WHERE  stampdutyfirst.notaryid=loyers1.id and 
stampdutyfirst.date >= date('" . $startdate->format('Y-m-d') ."') and 
stampdutyfirst.date < date('" . $enddate->format('Y-m-d') . "') and 
DATEDIFF(stampdutyfirst.date, stampdutyfirst.deeddate)>14 and stampdutyfirst.amount>=5000 AND
stampdutyfirst.notaryid=" . $_GET['loyerid'];


$query_limit_stampdutyfirst = sprintf("%s LIMIT %d, %d", $query_stampdutyfirst, $startRow_stampdutyfirst, $maxRows_stampdutyfirst);
$stampdutyfirst = mysql_query($query_stampdutyfirst, $revenuecon) or die(mysql_error());
$row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst);

if (isset($_GET['totalRows_stampdutyfirst'])) {
  $totalRows_stampdutyfirst = $_GET['totalRows_stampdutyfirst'];
} else {
  $all_stampdutyfirst = mysql_query($query_stampdutyfirst);
  $totalRows_stampdutyfirst = mysql_num_rows($all_stampdutyfirst);
}
$totalPages_stampdutyfirst = ceil($totalRows_stampdutyfirst/$maxRows_stampdutyfirst)-1;
$subtotal_penalty=0;
$NotaryName=$row_stampdutyfirst['loyername'];
$NotaryAddress=$row_stampdutyfirst['address'];

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
<style type="text/css">
.Tamil09 {
	font-size: 9pt;
}
.English12 {
	font-size: 12pt;
}
</style>
</head>

<body>
<?php include 'letterheadBW.php';?>
<p><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a></p>
<table width="100%" border="0">
  <tr>
    <td colspan="2"><span class="English12">NP/PDR/NY/......................... </span></td>
    <td width="15%"><span class="English12"><?php echo Date('Y-m-d'); ?></span></td>
  </tr>
  <tr>
    <td width="12%"><span class="English12">Mr./Ms.</span></td>
    <td width="73%"><span class="English12"><?php echo $NotaryName;?></span></td>
    <td>&nbsp;</td>
  </tr>
<tr>
    <td>&nbsp;</td>
    <td><span class="English12">Notary Public,</span></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td><span class="English12"><?php echo $NotaryAddress;?></span></td>
    <td>&nbsp;</td>
  </tr>
</table>


<p class="Tamil09"><strong>தாமதமாகச் செலுத்திய முத்திரைத்தீர்வை மீதான தண்டப்பணம் விதித்தல்.</strong></p>
<p align="justify" class="Tamil09">2014 ஆம் ஆண்டின் 01ம் இலக்க வடக்கு மாகாண நிதி நியதிச் சட்டத்தின் பிரிவு 38 இன் ஏற்பாடுகளுக்கு இணங்க ஏதேனும் சாதனத்திற்கு அறவிடப்படவேண்டிய முத்திரைத்தீர்வை அச்சாதனம் எழுதி நிறைவேற்றப்பட முன்னரோ அல்லது எழுதி நிறைவேற்றப்படும் நேரத்திலோ செலுத்தப்படுதல் வேண்டும். </p>
<p align="justify" class="Tamil09">தங்களால் எழுதி நிறைவேற்றப்பட்டுள்ள பின்வரும் இலக்கச் சாதனங்களின் இரண்டாவது பிரதிகள் தாமதமாக முத்திரைத்தீர்வை செலுத்தப்பட்டதன் காரணமாக 2014 ஆம் ஆண்டின் 01ம் இலக்க வடமாகாண நிதி நியதிச் சட்டத்தின் பிரிவு 38 இன் ஏற்பாடுகளுக்கு அமைய குற்றமாகக் கருதப்படுகின்றது.</p>
<p align="justify" class="Tamil09">இத்தகைய சாதனங்கள் தொடர்பில் தாமதக் காலப்பகுதியைக் கருத்திற் கொண்டு 2014 ஆம் ஆண்டின் 01ம் இலக்க வடமாகாண நிதி நியதிச் சட்டத்தின் பிரிவு 72 இன் ஏற்பாடுகளின் பிரகாரம் முத்திரைத் தீர்வை மீது பின்வருமாறு தண்டப்பணம் விதிக்கப்படுகின்றது.</p>
<table width="auto" border="1">
  <tr>
    <th class="Tamil09" scope="col">தாமதித்த காலம்</th>
    <th class="Tamil09" scope="col">தண்ட வீதம்</th>
  </tr>
  <tr>
    <td class="Tamil09">15 நாட்கள் தொடக்கம் 6 மாதங்களுக்குள்</td>
    <td><div align="center" class="Tamil09">25%</div></td>
  </tr>
  <tr>
    <td class="Tamil09">6 மாதம் தொடக்கம் 12 மாதங்களுக்குள்</td>
    <td><div align="center" class="Tamil09">50%</div></td>
  </tr>
  <tr>
    <td class="Tamil09">1 வருடம் அல்லது அதற்கு மேல்</td>
    <td><div align="center" class="Tamil09">100%</div></td>
  </tr>
</table>
<p align="justify" class="Tamil09">இத்துடன் இணைக்கப்பட்டுள்ள படிவத்தில் (NPSD-02) இத்தண்டப் பணத்தை இலங்கை வங்கியில் செலுத்தி இதன் திணைக்களப் பிரதியை எமது அலுவலகத்திற்கு அனுப்பிவைக்குமாறு கேட்டுக் கொள்கின்றேன். அத்துடன் தாமதமின்றி உரிய தண்டப்பணத்தைச் செலுத்துவதற்கு நடவடிக்கை எடுக்குமாறு இத்தால் அறியத்தருகின்றேன்.</p>



<div style="overflow-x:auto;">
<table id="myTable" width="auto" border="1" class="hovertable">
  <tr>
    <th scope="col">ID</th>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
    <th scope="col">Paid Date</th>
    <th scope="col">Delay</th>
    <th scope="col">Amount</th>
    <th scope="col">Penalty</th>
    
  </tr>
  <?php do {
	  	
  		$date1=date_create($row_stampdutyfirst['deeddate']);
		$date2=date_create($row_stampdutyfirst['date']);
		$delay=date_diff($date1,$date2);
		$fine=penalty($row_stampdutyfirst['amount'],$delay->days);
		$subtotal_penalty += $fine;
	   ?>
  
    <tr>
      <td><?php echo $row_stampdutyfirst['id']; ?></td>
      <td><?php echo $row_stampdutyfirst['deedno']; ?></td>
      <td><?php echo $row_stampdutyfirst['deeddate']; ?></td>
      <td><?php echo $row_stampdutyfirst['date']; ?></td>
      <td align='center'><?php echo $delay->days; ?> </td>
      <td align='right'><?php echo number_format($row_stampdutyfirst['amount'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($fine,2,'.',','); ?></td>
     
    </tr>
      <?php
      $fetchok=($row_stampdutyfirstnext = mysql_fetch_assoc($stampdutyfirst));
	  if ($fetchok)
	  {
		  if ($row_stampdutyfirstnext['loyername'] != $row_stampdutyfirst['loyername']) {
			
			echo "<tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td><b> TOTAL</b></td>
				<td align='right'><b>".number_format($subtotal_penalty,2,'.',',').'</b></td>
			</tr>';
			$subtotal_penalty = 0;
		}
	  $row_stampdutyfirst=$row_stampdutyfirstnext;
	  }
    
     } while ($fetchok); ?>
     
     <tr>
		<td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><b>Total</b></td>
            <td align='right'><b><?php echo number_format($subtotal_penalty,2,'.',','); ?></b> </td>
	</tr>
    
	
</table>
<p>&nbsp;</p>
<p class="Tamil09">ஆணையாளர்.</p>
<p class="Tamil09">பிரதி</p>
<p class="Tamil09"> 1. உதவிப் பதிவாளர் நாயகம், பதிவாளர் நாயகம் திணைக்களம், வடக்கு வலயம்.</p>
<p class="Tamil09">2. காணிப்பதிவாளர், யாழ்ப்பாணம்.</p>
</body>
</html>
     
<?php
mysql_free_result($stampdutyfirst);
?>
