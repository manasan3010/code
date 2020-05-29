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
if (isset($_GET['dataentrydate'])) {
  $colname_stamp = $_GET['dataentrydate'];
}
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
$query_stamp = "SELECT date, sum(amount) as duty FROM stampdutyfirst WHERE dataentrydate >= date('" . $startdate->format('Y-m-d') ."') and dataentrydate < date('" . $enddate->format('Y-m-d') . "') and (stampdutyfirst.localauthorityid<>35 or stampdutyfirst.localauthorityid<>0) GROUP BY date ORDER BY date";
*/
$query_stamp1 = "SELECT date, sum(amount) as duty 
FROM stampdutyfirst 
WHERE 
(  
	(dataentrydate >=date('" . $datefrom ."') and dataentrydate <= date('" . $dateto . "')) 
	or
	(loidentifieddate >=date('" . $datefrom ."') and loidentifieddate <= date('" . $dateto . "'))
) and 
(stampdutyfirst.localauthorityid<>35 or stampdutyfirst.localauthorityid<>0) and
stampdutyfirst.date < date('" . $startdate->format('Y-m-d') ."') and 
stampdutyfirst.amount>0 
GROUP BY YEAR(date),MONTH(date) 
ORDER BY date";

$stamp = mysql_query($query_stamp1, $revenuecon) or die(mysql_error());
$row_stamp = mysql_fetch_assoc($stamp);
$totalRows_stamp = mysql_num_rows($stamp);


$query_stamp2 = "SELECT date, sum(amount) as duty FROM stampdutyfirst WHERE dataentrydate >=date('" . $datefrom ."') and dataentrydate <= date('" . $dateto . "') and (stampdutyfirst.localauthorityid<>35 or stampdutyfirst.localauthorityid<>0) and stampdutyfirst.date >= date('" . $startdate->format('Y-m-d') ."') and stampdutyfirst.amount>0 GROUP BY date ORDER BY date";
$stamp2 = mysql_query($query_stamp2, $revenuecon) or die(mysql_error());
$row_stamp2 = mysql_fetch_assoc($stamp2);
$totalRows_stamp2 = mysql_num_rows($stamp2);

$serialno=0;
$total=0;

$selectedyear=date('Y',strtotime($_GET['reportdate']));
$selectedmonth=date('m',strtotime($_GET['reportdate']));
$startdate= new DateTime;
$startdate->setDate($selectedyear, $selectedmonth, 1);
$enddate= new DateTime;
if ($selectedmonth<12)
$enddate->setDate($selectedyear, $selectedmonth+1, 1);

else
$enddate->setDate($selectedyear+1, 1, 1);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<h3>COLLECTION OF STAMP DUTY</h3>
<h4>MONTH OF <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h4>
<p><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a></p>
<table id="myTable" class="hovertable">
  <tr>
    <th scope="col">No</th>
    <th scope="col">Payment Date</th>
    <th scope="col">Amount</th>
  </tr>
  <?php 
  //for the previous dates monthly summary
  do {
	  $serialno+=1;
	  $total+=$row_stamp['duty']; ?>
    <tr>
      <td><?php echo $serialno; ?></td>
      <td><?php echo date('Y-M',strtotime($row_stamp['date'])); ?></td>
      <td align="right"><?php echo number_format($row_stamp['duty'],2,'.',','); ?></td>
    </tr>
    <?php } while ($row_stamp = mysql_fetch_assoc($stamp)); ?>
    
     <?php 
	 //for the current month daily summary
	 do {
	  $serialno+=1;
	  $total+=$row_stamp2['duty']; ?>
    <tr>
      <td><?php echo $serialno; ?></td>
      <td><?php echo $row_stamp2['date']; ?></td>
      <td align="right"><?php echo number_format($row_stamp2['duty'],2,'.',','); ?></td>
    </tr>
    <?php } while ($row_stamp2 = mysql_fetch_assoc($stamp2)); ?>
<tr>
    <td>&nbsp;</td>
    <td><b>Total</b></td>
    <td align="right"><b><?php echo number_format($total,2,'.',','); ?></b></td>
  </tr>
</table>
<p>&nbsp;</p>
<p>Checked By :-----------------------</p>
<p>&nbsp;</p>
<p>Deputy Commissioner :---------------------------</p>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($stamp);
?>
