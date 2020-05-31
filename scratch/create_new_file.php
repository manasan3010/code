<?php
$fileName = explode('/scratch/', $_SERVER['REQUEST_URI'])[1];

if(substr($fileName, -4)!='.php') die('Not a PHP file');

$myfile = fopen($fileName, "a") or die("Unable to open file!");
$txt = "<?php\n\n\n\n?>";
fwrite($myfile, $txt);
fclose($myfile);

// sleep(3);

header("Location: {$fileName}");
