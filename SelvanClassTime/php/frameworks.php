<?php

$frameworks = array("CodeIgniter",'Cool',"Zend Framework","Cake PHP","Kohana") ;

$name = $_POST["uname"];

// if (strlen($name) > 0) {

//     $match = "";

//     for ($i = 0; $i < count($frameworks); $i++) {

//         if (strtolower($name) == strtolower(substr($frameworks[$i], 0, strlen($name)))) {

//             if ($match == "") {

//                 $match = $frameworks[$i];

//             } else {

//                 $match = $match . " , " . $frameworks[$i];

//             }

//         }

//     }

// }

// echo ($match == "") ? 'no match found' : $match;

// echo $name
echo '<h2>form data retrieved by using $_GET variable<h2/>'

?>