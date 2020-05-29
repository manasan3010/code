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

mysql_select_db($database_revenuecon, $revenuecon);
$query_loyers = "SELECT * FROM loyers1";
$loyers = mysql_query($query_loyers, $revenuecon) or die(mysql_error());
$row_loyers = mysql_fetch_assoc($loyers);
$totalRows_loyers = mysql_num_rows($loyers);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
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
</script>

</head>

<body>
<h1>List of Attorny at Law</h1>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<table id="myTable" width="731" border="1" class="hovertable">
<tr>
 <td><input type="text" id="myInput0" onkeyup="myFunction(0)" size="5"/></td>
    <td><input type="text" id="myInput1" onkeyup="myFunction(1)" size="5"/></td>
    <td><input type="text" id="myInput2" onkeyup="myFunction(2)" size="5"/></td>
    <td><input type="text" id="myInput3" onkeyup="myFunction(3)" size="5"/></td>
    <td><input type="text" id="myInput4" onkeyup="myFunction(4)" size="5"/></td>
    <td>Edit</td>
    
</tr>
  <tr>
    <th width="97" scope="col">ID</th>
    <th width="173" scope="col">Name</th>
    <th width="206" scope="col">Address</th>
    <th width="95" scope="col">TP</th>
    <th width="60" scope="col">Reg No</th>
    <th width="60" scope="col">&nbsp;</th>
  </tr>
  <?php do { ?>
  <tr>
    <td><?php echo $row_loyers['id']; ?></td>
    <td><?php echo $row_loyers['loyername']; ?></td>
    <td><?php echo $row_loyers['address']; ?></td>
    <td><?php echo $row_loyers['tp']; ?></td>
    <td><?php echo $row_loyers['regNo']; ?></td>
    <td><a href="editloyer.php?id=<?php echo $row_loyers['id']; ?>"><img src="edit_icon.jpg" width="25" height="25" /></a></td>
  </tr>
  <?php } while ($row_loyers = mysql_fetch_assoc($loyers)); ?>
</table>

</body>
</html>
<?php
mysql_free_result($loyers);
?>
