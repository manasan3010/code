<?php
// Set the content-type
header('Content-Type: image/png');

// Create the image
// $image = imagecreatetruecolor(400, 300);

$imgPath = 'forest_BW.jpg';
$image = imagecreatefromjpeg($imgPath);

$width = imagesx($image);
$height = imagesy($image);
// Create some colors
$white = imagecolorallocate($image, 255, 255, 255);
$grey = imagecolorallocate($image, 128, 128, 128);
$black = imagecolorallocate($image, 0, 0, 0);
$red = imagecolorallocate($image, 255, 0, 0);
$lightblue = imagecolorallocate($image, 67, 142, 200);
// imagefilledrectangle($image, 0, 0, 399, 29, $white);

// The text to draw
$text = $_GET['q'];
$textLength = strlen($text);
// Replace path by your own font path
$font = "C:\Users\HP\Desktop\Desktop\programming\WEB\scratch\arial.ttf";
$fontScale = 1.1;
$fontSize = $fontScale * $width / $textLength;
if (isset($_GET['font_size'])) $fontSize = $_GET['font_size'];
$ft_bbox = imageftbbox($fontSize, 0, $font, $text);
$offsetx = $ft_bbox[1] - $ft_bbox[7];
// Add some shadow to the text
// imagettftext($image, 20, 0, 11, 21, $grey, $font, $text); 68 136

// Add the text
imagettftext($image, $fontSize, 0, 0, $height / 2 + $offsetx / 2, $red, $font, $text);

// Using imagepng() results in clearer text compared with imagejpeg()
imagepng($image);
imagedestroy($image);
