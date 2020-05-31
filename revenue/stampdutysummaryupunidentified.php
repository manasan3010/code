<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataupdate,dataentry";
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
$query_stampdutyfirst = "SELECT stampdutyfirst.*,  loyers1.loyername, localauthorities.name 
FROM stampdutyfirst, loyers1, localauthorities 
WHERE (stampdutyfirst.localauthorityid=0 or stampdutyfirst.localauthorityid=35) and
stampdutyfirst.dataentrydate >= date('" . $startdate->format('Y-m-d') ."') and 
stampdutyfirst.dataentrydate < date('" . $enddate->format('Y-m-d') . "') and 
stampdutyfirst.localauthorityid=localauthorities.id and 
stampdutyfirst.notaryid=loyers1.id 
order by stampdutyfirst.id" ;
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
<script>
var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name, filename) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

            document.getElementById("dlink").href = uri + base64(format(template, ctx));
            document.getElementById("dlink").download = filename;
            document.getElementById("dlink").click();

        }
    })()
</script>
</head>

<body>
<h1>Stamp Duty Summary <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h1>
<?php 
	$runningtotal=0;
	$runningtotal=$_GET['openingbalance']; 
	?>
<a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a><a id="dlink"  style="display:none;"></a><img src="excellogo.jpg" class="hide-from-printer" alt="Export to Excel" width="30" height="31" onclick="tableToExcel('myTable', 'name', 'myfile.xls')"/>
<div style="overflow:auto;">
  <table id="myTable"  border="1" class="hovertable">
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
    
    <td>From<input type="date" id="myInputfrom8" onchange="myFunctionfromto(8)" placeholder="Date From" size="5"/><br />To
    <input type="date" id="myInputto8" onchange="myFunctionfromto(8)" placeholder="Date To"size="5"/></td>
    
    
  </tr>
  <tr>
    <th scope="col">ID</th>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
   
    <th scope="col">Amount</th>
    <th scope="col">Running Total<br /><?php echo number_format($runningtotal,2,'.',','); ?></th>
    <th scope="col">Land District</th>
   
    <th scope="col">Notary</th>
    <th scope="col">Local Authority</th>
    
    <th scope="col">Date</th>
    
    
  </tr>
  <?php 
  do { $runningtotal+=$row_stampdutyfirst['amount'];
  ?>
  
    <tr>
      <td>
      <a href="updateStampDutyEntry.php?id=<?php echo $row_stampdutyfirst['id']; ?>&reportdate=<?php echo $_GET['reportdate']; ?>"><?php echo $row_stampdutyfirst['id']; ?></a>
       <a href="datasheet.php?id=<?php echo $row_stampdutyfirst['id']; ?>"> <img src="datasheet.jpg" width="20" height="20" alt="datasheet" /></a></td>
      <td><?php echo $row_stampdutyfirst['deedno']; ?></td>
      <td><?php echo $row_stampdutyfirst['deeddate']; ?></td>
     
      <td align='right'><?php echo number_format($row_stampdutyfirst['amount'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($runningtotal,2,'.',','); ?></td>
      <td><?php echo $row_stampdutyfirst['landdistrict']; ?></td>
   
      <td><?php echo $row_stampdutyfirst['loyername']; ?></td>
      <td><?php echo $row_stampdutyfirst['name']; ?></td>
      
      <td><?php echo $row_stampdutyfirst['date']; ?></td>
      
     
    </tr>
    
    <?php } while ($row_stampdutyfirst = mysql_fetch_assoc($stampdutyfirst)); ?>
</table>
</div>

</body>
</html>
<?php
mysql_free_result($stampdutyfirst);
?>
