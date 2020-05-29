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

$colname_Recordset1 = "-1";
if (isset($_GET['fileno'])) {
  $colname_Recordset1 = $_GET['fileno'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = sprintf("SELECT * FROM stampdutyfirst WHERE fileno = %s", GetSQLValueString($colname_Recordset1, "text"));
$Recordset1 = mysql_query($query_Recordset1, $revenuecon) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<h3>Notice of Assessment - Stamp Duty</h3>
<form id="form1" name="form1" method="POST" action="sd150.php">
  <table width="auto" border="1">
    <tr>
      <th scope="row">Charge No</th>
      <td><input type="text" name="chargeno" id="chargeno" /></td>
    </tr>
    <tr>
      <th scope="row">Market Value</th>
      <td><input name="marketvalue" type="number" id="marketvalue" value="<?php echo $row_Recordset1['marketvalue']; ?>" /></td>
    </tr>
    <tr>
      <th scope="row">Penalty Rate</th>
      <td><input type="number" name="penaltyrate" id="penaltyrate" min="0" max="100" value="10"/></td>
    </tr>
  </table>
  <p>
    <input type="submit" name="submit" id="submit" value="Submit" />
    <input name="fileno" type="hidden" id="fileno" value="<?php echo $_GET['fileno']; ?>" />
  </p>
</form>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
