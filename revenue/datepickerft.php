<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<h3>Select the date range of your Report
</h3>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>
<form id="form1" name="form1" method="get" action="notarynameupdate.php">
  <p>
    <label for="startdate">Start Date</label>
    <input type="date" name="startdate" id="startdate" value="<?php echo date('Y-m-d'); ?>"/>
  End Date 
  <input type="date" name="enddate" id="enddate" value="<?php echo date('Y-m-d'); ?>"/>
  </p>
  <p>
    <input type="submit" name="submit" id="submit" value="Go to Report" />
  </p>
</form>
<p>&nbsp;</p>
</body>
</html>
