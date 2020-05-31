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

$datefrom=$_GET['datefrom'];
$dateto=$_GET['dateto'];

mysql_select_db($database_revenuecon, $revenuecon);
/*
if ($_GET['AGR_Confirmation']==2)
{
$query_stampdutyfirst = "SELECT sum(stampdutyfirst.amount) as subtotalamount, stampdutyfirst.localauthorityid, localauthorities.name,  localauthorities.district_council FROM stampdutyfirst, localauthorities WHERE stampdutyfirst.localauthorityid=localauthorities.id  and stampdutyfirst.dataentrydate >= date('" . $startdate->format('Y-m-d') ."') and stampdutyfirst.dataentrydate < date('" . $enddate->format('Y-m-d') . "') and stampdutyfirst.localauthorityid<>35 group by localauthorityid order by district_council, localauthorityid";
}
else
{
	$query_stampdutyfirst = "SELECT sum(stampdutyfirst.amount) as subtotalamount, stampdutyfirst.localauthorityid, localauthorities.name,  localauthorities.district_council FROM stampdutyfirst, localauthorities WHERE stampdutyfirst.localauthorityid=localauthorities.id  and stampdutyfirst.dataentrydate >= date('" . $startdate->format('Y-m-d') ."') and stampdutyfirst.dataentrydate < date('" . $enddate->format('Y-m-d') . "') and updateok=" . $_GET['AGR_Confirmation'] . " and stampdutyfirst.localauthorityid<>35 group by localauthorityid order by district_council, localauthorityid";
	}
*/
if ($_GET['AGR_Confirmation']==2)
{
$query_stampdutyfirst = "SELECT sum(stampdutyfirst.amount) as subtotalamount, stampdutyfirst.localauthorityid, localauthorities.name,  localauthorities.district_council 
FROM stampdutyfirst, localauthorities 
WHERE stampdutyfirst.localauthorityid<>0 and stampdutyfirst.amount>=0 and 
stampdutyfirst.localauthorityid=localauthorities.id  and 
stampdutyfirst.loidentifieddate >= date('" . $datefrom ."') and stampdutyfirst.loidentifieddate <= date('" . $dateto . "')  
group by localauthorityid 
order by district_council, localauthorityid";
}
else
{
	$query_stampdutyfirst = "SELECT sum(stampdutyfirst.amount) as subtotalamount, stampdutyfirst.localauthorityid, localauthorities.name,  localauthorities.district_council 
	FROM stampdutyfirst, localauthorities 
	WHERE stampdutyfirst.localauthorityid<>0 and stampdutyfirst.localauthorityid<>35 and stampdutyfirst.amount>=0 and 
	stampdutyfirst.localauthorityid=localauthorities.id  and
	stampdutyfirst.loidentifieddate >= date('" . $datefrom ."') and stampdutyfirst.loidentifieddate <= date('" . $dateto . "') and 
	updateok=" . $_GET['AGR_Confirmation'] . " group by localauthorityid order by district_council, localauthorityid";
}

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

$grandtotal_amount=0;
$districttotal_amount=0;


?>
<?php
mysql_select_db($database_revenuecon, $revenuecon);
//identified after date limit should be considered as unidentified
$query_unidentifiedrecords = "SELECT sum(amount) as unidentifiedsum FROM stampdutyfirst WHERE dataentrydate<=date('" . $dateto . "') and (localauthorityid=0 or loidentifieddate>date('" . $dateto . "'))";

$unidentifiedrecords = mysql_query($query_unidentifiedrecords, $revenuecon) or die(mysql_error());
$row_unidentifiedrecords = mysql_fetch_assoc($unidentifiedrecords);
$totalRows_unidentifiedrecords = mysql_num_rows($unidentifiedrecords);
$unidentifiedtotal=$row_unidentifiedrecords['unidentifiedsum'];

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
<?php include("letterheadBW.php"); ?>
<h3>Collection of Stamp Duty for the month of <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?> <?php if ($_GET['AGR_Confirmation']!=2) { ?> ( <?php if (!$_GET['AGR_Confirmation']) echo "Not "; ?> Confirmed By ADR)<?php };?></h3>

<div style="overflow:auto;">
<img src="excellogo.jpg" class="hide-from-printer" width="30" height="31" onclick="fnExcelReport();"/><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a> 
<table id="myTable" width="auto" border="1" class="hovertable">
  <tr>
    <th scope="col">District</th>
    <th scope="col">Local Authority</th>
    <th scope="col">Amount</th>
    
    </tr>
    <tr>
    <td colspan="2"><b>Opening Balance as at <?php echo ' '.$startdate->format('Y-m-d').' ' ; ?>as per cash book</b></td>
    <td align="right"><b><?php echo number_format($_GET['openingbalance'],2,'.',','); ?></b></td>
    </tr>
    
    
  	<?php do {
	  	$grandtotal_amount += $row_stampdutyfirst['subtotalamount'];
		$districttotal_amount+=$row_stampdutyfirst['subtotalamount'];
	   	
		?>
  
    	<tr>
      		<td><?php echo $row_stampdutyfirst['district_council']; ?></td>
      		<td><?php echo $row_stampdutyfirst['name']; ?></td>
      		<td align='right'><?php echo number_format($row_stampdutyfirst['subtotalamount'],2,'.',','); ?></td>
      	</tr>
      <?php
	  $fetchok=($row_stampdutyfirstnext = mysql_fetch_assoc($stampdutyfirst));
	  if ($fetchok)
	  {
		  if ($row_stampdutyfirstnext['district_council'] != $row_stampdutyfirst['district_council']) {
			
			echo "<tr>
				<td></td>
				<td><b>".$row_stampdutyfirst['district_council']." SUB TOTAL</a></b></td>
                
				<td align='right'><b>".number_format($districttotal_amount,2,'.',',')."</b></td>
			</tr>";
			$districttotal_amount = 0;
		}
	  $row_stampdutyfirst=$row_stampdutyfirstnext;}
	 
     } while ($fetchok); ?>
     
<tr>
				<td></td>
				<td><b><?php echo $row_stampdutyfirst['district_council'].' ';?> SUB TOTAL</a></b></td>
                
				<td align='right'><b> <?php echo number_format($districttotal_amount,2,'.',','); ?></b></td>
			</tr>  
	  
   <tr>
		<td></td>
            <td><b>GRAND TOTAL</b></td>
			<td align='right'><b><?php echo number_format($grandtotal_amount,2,'.',','); ?> </b></td>
	</tr>
   <tr>
   <td></td>
   <td>Unidentified</td>
   <td align='right'><?php echo number_format($unidentifiedtotal,2,'.',','); ?> </td>
   </tr>
<tr>
     <td></td>
     <td><b>Closing Balance as at <?php echo ' '.$enddate->sub(new DateInterval('P1D'))->format('Y-m-d').' ' ; ?></b></td>
     <td align='right'><b><?php echo number_format($unidentifiedtotal+$grandtotal_amount+$_GET['openingbalance'],2,'.',','); ?></b></td>
   </tr>
	
</table>
<p>&nbsp;</p>
<p>Checked By:</p>
<p>&nbsp;</p>
<p>Commissioner</p>
</body>
</html>
     
<?php
mysql_free_result($unidentifiedrecords);

mysql_free_result($stampdutyfirst);
?>
