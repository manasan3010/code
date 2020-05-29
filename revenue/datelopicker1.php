<?php require_once('Connections/revenuecon.php'); 

if (!isset($_SESSION)) {
  session_start();
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

$query_localauthority = "SELECT * FROM localauthorities ORDER BY id ASC";
if ($_SESSION['MM_UserID']>0 && $_SESSION['MM_UserID']<35)
$query_localauthority = "SELECT * FROM localauthorities where id=" . $_SESSION['MM_UserID']  . " ORDER BY id ASC";
$localauthority = mysql_query($query_localauthority, $revenuecon) or die(mysql_error());
$row_localauthority = mysql_fetch_assoc($localauthority);
$totalRows_localauthority = mysql_num_rows($localauthority);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<h3>Select the month of your Report
</h3>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>

<form id="form1" name="form1" method="get" action="stampdutymonthlybookps.php">
  <p>
    <label for="reportdate">Year and Month</label>
    <input type="date" name="reportdate" id="reportdate" value="<?php echo date('Y-m-d'); ?>"/>
  </p>
  <p>
    <label for="reportdate2">Starting Date</label>
    <input type="date" name="datefrom" id="datefrom" value="<?php echo date('Y-m-d'); ?>"/>
    <label for="reportdate2">Finished Date</label>
    <input type="date" name="dateto" id="dateto" value="<?php echo date('Y-m-d'); ?>"/>
  </p>
  <p>Local Authority 
    <select name="loid" id="loid">
      <?php
do {  
?>
      <option value="<?php echo $row_localauthority['id']?>"><?php echo $row_localauthority['name']?></option>
      <?php
} while ($row_localauthority = mysql_fetch_assoc($localauthority));
  $rows = mysql_num_rows($localauthority);
  if($rows > 0) {
      mysql_data_seek($localauthority, 0);
	  $row_localauthority = mysql_fetch_assoc($localauthority);
  }
?>
    </select>
  </p>
  <p>ADR Confirmation Status</p>
  <p>
    <label>
      <input name="AGR_Confirmation" type="radio" id="AGR_Confirmation_0" value="1" />
      Confirmed</label>
    <br />
    <label>
      <input type="radio" name="AGR_Confirmation" value="0" id="AGR_Confirmation_1" />
      Not Confirmed</label>
       <br />
    <label>
      <input type="radio" name="AGR_Confirmation" value="2" id="AGR_Confirmation_2" checked="checked"/>
      All</label>
  </p>
  <p>
    <input type="submit" name="submit" id="submit" value="Go to Report" />
  </p>
</form>
 
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($localauthority);
?>
