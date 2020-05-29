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

$recordid_Recordset1 = "0";
if (isset($_GET['id'])) {
  $recordid_Recordset1 = $_GET['id'];
}
mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = sprintf("SELECT * FROM stampdutyfirst, loyers1, localauthorities WHERE stampdutyfirst.notaryid=loyers1.id and stampdutyfirst.localauthorityid=localauthorities.id and stampdutyfirst.id=%s", GetSQLValueString($recordid_Recordset1, "int"));
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
<h3>Data Sheet</h3>
<p><a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a></p>
<table width="100%" border="1">
  <tr>
    <td width="33%">File No</td>
    <td width="67%"><?php echo $row_Recordset1['fileno']; ?></td>
  </tr>
  <tr>
    <td>Date of Commence of Audit</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Name &amp; Address of Grantee</td>
    <td><?php echo $row_Recordset1['granteename']; ?>, <?php echo $row_Recordset1['granteeaddress']; ?></td>
  </tr>
  <tr>
    <td>NIC No. of Grantee</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Deed No.</td>
    <td><?php echo $row_Recordset1['deedno']; ?></td>
  </tr>
  <tr>
    <td>Deed Date</td>
    <td><?php echo $row_Recordset1['deeddate']; ?></td>
  </tr>
  <tr>
    <td>Nature of Instrument</td>
    <td><?php echo $row_Recordset1['nature']; ?></td>
  </tr>
  <tr>
    <td>Name of Notary</td>
    <td><?php echo $row_Recordset1['loyername']; ?></td>
  </tr>
  <tr>
    <td>Name &amp; Address of Grantor</td>
    <td><?php echo $row_Recordset1['grantorname']; ?>, <?php echo $row_Recordset1['grantoraddress']; ?></td>
  </tr>
  <tr>
    <td>District of Registration</td>
    <td><?php echo $row_Recordset1['district_council']; ?></td>
  </tr>
  <tr>
    <td>Address of Land</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>GS Division</td>
    <td><?php echo $row_Recordset1['gndivisionno']. ' ' .$row_Recordset1['landvillage']; ?></td>
  </tr>
  <tr>
    <td>Local Authority</td>
    <td><?php echo $row_Recordset1['name']; ?></td>
  </tr>
  <tr>
    <td>Extent of Land</td>
    <td><?php echo $row_Recordset1['extend']; ?></td>
  </tr>
  <tr>
    <td>Consideration</td>
    <td><?php echo $row_Recordset1['consideration']; ?></td>
  </tr>
  <tr>
    <td>Stamp Duty Paid</td>
    <td><?php echo number_format($row_Recordset1['amount'],2,'.',','); ?></td>
  </tr>
  <tr>
    <td>Deposit Date</td>
    <td><?php echo $row_Recordset1['date']; ?></td>
  </tr>
  <tr>
    <td>Additional Stamp Duty Collected</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Date of Completed of Audit</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Telephone No.</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Remarks</td>
    <td>&nbsp;</td>
  </tr>
</table>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
