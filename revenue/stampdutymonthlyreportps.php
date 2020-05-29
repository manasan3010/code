<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentry,dataview";
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

$maxRows_stampdutyfirst = 20;
$pageNum_stampdutyfirst = 0;
if (isset($_GET['pageNum_stampdutyfirst'])) {
  $pageNum_stampdutyfirst = $_GET['pageNum_stampdutyfirst'];
}
$startRow_stampdutyfirst = $pageNum_stampdutyfirst * $maxRows_stampdutyfirst;

$selectedyear=date('Y',strtotime($_GET['reportdate']));
$selectedmonth=date('m',strtotime($_GET['reportdate']));
$selectedmonthword=date('F',strtotime($_GET['reportdate']));
$startdate= new DateTime;
$startdate->setDate($selectedyear, $selectedmonth, 1);
$enddate= new DateTime;
if ($selectedmonth<12)
$enddate->setDate($selectedyear, $selectedmonth+1, 1);

else
$enddate->setDate($selectedyear+1, 1, 1);
mysql_select_db($database_revenuecon, $revenuecon);
if ($_GET['AGR_Confirmation']<>2)
$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name FROM stampdutyfirst, loyers1, localauthorities WHERE stampdutyfirst.localauthorityid=localauthorities.id and stampdutyfirst.notaryid=loyers1.id and stampdutyfirst.date >= date('" . $startdate->format('Y-m-d') ."') and stampdutyfirst.date < date('" . $enddate->format('Y-m-d') . "') and localauthorityid=". $_GET['loid']. " and updateok=" . $_GET['AGR_Confirmation'] . " order by stampdutyfirst.notaryid, stampdutyfirst.deeddate" ;
else
$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name FROM stampdutyfirst, loyers1, localauthorities WHERE stampdutyfirst.localauthorityid=localauthorities.id and stampdutyfirst.notaryid=loyers1.id and stampdutyfirst.date >= date('" . $startdate->format('Y-m-d') ."') and stampdutyfirst.date < date('" . $enddate->format('Y-m-d') . "') and localauthorityid=". $_GET['loid']. " order by stampdutyfirst.notaryid, stampdutyfirst.deeddate" ;

//$query_limit_stampdutyfirst = sprintf("%s LIMIT %d, %d", $query_stampdutyfirst, $startRow_stampdutyfirst, $maxRows_stampdutyfirst);
$query_limit_stampdutyfirst=$query_stampdutyfirst;
$stampdutyfirst = mysql_query($query_limit_stampdutyfirst, $revenuecon) or die(mysql_error());
$row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst);
if (isset($_GET['totalRows_stampdutyfirst'])) {
  $totalRows_stampdutyfirst = $_GET['totalRows_stampdutyfirst'];
} else {
  $all_stampdutyfirst = mysql_query($query_stampdutyfirst);
  $totalRows_stampdutyfirst = mysql_num_rows($all_stampdutyfirst);
}
$totalPages_stampdutyfirst = ceil($totalRows_stampdutyfirst/$maxRows_stampdutyfirst)-1;
$subtotal_amount=0;
$grandtotal_amount=0;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
<script>
function fnExcelReport()
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('myTable'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"revenue.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}
</script>
<style>
p.big {
    line-height: 150%;
}
</style>
</head>

<body>
<h3>FORM OF SCHEDULE PRESCRIBED UNDER SECTION 3 OF THE TRANSFER OF STAMP DUTY STATUTE OF THE NORTHERN PROVINCE, No.02 OF 2014 </h3>
<h4>FOR THE MONTH OF : <?php echo ' '.$selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?>  <?php if ($_GET['AGR_Confirmation']!=2) { ?> ( <?php if (!$_GET['AGR_Confirmation']) echo "Not "; ?> Confirmed By ADR)<?php };?></h4>
<h4>ADMINISTRATIVE LIMIT : <?php echo ' '.$row_stampdutyfirst['name'];
$localauthority=$row_stampdutyfirst['name'];?> </h4>
<div style="overflow:auto;">
<img src="excellogo.jpg" class="hide-from-printer" width="30" height="31" onclick="fnExcelReport();"/><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a> Details of Stamp duty relating to Transfer of properties situated within the administrative limits of <?php echo ' '.$row_stampdutyfirst['name'];
$localauthority=$row_stampdutyfirst['name'];?> MC/UC/PS for the month of <?php echo ' '.$selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?>
<table id="myTable" width="auto" border="1" class="hovertable">
  <tr>
    <th scope="col">SNo</th>
    <th scope="col">Notary</th>
    <th scope="col">Instrument No</th>
    <th scope="col">Date of Attestation</th>
    <th scope="col">Nature of Instrument</th>
    <th scope="col">Amount</th>
    <th scope="col">Type of Payment</th>
    <th scope="col">Others</th>
  </tr>
  <?php do {
	  	$subtotal_amount += 1;
  		$grandtotal_amount += $row_stampdutyfirst['amount'];
	   ?>
    <tr>
    	<td><?php echo $subtotal_amount; ?></td>
      <td><?php echo $row_stampdutyfirst['loyername']; ?></td>
      <td><?php echo $row_stampdutyfirst['deedno']; ?></td>
      <td><?php echo $row_stampdutyfirst['deeddate']; ?></td>
      <td align='right'><?php echo $row_stampdutyfirst['nature']; ?></td>
      <td align='right'><?php echo number_format($row_stampdutyfirst['amount'],2,'.',','); ?></td>
      <td scope="col">Certificate of Payment at Bank</td>
      <td scope="col"></td>
    </tr>
      <?php
         
     } while ($row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst)); ?>
     
    <tr>
		    <td></td>
            <td></td>
            <td></td>
            <td><a href="annexI.php?localauthority=<?php echo $localauthority; ?>&amp;amount=<?php echo $grandtotal_amount; ?>&amp;year=<?php echo $selectedyear; ?>&amp;month=<?php echo $selectedmonthword; ?>"><b>GRAND TOTAL</b></a></td>
            <td align='right'>&nbsp;</td>
			<td align='right'><b><?php echo number_format($grandtotal_amount,2,'.',','); ?> </b></td>
	</tr>
	
</table>
<p>1. If affixed stamp of the Central Government state &quot;Central Government&quot; or if affixed of / Certificates of payment of any Provincial Council, State the name of such Provincial Council under Column 09.</p>
<p>2. In case the stamp / certificate of payment affixed to any provincial council inadvertently to the instrument relating to Lease or Morrtgage Bond, such perticulars should be described in the schedule.</p>
<p>3. The stamp duty of Rs. 1/= affixed to the originals of the instrumnent as shown under column 06, that fact should be stated in the remarks column.</p>
<table width="780" border="0">
  <tr>
    <th width="257" scope="col">Checked By: .................................. </th>
    <th width="282" scope="col">&nbsp;</th>
    <th width="219" scope="col">Signature...................................</th>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
</table>
<p style="page-break-before: always;">&nbsp;</p>
<p align="center">FORM OF CLAIM PRESCRIBED UNDER SECTION 3 OF THE TRANSFER OF  STAMP DUTY STATUTE OF THE <br/>NORTHERN PROVINCE, No. 02 of 2014<br /></p>
<p class="big">
  I …................................…. the Land Registrar and Additional District Registrar  of …....................….. authorized by Registrar General do hereby certify that:<br />
  A stamp duty amount to Rupees <b><?php echo convert_number_to_words($grandtotal_amount); ?></b> (Rs. <b><?php echo number_format($grandtotal_amount,2,'.',','); ?></b>)  for the month <?php echo ' '.$selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?>  in respect of the above mentioned Municipal Council  / Urban Council / Pradeshiya Sabha is true and correct;<br />
  The above statement has been prepared after having perused  the duplicates of the instruments available at this office under Section 5(1)  of the Registration of Documents Ordinance (Chapter 117);<br />
  The instrument attested by the Notary has not been entered  twice in the schedules nor has the same instrument been entered under two Local  Authorities; and that the 7th column of the table shows the adhesive  stamps of the Northern Provincial Council / Certificates of Payment issued by  Bank.</p>
<table width="auto" border="0">
  <tr>
    <td width="443">Date:……… </td>
    <td width="198"><p>Signature  : …………</p>
      <p><br/>
        Name:…................…<br/>
      (Rubber  stamp).</p></td>
  </tr>
  <tr>
    <td>For the use of the Registrar General office,<br />
Hon. Minister of Finance,<br />
Northern Province,<br /></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td height="39">Counter Signed and forwarded for necessary action.</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Date:………..<br/>
     Address / Office of the  Registrar  General  </td>
    <td><p>Signature  : …………</p>
      <p><br/>
        Name:…................…<br/>
        (Rubber  stamp).</p></td>
  </tr>
</table>
</body>
</html>
     
<?php
mysql_free_result($stampdutyfirst);
?>
