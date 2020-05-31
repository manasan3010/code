<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentry";
$MM_donotCheckaccess = "false";
include("lotodistrict.php");
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
$localauthorityid=$_GET['loid'];
$selectedyear=date('Y',strtotime($_GET['reportdate']));
$selectedmonth=date('m',strtotime($_GET['reportdate']));
$startdate= new DateTime;
$startdate->setDate($selectedyear, $selectedmonth, 1);
$enddate= new DateTime;
if ($selectedmonth<12)
$enddate->setDate($selectedyear, $selectedmonth+1, 1);

else
$enddate->setDate($selectedyear+1, 1, 1);

$strdatefrom=$_GET['datefrom'];
$strdateto=$_GET['dateto'];
$datefrom=new DateTime;
$dateto=new DateTime;
$datefrom->setDate(date('Y',strtotime($_GET['datefrom'])), date('m',strtotime($_GET['datefrom'])), date('d',strtotime($_GET['datefrom'])));
$dateto->setDate(date('Y',strtotime($_GET['dateto'])), date('m',strtotime($_GET['dateto'])), date('d',strtotime($_GET['dateto'])));

mysql_select_db($database_revenuecon, $revenuecon);

if ($_GET['AGR_Confirmation']==2)
{ if ($localauthorityid<>0)
	$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name 
	FROM stampdutyfirst, loyers1, localauthorities 
	WHERE stampdutyfirst.localauthorityid=".$localauthorityid." and stampdutyfirst.amount>=0 and 
	stampdutyfirst.localauthorityid=localauthorities.id  and 
	stampdutyfirst.loidentifieddate >= date('" . $strdatefrom ."') and 
	stampdutyfirst.loidentifieddate <= date('" . $strdateto . "') and
	stampdutyfirst.notaryid=loyers1.id
	order by stampdutyfirst.date" ;
	else
	$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name 
	FROM stampdutyfirst, loyers1, localauthorities 
	WHERE 
	stampdutyfirst.dataentrydate<=date('" . $strdateto . "') and
	(stampdutyfirst.localauthorityid=0 or stampdutyfirst.loidentifieddate > date('" . $strdateto . "') ) and
	stampdutyfirst.localauthorityid=localauthorities.id  and 
	stampdutyfirst.notaryid=loyers1.id
	order by stampdutyfirst.date" ;
	}
else
{
	if ($localauthorityid<>0)
$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name 
FROM stampdutyfirst, loyers1, localauthorities 
WHERE 
	stampdutyfirst.localauthorityid=".$localauthorityid." and stampdutyfirst.amount>=0 and 
	stampdutyfirst.localauthorityid=localauthorities.id  and 
	stampdutyfirst.loidentifieddate >= date('" . $datefrom ."') and 
	stampdutyfirst.loidentifieddate <= date('" . $dateto . "') and
	stampdutyfirst.notaryid=loyers1.id and
	updateok=" . $_GET['AGR_Confirmation'] . "  order by stampdutyfirst.date" ;
	else
$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name 
FROM stampdutyfirst, loyers1, localauthorities 
WHERE 
	stampdutyfirst.dataentrydate<=date('" . $strdateto . "') and
	(stampdutyfirst.localauthorityid=0 or stampdutyfirst.loidentifieddate > date('" . $strdateto . "') ) and
	stampdutyfirst.localauthorityid=localauthorities.id  and 
	stampdutyfirst.notaryid=loyers1.id and
	updateok=" . $_GET['AGR_Confirmation'] . "  order by stampdutyfirst.date" ;	
}
$stampdutyfirst = mysql_query($query_stampdutyfirst, $revenuecon) or die(mysql_error());
$row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst);
$totalRows_stampdutyfirst = mysql_num_rows($stampdutyfirst);

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
</head>

<body>
<h3 align="center">Name of the Local Authority - <?php echo ' '.$row_stampdutyfirst['name'];?>  <?php if ($_GET['AGR_Confirmation']!=2) { ?> ( <?php if (!$_GET['AGR_Confirmation']) echo "Not "; ?> Confirmed By ADR)<?php };?></h3>

<table width="auto" border="0">
  <tr>
    <td width='30%'><h3>Month : <?php echo date('F',strtotime($_GET['reportdate'])). ' - ' . $selectedyear.'        '; ?></h3></td>
    <td width='30%'><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a><img src="excellogo.jpg" alt="Export to Excel" class="hide-from-printer" width="30" height="31" onclick="fnExcelReport();"/></td>
    <td width='30%'><h3>District : <?php echo ' '.lotodistrict($_GET['loid']);?></h3></td>
  </tr>
</table>

<div style="overflow:auto;">
  <table id="myTable" width="auto" border="1" class="hovertable">
 
  <tr>
    <th scope="col">No</th>
    <th scope="col">Month</th>
    <th scope="col">Bank Statement Date</th>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
    <th scope="col">Amount</th>
    <th scope="col">Name of Notary</th>
    <th scope="col">Refund/Transfer</th>
  </tr>
  <?php
  	$serial=0;
   $runningtotal=0;
  do { $runningtotal+=$row_stampdutyfirst['amount'];
  $serial+=1;
  ?>
  
    <tr>
      <td><?php echo $serial; ?></td>
      <td><?php echo date('F',strtotime($row_stampdutyfirst['date'])); ?></td>
      <td><?php echo $row_stampdutyfirst['date']; ?></td>
      <td><?php echo $row_stampdutyfirst['deedno']; ?></td>
      <td><?php echo $row_stampdutyfirst['deeddate']; ?></td>
      <td align='right'><?php echo number_format($row_stampdutyfirst['amount'],2,'.',','); ?></td>
      <td><?php echo $row_stampdutyfirst['loyername']; ?></td>
      <td> </td>
     
    </tr>
    
    <?php } while ($row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst)); ?>
    <tr>
    	<td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><b>Total</b></td>
        <td><b><?php echo number_format($runningtotal,2,'.',','); ?></b></td>
        
    </tr>
</table>
</div>

</body>
</html>
<?php
mysql_free_result($stampdutyfirst);
?>
