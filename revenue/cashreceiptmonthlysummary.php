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
$query_cash = "SELECT * FROM cashreceipt where cashreceipt.date >= date('" . $startdate->format('Y-m-d') ."') and cashreceipt.date < date('" . $enddate->format('Y-m-d') . "')";
$cash = mysql_query($query_cash, $revenuecon) or die(mysql_error());
$row_cash = mysql_fetch_assoc($cash);
$totalRows_cash = mysql_num_rows($cash);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<script>
function myFunction(j) {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput" + j);
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 2; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[j];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}
function myDateFunction(j) {
  // Declare variables 
  var input, filter, table, tr, td, i, currentyear;
  input = document.getElementById("myInput" + j);
  alert(input.getYear());
  currentyear= input.getYear();
  currentmonth= input.getMonth();
  //filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 2; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[j];
    if (td) {
		
		alert(td.getMonth());
      if ((td.getMonth()==currentmonth) &&  (td.getMonth()==currentmonth)){
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}
</script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<?php include("letterheadBW.php"); ?>
    <h1>Cash Receipt Summary <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h1>
    <a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>
    
<table  id="myTable" class="hovertable">
  <tr>
    <td>&nbsp;</td>
    <td><input type="date" id="myInput1" onchange="myDateFunction(1)" placeholder="Search for date.." /></td>
    <td><input type="text" id="myInput2" onkeyup="myFunction(2)" placeholder="Search for names.." /></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td><input type="text" id="myInput4" onkeyup="myFunction(4)" placeholder="Search for reason.." /></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <th>Receipt ID</th>
    <th>Date</th>
    <th>Reserved From</th>
    <th>Stamp Duty</th>
    <th>Penalty</th>
    <th>Total</th>
    <th>Reason</th>
    <th>&nbsp;</th>
  </tr>
  <?php do { ?>
    <tr>
      <td><?php echo $row_cash['receiptID']; ?></td>
      <td><?php echo $row_cash['date']; ?></td>
      <td><?php echo $row_cash['Reservedfrom']; ?></td>
      <td align='right'><?php echo number_format($row_cash['duty'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($row_cash['penalty'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($row_cash['amount'],2,'.',','); ?></td>
      <td><?php echo $row_cash['reason']; ?></td>
      <td><a href="updatecashreceipt.php?receiptID=<?php echo $row_cash['receiptID']; ?>"><img src="edit_icon.jpg" width="25" height="25" /></a></td>
    </tr>
    <?php } while ($row_cash = mysql_fetch_assoc($cash)); ?>
</table>

</body>
</html>
<?php
mysql_free_result($cash);
?>
