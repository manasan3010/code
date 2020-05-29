<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentry,dataentrydown";
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
$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name FROM stampdutyfirst, loyers1, localauthorities WHERE stampdutyfirst.dataentrydate >= date('" . $startdate->format('Y-m-d') ."') and stampdutyfirst.dataentrydate < date('" . $enddate->format('Y-m-d') . "') and stampdutyfirst.localauthorityid=localauthorities.id and stampdutyfirst.notaryid=loyers1.id order by stampdutyfirst.id" ;
$stampdutyfirst = mysql_query($query_stampdutyfirst, $revenuecon) or die(mysql_error());
$row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst);
$totalRows_stampdutyfirst = mysql_num_rows($stampdutyfirst);
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
<h1>Stamp Duty Summary <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h1>
<a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>
<div style="overflow:auto; height:600px; width:1100px;" >
<table id="myTable" width="auto" border="1" class="hovertable">
<thead >
  <tr>
    <td><input type="text" id="myInput0" onkeyup="myFunction(0)" size="5"/></td>
    <td><input type="text" id="myInput1" onkeyup="myFunction(1)" size="5"/></td>
    <td>From<input type="date" id="myInputfrom2" onchange="myFunctionfromto(2)" placeholder="Date From" size="5"/><br />To
    <input type="date" id="myInputto2" onchange="myFunctionfromto(2)" placeholder="Date To"size="5"/></td>
    
    <td><input type="text" id="myInput3" onkeyup="myFunction(3)" size="5"/></td>
    <td><input type="text" id="myInput4" onkeyup="myFunction(4)" size="5"/></td>
    <td><input type="text" id="myInput5" onkeyup="myFunction(5)" size="5"/></td>
    <td><input type="text" id="myInput6" onkeyup="myFunction(6)" size="5"/></td>
    <td><input type="text" id="myInput7" onkeyup="myFunction(7)" size="5"/></td>
    <td><input type="text" id="myInput8" onkeyup="myFunction(8)" size="5"/></td>
    <td><input type="text" id="myInput9" onkeyup="myFunction(9)" size="5"/></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>- </td>
    <td><input type="text" id="myInput15" onkeyup="myFunction(15)" size="5"/></td>
    <td><input type="text" id="myInput16" onkeyup="myFunction(16)" size="5"/></td>
    <td><input type="text" id="myInput17" onkeyup="myFunction(17)" size="5"/></td>
    <td><input type="text" id="myInput18" onkeyup="myFunction(18)" size="5"/></td>
    <td><input type="text" id="myInput19" onkeyup="myFunction(19)" size="5"/></td>
    <td><input type="text" id="myInput20" onkeyup="myFunction(20)" size="5"/></td>
    <td>From<input type="date" id="myInputfrom21" onchange="myFunctionfromto(21)" placeholder="Date From" size="5"/><br />To
    <input type="date" id="myInputto21" onchange="myFunctionfromto(21)" placeholder="Date To"size="5"/></td>
    
    
  </tr>
    </thead>
  <tr>
    <th scope="col">ID</th>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
    <th scope="col">Grantor Name</th>
    <th scope="col">Address</th>
    <th scope="col">Grantee Name</th>
    <th scope="col">Address</th>
    <th scope="col">Amount</th>
    <th scope="col">Running Total</th>
    <th scope="col">File No</th>
    <th scope="col">SD103</th>
    <th scope="col">SD104</th>
    <th scope="col">SD105</th>
    <th scope="col">SD116</th>
    <th scope="col">SD150</th>
    <th scope="col">Land District</th>
    <th scope="col">Land GS Division</th>
    <th scope="col">Land Address</th>
    <th scope="col">Notary</th>
    <th scope="col">Local Authority</th>
    <th scope="col">Slip No</th>
    <th scope="col">Payment Date</th>
    
   
  </tr>

  <tbody>
  <?php $runningtotal=0;
  do { $runningtotal+=$row_stampdutyfirst['amount'];
  ?>
  
    <tr>
      <td>
      <a href="updateStampDutyEntry.php?id=<?php echo $row_stampdutyfirst['id']; ?>&reportdate=<?php echo $_GET['reportdate']; ?>"><?php echo $row_stampdutyfirst['id']; ?></a>
       <a href="datasheet.php?id=<?php echo $row_stampdutyfirst['id']; ?>"> <img src="datasheet.jpg" width="20" height="20" alt="datasheet" /></a></td>
      <td><?php echo $row_stampdutyfirst['deedno']; ?></td>
      <td><?php echo $row_stampdutyfirst['deeddate']; ?></td>
      <td><?php echo $row_stampdutyfirst['grantorname']; ?></td>
      <td><?php echo $row_stampdutyfirst['grantoraddress']; ?></td>
      <td><?php echo $row_stampdutyfirst['granteename']; ?></td>
      <td><?php echo $row_stampdutyfirst['granteeaddress']; ?></td>
      <td align='right'><?php echo number_format($row_stampdutyfirst['amount'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($runningtotal,2,'.',','); ?></td>
      <td><a href="bankslip1.php?id=<?php echo $row_stampdutyfirst['id']; ?>" title="Additional Stamp Duty Slip" ><?php echo $row_stampdutyfirst['fileno']; ?></a></td>
       <td>
      <a href="sd103dateupdate.php?fileno=<?php echo $row_stampdutyfirst['fileno']; ?>&amp;address1=<?php echo $row_stampdutyfirst['granteeaddress']; ?>&amp;loyer=<?php echo $row_stampdutyfirst['loyername']; ?>&amp;deeddate=<?php echo $row_stampdutyfirst['deeddate']; ?>&amp;deedno=<?php echo $row_stampdutyfirst['deedno']; ?>&amp;receiver=<?php echo $row_stampdutyfirst['granteename']; ?>">SD103</a>
      
      <a href="sd103dateupdate.php?fileno=<?php echo $row_stampdutyfirst['fileno']; ?>&amp;address1=<?php echo $row_stampdutyfirst['granteeaddress']; ?>&amp;loyer=<?php echo $row_stampdutyfirst['loyername']; ?>&amp;deeddate=<?php echo $row_stampdutyfirst['deeddate']; ?>&amp;deedno=<?php echo $row_stampdutyfirst['deedno']; ?>&amp;receiver=<?php echo $row_stampdutyfirst['granteename']; ?>"></a> <?php echo ' '.$row_stampdutyfirst['sd103date']; ?>
	  
      </td>
      <td><a href="sd104up.php?fileno=<?php echo $row_stampdutyfirst['fileno']; ?>&amp;deeddate=<?php echo $row_stampdutyfirst['deeddate']; ?>&amp;loyer=<?php echo $row_stampdutyfirst['loyername']; ?>&amp;sd103date=<?php echo $row_stampdutyfirst['sd103date']; ?>&amp;address=<?php echo $row_stampdutyfirst['granteeaddress']; ?>&amp;receiver=<?php echo $row_stampdutyfirst['granteename']; ?>&amp;deedno=<?php echo $row_stampdutyfirst['deedno']; ?>">SD104 </a><a href="sd104up.php?fileno=<?php echo $row_stampdutyfirst['fileno']; ?>&amp;address=<?php echo $row_stampdutyfirst['grantoraddress']; ?>&amp;loyer=<?php echo $row_stampdutyfirst['loyername']; ?>&amp;deeddate=<?php echo $row_stampdutyfirst['deeddate']; ?>&amp;deedno=<?php echo $row_stampdutyfirst['deedno']; ?>&amp;receiver=<?php echo $row_stampdutyfirst['granteename']; ?>"></a> <?php echo ' '.$row_stampdutyfirst['sd104date']; ?></td>
      <td> <a href="sd105.php?id=<?php echo $row_stampdutyfirst['id']; ?>">SD105</a>
 <?php echo ' '.$row_stampdutyfirst['sd105date'].' '; ?>     
      </td>
      <td><p><a href="sd116form.php?id=<?php echo $row_stampdutyfirst['id']; ?>">SD116<?php echo ' '.$row_stampdutyfirst['sd116date'].' '; ?></a></p></td>
      <td><a href="sd150form1.php?fileno=<?php echo $row_stampdutyfirst['fileno']; ?>"> SD150</a></td>
      <td><?php echo $row_stampdutyfirst['landdistrict']; ?></td>
      <td><?php echo $row_stampdutyfirst['landvillage']; ?></td>
      <td><?php echo $row_stampdutyfirst['landname']; ?></td>
      <td><?php echo $row_stampdutyfirst['loyername']; ?></td>
      <td><?php echo $row_stampdutyfirst['name']; ?></td>
      <td><?php echo $row_stampdutyfirst['slipno']; ?></td>
      <td><?php echo $row_stampdutyfirst['date']; ?></td>
      
     
    </tr>
    
    <?php } while ($row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst)); ?>
    </tbody>
</table>
</div>

</body>
</html>
<?php
mysql_free_result($stampdutyfirst);
?>