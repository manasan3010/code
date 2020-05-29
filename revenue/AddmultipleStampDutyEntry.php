<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "dataentry";
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

$editFormAction = $_SERVER['PHP_SELF'];
if (isset($_SERVER['QUERY_STRING'])) {
  $editFormAction .= "?" . htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_POST["MM_insert"])) && ($_POST["MM_insert"] == "form1")) {

  $recordcount=10;
  $currentrecord=0;
  mysql_select_db($database_revenuecon, $revenuecon);
   do { 
   $currentrecord+=1;
  $insertSQL = sprintf("INSERT INTO stampdutyfirst (deedno, deeddate, grantorname, grantoraddress, granteename, granteeaddress, amount, landdistrict, landvillage, landname, notaryid, localauthorityid, slipno, `date`, dataentrydate, fileno) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                       GetSQLValueString($_POST['deedno'. $currentrecord], "text"),
                       GetSQLValueString($_POST['deeddate'. $currentrecord], "date"),
                       GetSQLValueString($_POST['grantorname'. $currentrecord], "text"),
                       GetSQLValueString($_POST['grantoraddress'. $currentrecord], "text"),
                       GetSQLValueString($_POST['granteename'. $currentrecord], "text"),
                       GetSQLValueString($_POST['granteeaddress'. $currentrecord], "text"),
                       GetSQLValueString($_POST['amount'. $currentrecord], "double"),
                       GetSQLValueString($_POST['landdistrict'. $currentrecord], "text"),
                       GetSQLValueString($_POST['landvillage'. $currentrecord], "text"),
                       GetSQLValueString($_POST['landname'. $currentrecord], "text"),
                       GetSQLValueString($_POST['notaryid'. $currentrecord], "int"),
                       GetSQLValueString($_POST['localauthorityid'. $currentrecord], "int"),
                       GetSQLValueString($_POST['slipno'. $currentrecord], "int"),
                       GetSQLValueString($_POST['date'. $currentrecord], "date"),
					   GetSQLValueString(date('Y-m-d'), "date"),
					    GetSQLValueString($_POST['fileno'. $currentrecord], "text"));
//echo $insertSQL;
  if (strlen($_POST['deedno'. $currentrecord])>0){
  $Result1 = mysql_query($insertSQL, $revenuecon) or die(mysql_error());
  }
 } while ($currentrecord<=$recordcount);   
  

  $insertGoTo = "home.html";
  if (isset($_SERVER['QUERY_STRING'])) {
    $insertGoTo .= (strpos($insertGoTo, '?')) ? "&" : "?";
    $insertGoTo .= $_SERVER['QUERY_STRING'];
  }
 // header(sprintf("Location: %s", $insertGoTo));
}

mysql_select_db($database_revenuecon, $revenuecon);
$query_districts = "SELECT * FROM districtlist ORDER BY district ASC";
$districts = mysql_query($query_districts, $revenuecon) or die(mysql_error());
$row_districts = mysql_fetch_assoc($districts);
$totalRows_districts = mysql_num_rows($districts);

mysql_select_db($database_revenuecon, $revenuecon);
$query_loyer = "SELECT * FROM loyers1";
$loyer = mysql_query($query_loyer, $revenuecon) or die(mysql_error());
$row_loyer = mysql_fetch_assoc($loyer);
$totalRows_loyer = mysql_num_rows($loyer);

mysql_select_db($database_revenuecon, $revenuecon);
$query_localautho = "SELECT * FROM localauthorities ORDER BY name ASC";
$localautho = mysql_query($query_localautho, $revenuecon) or die(mysql_error());
$row_localautho = mysql_fetch_assoc($localautho);
$totalRows_localautho = mysql_num_rows($localautho);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="revenuestyles.css" rel="stylesheet" type="text/css" />
</head>

<body>
<h3>Insert Multiple Records</h3>
<a href="home.php"><img src="homelogo.jpg" width="35" height="35" alt="Home" /></a>

<form id="form1" name="form1" method="POST" action="<?php echo $editFormAction; ?>">
<table width="auto" border="1" class="hovertable" id="myTable">
  <tr>
    <th scope="col">Deed No</th>
    <th scope="col">Deed Date</th>
    <th scope="col">Grantor Name</th>
    <th scope="col">Address</th>
    <th scope="col">Grantee Name</th>
    <th scope="col">Address</th>
    <th scope="col">Amount</th>
    <th scope="col">Land District</th>
    <th scope="col">Land Village</th>
    <th scope="col">Land Name</th>
    <th scope="col">Notary</th>
    <th scope="col">Local Authority</th>
    <th scope="col">Slip No</th>
    <th scope="col">Payment Date</th>
    <th scope="col">File No</th>
  </tr>
  <?php
  $recordcount=10;
  $currentrecord=0;
  $districtselect="";
  $loyarselect="";
  $localselect="";
   
do {  
     $districtselect = $districtselect . '<option value='. $row_districts['district'].'>'. $row_districts['district']. '</option>';
   
} while ($row_districts = mysql_fetch_assoc($districts));
$districtselect = $districtselect . "</select>";

do {  
     $loyarselect = $loyarselect . '<option value='. $row_loyer['id'].'>'. $row_loyer['loyername']. '</option>';
   
} while ($row_loyer = mysql_fetch_assoc($loyer));
$loyarselect = $loyarselect . "</select>";

do {  
     $localselect = $localselect . '<option value='. $row_localautho['id'].'>'. $row_localautho['name']. '</option>';
   
} while ($row_localautho = mysql_fetch_assoc($localautho));
$localselect = $localselect . "</select>";

   do { 
   $currentrecord+=1;?>
  
  <tr>
    <td><input type="text" name="deedno<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="date" name="deeddate<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="text" name="grantorname<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="text" name="grantoraddress<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="text" name="granteename<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="text" name="granteeaddress<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="number" name="amount<?php echo $currentrecord; ?>" value="" size="32" required='required'/></td>
    <td>
    <?php
    echo "<select name='landdistrict" . $currentrecord . "'>". $districtselect ;
	?>
    </td>
    <td><input type="text" name="landvillage<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="text" name="landname<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td>
     <?php
    echo "<select name='notaryid" . $currentrecord . "'>". $loyarselect ;
	?>
    </td>
    <td>
     <?php
    echo "<select name='localauthorityid" . $currentrecord . "'>". $localselect ;
	?>
    </td>
    <td><input type="text" name="slipno<?php echo $currentrecord; ?>" value="" size="32" /></td>
    <td><input type="date" name="date<?php echo $currentrecord; ?>" value="<?php echo date('Y-m-d'); ?>" size="32" /></td>
    <td><input type="text" name="fileno<?php echo $currentrecord; ?>" value="" size="32" /></td>
    </tr>
  <?php 
  	  } while ($currentrecord<=$recordcount); ?>
  <br />
  
</table>
<p>
  <input type="submit" name="submit" id="submit" value="Insert" />
</p>
<input type="hidden" name="MM_insert" value="form1" />
</form>

<p>&nbsp;</p>
</body>
</html>
<?php
mysql_free_result($districts);

mysql_free_result($loyer);

mysql_free_result($localautho);
?>
