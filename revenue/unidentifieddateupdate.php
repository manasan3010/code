<?php require_once('Connections/revenuecon.php'); 
mysql_select_db($database_revenuecon, $revenuecon);
$query_Recordset1 = "SELECT id, deedno, amount, localauthorityid, dataentrydate, loidentifieddate FROM stampdutyfirst WHERE isnull(loidentifieddate) and localauthorityid>0 and localauthorityid<35 and dataentrydate<'2017-09-05'";
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
<table width="auto" border="1">
  <tr>
    <th scope="col">id</th>
    <th scope="col">Deed No</th>
    <th scope="col">Amount</th>
    <th scope="col">Local Authority</th>
    <th scope="col">Data Entry Date</th>
    <th scope="col">LA Identified Date</th>
  </tr>
  <?php do { ?>
    <tr>
      <td><?php echo $row_Recordset1['id']; ?></td>
      <td><?php echo $row_Recordset1['deedno']; ?></td>
      <td><?php echo $row_Recordset1['amount']; ?></td>
      <td><?php echo $row_Recordset1['localauthorityid']; ?></td>
      <td><?php echo $row_Recordset1['dataentrydate']; ?></td>
      <td><?php echo $row_Recordset1['loidentifieddate']; ?></td>
    </tr>
    <?php } while ($row_Recordset1 = mysql_fetch_assoc($Recordset1)); ?>
</table>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
