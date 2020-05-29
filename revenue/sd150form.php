<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<h3>Notice of Assessment - Stamp Duty</h3>
<form id="form1" name="form1" method="post" action="sd150.php">
  <table width="auto" border="1">
    <tr>
      <th scope="row">Charge No</th>
      <td><input type="text" name="chargeno" id="chargeno" /></td>
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