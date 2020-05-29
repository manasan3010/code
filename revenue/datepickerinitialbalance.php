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
<?php
$choice=$_GET['selection'];
switch ($choice) {
    case "41":
        $actionfile="AdditionalStampDutySummary.php";
        break;
    case "42":
        $actionfile="AdditionalStampDutySummaryreport.php";
        break;
	case "46":
        $actionfile="stampdutysummaryupunidentified.php";
        break;
    case "34":
        $actionfile="cashreceiptmonthlysummary.php";
        break;
	case "35":
        $actionfile="stampdutylosumonlyreport.php";
        break;
	case "21":
        $actionfile="stampdutysummaryup.php";
        break;
	case "13":
        $actionfile="stampdailysummaryreport.php";
        break;
	case "43":
        $actionfile="";
        break;
	case "44":
        $actionfile="stampdutysummarynotaryreport.php";
        break;	
	case "14":
        $actionfile="stampdutysummaryreport.php";
        break;	
	case "15":
        $actionfile="stampdutyentrydatesummary.php";
        break;
	case "25":
        $actionfile="additionalstampdutyentrydatesummary.php";
        break;
		case "23":
        $actionfile="stampdutysummarydown.php";
        break;
    default:
        $actionfile="";
}
?>
<form id="form1" name="form1" method="get" action=<?php echo $actionfile; ?>>
  <p>
    <label for="reportdate">Year and Month</label>
    <input type="date" name="reportdate" id="reportdate" value="<?php echo date('Y-m-d'); ?>"/>
  </p>
  <p>Opening Balance 
    <input type="number" name="openingbalance" id="openingbalance" step="0.01" value="0.00"/>
  </p>
   <p>
    <label for="reportdate">Starting Date</label>
    <input type="date" name="datefrom" id="datefrom" value="<?php echo date('Y-m-d'); ?>"/><label for="reportdate">Finished Date</label>
    <input type="date" name="dateto" id="dateto" value="<?php echo date('Y-m-d'); ?>"/>
  </p>
  <p>&nbsp;</p>
  <p>ADR Confirmation Status</p>
  <p>
    <label>
      <input name="AGR_Confirmation" type="radio" id="AGR_Confirmation_0" value="1"  />
    Confirmed</label>
    <br />
    <label>
      <input type="radio" name="AGR_Confirmation" value="0" id="AGR_Confirmation_1" />
      Not Confirmed</label>
       <br />
    <label>
      <input type="radio" name="AGR_Confirmation" value="2" id="AGR_Confirmation_2" checked="checked"/>
      All</label>
    <br />
  </p>
  <p>
    <input type="submit" name="submit" id="submit" value="Go to Report" />
  </p>
</form>
 
<p>&nbsp;</p>
</body>
</html>
