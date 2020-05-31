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

mysql_select_db($database_revenuecon, $revenuecon);
$query_cash = "SELECT * FROM cashreceipt";
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
<p>
  Search</p>
<p>&nbsp;</p>
<table  id="myTable" class="hovertable">
  <tr>
    <td>&nbsp;</td>
    <td>From<input type="date" id="myInputfrom1" onchange="myFunctionfromto(1)" placeholder="Date From" /><br />To
    <input type="date" id="myInputto1" onchange="myFunctionfromto(1)" placeholder="Date To" />
    </td>
    <td><input type="text" id="myInput2" onkeyup="myFunction(2)" placeholder="Search for names.." /></td>
    <td>&nbsp;</td>
    <td><input type="text" id="myInput4" onkeyup="myFunction(4)" placeholder="Search for reason.." /></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <th>receiptID</th>
    <th>date</th>
    <th>Reservedfrom</th>
    <th>amount</th>
    <th>reason</th>
    <th>amountword</th>
  </tr>
  <?php do { ?>
    <tr>
      <td><?php echo $row_cash['receiptID']; ?></td>
      <td><?php echo $row_cash['date']; ?></td>
      <td><?php echo $row_cash['Reservedfrom']; ?></td>
      <td><?php echo $row_cash['amount']; ?></td>
      <td><?php echo $row_cash['reason']; ?></td>
      <td><?php echo $row_cash['amountword']; ?></td>
    </tr>
    <?php } while ($row_cash = mysql_fetch_assoc($cash)); ?>
</table>
<a href="home.php" class= button>Home</a>
</body>
</html>
<?php
mysql_free_result($cash);
?>
