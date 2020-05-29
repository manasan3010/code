<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentrydown";
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
<?php require_once('Connections/revenuecon.php'); 
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
$selectedyear=date('Y',strtotime($_GET['reportdate']));
$selectedmonth=date('m',strtotime($_GET['reportdate']));
$startdate= new DateTime;
$startdate->setDate($selectedyear, $selectedmonth, 1);
$enddate= new DateTime;
if ($selectedmonth<12)
$enddate->setDate($selectedyear, $selectedmonth+1, 1);

else
$enddate->setDate($selectedyear+1, 1, 1);

mysql_select_db($database_revenuecon, $revenuecon);

//$query_Recordset1 = "SELECT * FROM stampduty ORDER BY address3 ASC";
$query_Recordset1 = "SELECT * FROM stampduty where stampduty.date >= date('" . $startdate->format('Y-m-d') ."') and stampduty.date < date('" . $enddate->format('Y-m-d') . "') ORDER BY address3 ASC";


$Recordset1 = mysql_query($query_Recordset1, $revenuecon) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);
 require_once('Connections/revenuecon.php');

$subtotal_duty=0;
$grandtotal_duty=0;
$subtotal_penalty=0;
$grandtotal_penalty=0;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>

<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
<script>
function fnExcelReport()
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('myTable'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"revenue.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}
</script>
</head>

<body>
<?php include("letterheadBW.php"); ?>
<h1>Additional Stamp Duty Summary <?php echo $selectedyear.' - '.date('F',strtotime($_GET['reportdate'])); ?></h1>
<img src="excellogo.jpg" class="hide-from-printer" width="30" height="31" onclick="fnExcelReport();"/><a href="home.php"><img src="homelogo.jpg" class="hide-from-printer" width="35" height="35" alt="Home" /></a>
<div style="overflow:auto;">
<table id="myTable" width="auto" border="1" class="hovertable">

  <tr>
    <th scope="col">ID</th>
    <th scope="col">File No</th>
    <th scope="col">Charge No</th>
    <th scope="col">Name of Payer</th>
    <th scope="col">Address</th>
    <th scope="col">Duty</th>
    <th scope="col">Penalty</th>
    <th scope="col">Total</th>
    <th scope="col">Bank</th>
    <th scope="col">Cheque No</th>
    <th scope="col">Date</th>
    <th scope="col">Slip No</th>
    <th scope="col">&nbsp;</th>
  </tr>
  <?php do { 
  		$subtotal_duty += $row_Recordset1['duty'];
  		$grandtotal_duty += $row_Recordset1['duty'];
		$subtotal_penalty += $row_Recordset1['penalty'];
  		$grandtotal_penalty += $row_Recordset1['penalty'];
  ?>
    <tr>
      <td><?php echo $row_Recordset1['id']; ?></td>
      <td><?php echo $row_Recordset1['fileNo']; ?></td>
      <td><?php echo $row_Recordset1['chargeno']; ?></td>
      <td><?php echo $row_Recordset1['nameofpayer']; ?></td>
      <td><?php echo $row_Recordset1['address1']. ', ' . $row_Recordset1['address2']. ', ' . $row_Recordset1['address3']; ?></td>
      <td align='right'><?php echo number_format($row_Recordset1['duty'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($row_Recordset1['penalty'],2,'.',','); ?></td>
      <td align='right'><?php echo number_format($row_Recordset1['duty']+$row_Recordset1['penalty'],2,'.',','); ?></td>
      <td><?php echo $row_Recordset1['bank']; ?></td>
      <td><?php echo $row_Recordset1['chequeno']; ?></td>
      <td><?php echo $row_Recordset1['date']; ?></td>
      <td><?php echo $row_Recordset1['slipno']; ?></td>
      <td><a href="updateadditionalstampduty.php?id=<?php echo $row_Recordset1['id']; ?>">Edit</a></td>
    </tr>
    
     <?php
      $fetchok=($row_Recordset1next = mysql_fetch_assoc($Recordset1));
	  if ($fetchok)
	  {
		  if ($row_Recordset1next['address3'] != $row_Recordset1['address3']) {
			
			echo "<tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				
				<td><b>" . $row_Recordset1['address3'] . " SUB TOTAL</b></td>
				<td align='right'><b>".number_format($subtotal_duty,2,'.',',')."</b></td>
				<td align='right'><b>".number_format($subtotal_penalty,2,'.',',')."</b></td>
				<td align='right'><b>".number_format($subtotal_duty+$subtotal_penalty,2,'.',',').'</b></td>
			</tr>';
			$subtotal_duty = 0;
			$subtotal_penalty = 0;
		}
	  $row_Recordset1 =$row_Recordset1next ;
	  }
	 } while ($fetchok); ?>
     
     <tr>
			<td></td>
            <td></td>
            <td></td>
            <td></td>
                       
			<td><b><?php echo $row_Recordset1['address3'] ?> SUB TOTAL</b></td>
			<td align='right'><b><?php echo number_format($subtotal_duty,2,'.',','); ?></b> </td>
            <td align='right'><b><?php echo number_format($subtotal_penalty,2,'.',','); ?></b> </td>
            <td align='right'><b><?php echo number_format($subtotal_duty+$subtotal_penalty,2,'.',','); ?></b> </td>
	</tr>
    <tr>
		
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            
			<td><b>GRAND TOTAL</b></td>
            <td align='right'><b><?php echo number_format($grandtotal_duty,2,'.',','); ?> </b></td>
			<td align='right'><b><?php echo number_format($grandtotal_penalty,2,'.',','); ?> </b></td>
            <td align='right'><b><?php echo number_format($grandtotal_duty+$grandtotal_penalty,2,'.',','); ?> </b></td>
	</tr>
</table>
</div>
</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
