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

$editFormAction = $_SERVER['PHP_SELF'];
if (isset($_SERVER['QUERY_STRING'])) {
  $editFormAction .= "?" . htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_POST["MM_update"])) && ($_POST["MM_update"] == "form1")) {
  $updateSQL = sprintf("UPDATE stampdutyfirst SET sd116date=%s, tpdate=%s, marketdate=%s, marketvalue=%s, objectiondate=%s WHERE id=%s",
                       GetSQLValueString($_POST['sd116date'], "date"),
                       GetSQLValueString($_POST['tpdate'], "date"),
                       GetSQLValueString($_POST['marketdate'], "date"),
                       GetSQLValueString($_POST['marketvalue'], "double"),
                       GetSQLValueString($_POST['objectiondate'], "date"),
                       GetSQLValueString($_POST['id'], "int"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());

  $updateGoTo = "sd116.php";
  if (isset($_SERVER['QUERY_STRING'])) {
    $updateGoTo .= (strpos($updateGoTo, '?')) ? "&" : "?";
    $updateGoTo .= $_SERVER['QUERY_STRING'];
  }
  header(sprintf("Location: %s", $updateGoTo));
}

$colname_duty = "0";
if (isset($_GET['id'])) {
  $colname_duty = $_GET['id'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_duty = sprintf("SELECT stampdutyfirst.*, loyers1.loyername FROM stampdutyfirst, loyers1 WHERE stampdutyfirst.id = %s AND stampdutyfirst.notaryid=loyers1.id", GetSQLValueString($colname_duty, "int"));
$duty = mysql_query($query_duty, $revenuecon) or die(mysql_error());
$row_duty = mysql_fetch_assoc($duty);
$totalRows_duty = mysql_num_rows($duty);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<h3>SD116 Form</h3>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
  <table width="auto" border="0">
    <tr>
      <th scope="row">id</th>
      <td><input name="id" type="text" id="id" value="<?php echo $row_duty['id']; ?>" readonly="readonly" /></td>
    </tr>
    <tr>
      <th scope="row">File No</th>
      <td><?php echo $row_duty['fileno']; ?></td>
    </tr>
    <tr>
      <th scope="row">Name</th>
      <td><?php echo $row_duty['granteename']; ?></td>
    </tr>
    <tr>
      <th scope="row">Address 123</th>
      <td><?php echo $row_duty['granteeaddress']; ?></td>
    </tr>
    <tr>
      <th scope="row">Notary</th>
      <td><?php echo $row_duty['loyername']; ?></td>
    </tr>
    <tr>
      <th scope="row">Deed No</th>
      <td><?php echo $row_duty['deedno']; ?></td>
    </tr>
    <tr>
      <th scope="row">Deed Date</th>
      <td><?php echo $row_duty['deeddate']; ?></td>
    </tr>
    <tr>
      <th scope="row">Letter Dates</th>
      <td><?php echo $row_duty['sd103date'].' ' . $row_duty['sd104date'].' ' . $row_duty['sd105date']; ?></td>
    </tr>
    <tr>
      <th scope="row">TP Date</th>
      <td><input type="date" name="tpdate" id="tpdate" required='required'/></td>
    </tr>
    <tr>
      <th scope="row">Evaluated Date</th>
      <td><input type="date" name="marketdate" id="marketdate" required='required' /></td>
    </tr>
    <tr>
      <th scope="row">Market Value</th>
      <td><input type="number" name="marketvalue" id="marketvalue" required='required'/></td>
    </tr>
    <tr>
      <th scope="row">Stamp Duty based on MV</th>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <th scope="row">Stamp Duty Paid</th>
      <td><?php echo $row_duty['amount']; ?></td>
    </tr>
    <tr>
      <th scope="row">Objection Date</th>
      <td><input type="date" name="objectiondate" id="textfield5" required='required'/></td>
      
    </tr>
    <tr>
      <th scope="row">System Date</th>
      <td><input type="text" name="sd116date" id="sd116date" value="<?php echo date('Y-m-d'); ?>" readonly="readonly"/></td>
      
    </tr>
  </table>
  <p>
    <input type="submit" name="submit" id="submit" value="Submit" />
  </p>
  <input type="hidden" name="MM_update" value="form1" />
</form>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($duty);
?>
