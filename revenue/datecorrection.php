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
  $updateSQL = sprintf("UPDATE stampdutyfirst SET deedno=%s, deeddate=%s, grantorname=%s, grantoraddress=%s, granteename=%s, granteeaddress=%s, amount=%s, landdistrict=%s, landvillage=%s, landname=%s, notaryid=%s, localauthorityid=%s, slipno=%s, `date`=%s, sd103date=%s, sd104date=%s, sd105date=%s, sd116date=%s, sd150date=%s, tpdate=%s, marketdate=%s, marketvalue=%s, objectiondate=%s, fileno=%s, dataentrydate=%s, nature=%s, updateok=%s, loidentifieddate=%s, consideration=%s, extend=%s, gndivisionno=%s WHERE id=%s",
                       GetSQLValueString($_POST['deedno'], "text"),
                       GetSQLValueString($_POST['deeddate'], "date"),
                       GetSQLValueString($_POST['grantorname'], "text"),
                       GetSQLValueString($_POST['grantoraddress'], "text"),
                       GetSQLValueString($_POST['granteename'], "text"),
                       GetSQLValueString($_POST['granteeaddress'], "text"),
                       GetSQLValueString($_POST['amount'], "double"),
                       GetSQLValueString($_POST['landdistrict'], "text"),
                       GetSQLValueString($_POST['landvillage'], "text"),
                       GetSQLValueString($_POST['landname'], "text"),
                       GetSQLValueString($_POST['notaryid'], "int"),
                       GetSQLValueString($_POST['localauthorityid'], "int"),
                       GetSQLValueString($_POST['slipno'], "int"),
                       GetSQLValueString($_POST['date'], "date"),
                       GetSQLValueString($_POST['sd103date'], "date"),
                       GetSQLValueString($_POST['sd104date'], "date"),
                       GetSQLValueString($_POST['sd105date'], "date"),
                       GetSQLValueString($_POST['sd116date'], "date"),
                       GetSQLValueString($_POST['sd150date'], "date"),
                       GetSQLValueString($_POST['tpdate'], "date"),
                       GetSQLValueString($_POST['marketdate'], "date"),
                       GetSQLValueString($_POST['marketvalue'], "double"),
                       GetSQLValueString($_POST['objectiondate'], "date"),
                       GetSQLValueString($_POST['fileno'], "text"),
                       GetSQLValueString($_POST['dataentrydate'], "date"),
                       GetSQLValueString($_POST['nature'], "text"),
                       GetSQLValueString($_POST['updateok'], "int"),
                       GetSQLValueString($_POST['loidentifieddate'], "date"),
                       GetSQLValueString($_POST['consideration'], "double"),
                       GetSQLValueString($_POST['extend'], "text"),
                       GetSQLValueString($_POST['gndivisionno'], "text"),
                       GetSQLValueString($_POST['id'], "int"));

  mysql_select_db($database_revenuecon, $revenuecon);
  $Result1 = mysql_query($updateSQL, $revenuecon) or die(mysql_error());
}

mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = "SELECT id, amount, dataentrydate FROM stampdutyfirst WHERE id = 29521";
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
<form action="<?php echo $editFormAction; ?>" method="post" name="form1" id="form1">
  <table align="center">
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Id:</td>
      <td><?php echo $row_Recordset1['id']; ?></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Deedno:</td>
      <td><input type="text" name="deedno" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Deeddate:</td>
      <td><input type="text" name="deeddate" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Grantorname:</td>
      <td><input type="text" name="grantorname" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Grantoraddress:</td>
      <td><input type="text" name="grantoraddress" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Granteename:</td>
      <td><input type="text" name="granteename" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Granteeaddress:</td>
      <td><input type="text" name="granteeaddress" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Amount:</td>
      <td><input type="text" name="amount" value="<?php echo htmlentities($row_Recordset1['amount'], ENT_COMPAT, 'utf-8'); ?>" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Landdistrict:</td>
      <td><input type="text" name="landdistrict" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Landvillage:</td>
      <td><input type="text" name="landvillage" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Landname:</td>
      <td><input type="text" name="landname" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Notaryid:</td>
      <td><input type="text" name="notaryid" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Localauthorityid:</td>
      <td><input type="text" name="localauthorityid" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Slipno:</td>
      <td><input type="text" name="slipno" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Date:</td>
      <td><input type="text" name="date" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Sd103date:</td>
      <td><input type="text" name="sd103date" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Sd104date:</td>
      <td><input type="text" name="sd104date" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Sd105date:</td>
      <td><input type="text" name="sd105date" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Sd116date:</td>
      <td><input type="text" name="sd116date" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Sd150date:</td>
      <td><input type="text" name="sd150date" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Tpdate:</td>
      <td><input type="text" name="tpdate" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Marketdate:</td>
      <td><input type="text" name="marketdate" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Marketvalue:</td>
      <td><input type="text" name="marketvalue" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Objectiondate:</td>
      <td><input type="text" name="objectiondate" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Fileno:</td>
      <td><input type="text" name="fileno" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Dataentrydate:</td>
      <td><input type="date" name="dataentrydate" value="<?php echo htmlentities($row_Recordset1['dataentrydate'], ENT_COMPAT, 'utf-8'); ?>" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Nature:</td>
      <td><input type="text" name="nature" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Updateok:</td>
      <td><input type="text" name="updateok" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Loidentifieddate:</td>
      <td><input type="text" name="loidentifieddate" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Consideration:</td>
      <td><input type="text" name="consideration" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Extend:</td>
      <td><input type="text" name="extend" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">Gndivisionno:</td>
      <td><input type="text" name="gndivisionno" value="" size="32" /></td>
    </tr>
    <tr valign="baseline">
      <td nowrap="nowrap" align="right">&nbsp;</td>
      <td><input type="submit" value="Update record" /></td>
    </tr>
  </table>
  <input type="hidden" name="MM_update" value="form1" />
  <input type="hidden" name="id" value="<?php echo $row_Recordset1['id']; ?>" />
</form>
<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
