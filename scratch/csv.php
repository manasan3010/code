<?php


$file = file_get_contents('https://www.peeringdb.com/export/advanced-search/net/json-pretty?info_type__in=Content&limit=250&depth=1');


$jsonString = '[{"name":"Wayne","age":28},{"name":"John","age":21},{"name":"Sara","age":24}]';

//Decode the JSON and convert it into an associative array.
$jsonDecoded = json_decode($file, true)['results'];

print_r($jsonDecoded);

$fp = fopen('ex.csv', 'w');

//Loop through the associative array.
foreach ($jsonDecoded as $row) {
    //Write the row to the CSV file.
    fputcsv($fp, $row);
}

//Finally, close the file pointer.
fclose($fp);
