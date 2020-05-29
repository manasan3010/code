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
function penalty($theValue, $delay) 
{
	if ($delay >365)
		$rate=1;
	else if ($delay>180)
		$rate=0.5;
	else if ($delay>13)
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

$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername FROM stampdutyfirst, loyers1 
WHERE  stampdutyfirst.notaryid=loyers1.id and stampdutyfirst.date >= date('" . $startdate->format('Y-m-d') ."') and 
stampdutyfirst.date < date('" . $enddate->format('Y-m-d') . "') and stampdutyfirst.amount>=5000 and 
DATEDIFF(stampdutyfirst.date, stampdutyfirst.deeddate)>14 order by loyers1.id";


//$query_limit_stampdutyfirst = sprintf("%s LIMIT %d, %d", $query_stampdutyfirst, $startRow_stampdutyfirst, $maxRows_stampdutyfirst);
$query_limit_stampdutyfirst =$query_stampdutyfirst;
$stampdutyfirst = mysql_query($query_limit_stampdutyfirst, $revenuecon) or die(mysql_error());
$row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst);
if (isset($_GET['totalRows_stampdutyfirst'])) {
  $totalRows_stampdutyfirst = $_GET['totalRows_stampdutyfirst'];
} else {
  $all_stampdutyfirst = mysql_query($query_stampdutyfirst);
  $totalRows_stampdutyfirst = mysql_num_rows($all_stampdutyfirst);
}
$totalPages_stampdutyfirst = ceil($totalRows_stampdutyfirst/$maxRows_stampdutyfirst)-1;
$subtotal_penalty=0;
$grandtotal_penalty=0;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />

</head>

<body>
<?php include("letterheadBW.php"); ?>
<h2>Stamp Duty Delay Penalty to Notary <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h2>
<a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>
<div style="overflow:auto;">
<table id="myTable" width="auto" border="1" class="hovertable">
  <tr>
    <th scope="col">ID</th>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
    <th scope="col">Paid Date</th>
    <th scope="col">Delay</th>
    <th scope="col">Amount</th>
    <th scope="col">Penalty</th>
    <th scope="col">Name of Notary</th>
  </tr>
  <?php do {
	  	
		$date1=date_create($row_stampdutyfirst['deeddate']);
		$date2=date_create($row_stampdutyfirst['date']);
		$delay=date_diff($date1,$date2);
		$fine=penalty($row_stampdutyfirst['amount'],$delay->days);
		$subtotal_penalty += $fine;
  		$grandtotal_penalty += $fine;
	   ?>
  
    <tr>
      <td><a href="updateStampDutyEntry.php?id=<?php echo $row_stampdutyfirst['id']; ?>"><?php echo $row_stampdutyfirst['id']; ?></a></td>
      <td><?php echo $row_stampdutyfirst['deedno']; ?></td>
      <td><?php echo $row_stampdutyfirst['deeddate']; ?></td>
      <td><?php echo $row_stampdutyfirst['date']; ?></td>
      <td align='center'><?php echo $delay->days; ?> </td>
      <td align='right'><?php echo number_format($row_stampdutyfirst['amount'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($fine,2,'.',','); ?></td>
      <td><?php echo $row_stampdutyfirst['loyername']; ?></td>
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
				<td></td>
				<td><b><a href=penaltytonotaryletter.php?reportdate=".$_GET['reportdate']."&loyerid=" .$row_stampdutyfirst['notaryid']. ">" .$row_stampdutyfirst['loyername']." SUB TOTAL</a></b></td>
                
				<td align='right'><b>".number_format($subtotal_penalty,2,'.',',')."</b></td>
			</tr>";
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
            <td><b><a href="penaltytonotaryletter.php?reportdate=<?php echo $_GET['reportdate']; ?>&amp;loyerid=<?php echo $row_stampdutyfirst['notaryid']; ?>"><?php echo $row_stampdutyfirst['loyername']." SUB TOTAL";?></a></b></td>
            <td align='right'><b><?php echo number_format($subtotal_penalty,2,'.',','); ?></b> </td>
	</tr>
    <tr>
		<td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><b>Grand Total</b></td>
            <td align='right'><b><?php echo number_format($grandtotal_penalty,2,'.',','); ?> </b></td>
	</tr>
	
</table>
</body>
</html>
     
<?php
mysql_free_result($stampdutyfirst);
?>
