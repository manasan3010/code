<!-- <base href="http://localhost/Economic%20Calendar.html" target="_blank"> -->
<?php
$data = [];
$curl = curl_init("http://localhost/Economic%20Calendar.html");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

$page = curl_exec($curl);

if (curl_errno($curl)) // check for execution errors
{
    echo 'Scraper error: ' . curl_error($curl);
    exit;
}

curl_close($curl);

$regex = '/<table id="calendar" class="table table-hover table-condensed">(.*)About our calendar/s';
if (preg_match($regex, $page, $list)) {
    // print_r($list[0]);

    $list2  = preg_split('/<th colspan="3" style="text-align: left; width: 375.455px;">/', $list[0]);
    array_shift($list2);
    // print_r($list2);

    foreach ($list2 as $i => $val) {
        // echo " ##############";
        // print_r($val);
        if (preg_match_all('/"calendar-date-.">(.*?)<.*?<td title="([^"]*).*?(?:class="calendar-event".*?>([^<]*)?<)?.*?/s', $val, $list3)) {

            // print_r($list3[1]);
            foreach ($list3[1] as $key1 => $temp1) {
                $data_2 = [];

                $data_2['date'] = preg_split('/<\/th>/', $val)[0];
                $data_2['time'] = $list3[1][$key1];
                $data_2['country'] = $list3[2][$key1];
                $data_2['company'] = $list3[3][$key1];
                $data_2['code'] = $list3[4][$key1];
                $data_2['actual'] = $list3[5][$key1];
                $data_2['previuos'] = $list3[6][$key1];
                $data_2['consensus'] = $list3[7][$key1];
                $data_2['forecast'] = $list3[8][$key1];
                // print_r($data_2);

                array_push($data, $data_2);
            }
        } else {
            echo "failed";
        }

        // $data[$i]['date'] = preg_split('/<\/th>/', $val)[0];
    }
    print_r($data);

    // if (preg_match_all('/(?<=<th colspan="3" style="text-align: left; width: 375.455px;">)(.*?)(<th colspan="3" style="text-align: left;">|About our calendar)/s', $list[0], $list2)) {
    // print_r($list2[0]);
    // }
} else {
    print "Not found";
}
