<?php
$user = "94775824250";
$password = "4777";
$text = urlencode("Testing For Fun");
$to = "94774784386";
 
$baseurl ="http://www.textit.biz/sendmsg";
$url = "$baseurl/?id=$user&pw=$password&to=$to&text=$text";
$ret = file($url);
 
$res= explode(":",$ret[0]);
 
if (trim($res[0])=="OK")
{
echo "Message Sent - ID : ".$res[1];
}
else
{
echo "Sent Failed - Error : ".$res[1];
}