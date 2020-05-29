<?php require("spelloutamount.php");?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<style>
p.big {
    line-height: 150%;
}
</style>
</head>

<body>
<p align="right"><em>Annex  I</em></p>
<p align="center"><strong>FORM OF CLAIM  PRESCRIBED UNDER SECTION 2 (1) OF THE TRANSFER OF STAMP DUTY STATUTE OF  THE NORTHERN PROVINCE, No. 02 OF 2014</strong></p>
<p>Hon.  Minister of Finance,<br />
  Northern  Province.</p>
<p>Claim for Transfer of Stamp duty under Section 2(1)  of the Transfer of Stamp Duty Statute of the Northern Province, No. 2 of 2014.</p>
<p>Name of Municipal Council/ Urban Council/ Pradeshiya  Sabha <?php echo $_GET['localauthority']; ?></p>
<p>In  terms of Section 2 of the Transfer of Stamp Duty Statute of the Northern  Province, No. 2 of 2014,</p>
<p class="big">I  ,........................................................................ Municipal  Commissioner / Secretary (here after referred to as the Administrative  Officer) of the <?php echo $_GET['localauthority']; ?> , do hereby claim a sum of Rupees <?php echo number_format($_GET['amount'],2,'.',','); ?>.(Rs. <?php echo convert_number_to_words($_GET['amount']); ?>) being  the stamp duty in relation to transfer of immovable properties situated within  the administrative limits of the said Municipal Council / Urban Council /  Pradeshiya Sabha, as per details given in the Schedules annexed hereto for the   <?php echo $_GET['month']; ?> - <?php echo $_GET['year']; ?> and request  that the said sum of Rs.<?php echo number_format($_GET['amount'],2,'.',','); ?> be  transferred to the <?php echo $_GET['localauthority']; ?>.<br />
</p>
<p>&nbsp;</p>
<p class="big">Signature:  .......................................<br />
Name:  ............................................</p>
<p class="big">&nbsp;</p>
<p class="big"><br />
  (Rubber  Stamp)<br />
  Administrative  Officer,<br />
  Local  Authority.<br />
  Date:  ..................................</p>
</body>
</html>