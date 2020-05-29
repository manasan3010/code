<?php require_once('Connections/revenuecon.php'); ?>
<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentrydown";
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
$query_Recordset1 = "SELECT * FROM stampduty where stampduty.date >= date('" . $startdate->format('Y-m-d') ."') and stampduty.date < date('" . $enddate->format('Y-m-d') . "') ORDER BY address3 ASC";

$Recordset1 = mysql_query($query_Recordset1, $revenuecon) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);
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
function myFunctionfromto(j) {
  // Declare variables 
  var inputfrom, inputto, filterfrom, filterto, table, tr, td, i, tddate;
  inputfrom = document.getElementById("myInputfrom" + j);
  filterfrom = inputfrom.value;
   inputto = document.getElementById("myInputto" + j);
  filterto = inputto.value;
  if (filterto.toString().length==0) filterto="2500-01-01";
   table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 2; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[j];
    if (td) {
		tddate=td.innerHTML;
      if ((tddate >= filterfrom) && (tddate <= filterto)) {
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
<h1>Additional Stamp Duty Summary <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h1>
<a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>
<div style="overflow:auto;">
<table id='myTable' width="auto" border="1" class="hovertable">
<tr>
 	 <td><input type="text" id="myInput0" onkeyup="myFunction(0)" size="5"/></td>
    <td><input type="text" id="myInput1" onkeyup="myFunction(1)" size="5"/></td>
    <td><input type="text" id="myInput2" onkeyup="myFunction(2)" size="5"/></td>
    <td><input type="text" id="myInput3" onkeyup="myFunction(3)" size="5"/></td>
    <td><input type="text" id="myInput4" onkeyup="myFunction(4)" size="5"/></td>
    <td><input type="text" id="myInput5" onkeyup="myFunction(5)" size="5"/></td>
    <td><input type="text" id="myInput6" onkeyup="myFunction(6)" size="5"/></td>
    <td><input type="text" id="myInput7" onkeyup="myFunction(7)" size="5"/></td>
    <td><input type="text" id="myInput8" onkeyup="myFunction(8)" size="5"/></td>
    <td><input type="text" id="myInput9" onkeyup="myFunction(9)" size="5"/></td>
    <td align='right'>From<input type="date" id="myInputfrom10" onchange="myFunctionfromto(10)" placeholder="Date From" size="5"/><br />To
    <input type="date" id="myInputto10" onchange="myFunctionfromto(10)" placeholder="Date To"size="5"/></td>
    <td><input type="text" id="myInput11" onkeyup="myFunction(11)" size="5"/></td>
    <td>Edit</td>
    
</tr>
  <tr>
    <th scope="col">ID</th>
    <th scope="col">File No</th>
    <th scope="col">Charge No</th>
    <th scope="col">Name of Payer</th>
    <th scope="col">Address</th>
    <th scope="col">Duty</th>
    <th scope="col">Penalty</th>
    <th scope="col">Total</th>
    <th scope="col">Bank</th>
    <th scope="col">Cheque No</th>
    <th scope="col">Date</th>
    <th scope="col">Slip No</th>
    <th scope="col">&nbsp;</th>
  </tr>
  <?php do { ?>
    <tr>
      <td><?php echo $row_Recordset1['id']; ?></td>
      <td><?php echo $row_Recordset1['fileNo']; ?></td>
      <td><?php echo $row_Recordset1['chargeno']; ?></td>
      <td><?php echo $row_Recordset1['nameofpayer']; ?></td>
      <td><?php echo $row_Recordset1['address1']; ?><br /><?php echo $row_Recordset1['address2']; ?><br /><?php echo $row_Recordset1['address3']; ?><br /></td>
      <td align='right'><?php echo number_format($row_Recordset1['duty'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($row_Recordset1['penalty'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($row_Recordset1['duty']+$row_Recordset1['penalty'],2,'.',','); ?></td>
      <td><?php echo $row_Recordset1['bank']; ?></td>
      <td><?php echo $row_Recordset1['chequeno']; ?></td>
      <td><?php echo $row_Recordset1['date']; ?></td>
      <td><?php echo $row_Recordset1['slipno']; ?></td>
      <td><a href="updateadditionalstampduty.php?id=<?php echo $row_Recordset1['id']; ?>"><img src="edit_icon.jpg" width="35" height="35" alt="Edit" /></a></td>
    </tr>
    <?php } while ($row_Recordset1 = mysql_fetch_assoc($Recordset1)); ?>
</table>
</div>

</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
