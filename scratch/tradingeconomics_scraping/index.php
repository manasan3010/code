<h1 style="color:red !important;font-size:30px;margin:15px;">After page has loaded completely, Open console and type <i>data</i> and a JSON array of scraped data will be outputted. Contact me for Source Code.</h1>
<?php
ini_set('max_execution_time', '0');
ini_set("memory_limit", "-1");

require_once 'simple_html_dom.php';

function dlPage($href)
{

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_URL, $href);
    curl_setopt($curl, CURLOPT_REFERER, $href);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.125 Safari/533.4");
    $str = curl_exec($curl);
    curl_close($curl);
    echo ($str);
    // Create a DOM object
    $dom = new simple_html_dom();
    // Load HTML from a string
    $dom->load($str);

    return $dom;
}
// $dom = dlPage('http://localhost/Economic%20Calendar.html');
$dom = dlPage('https://es.tradingeconomics.com/calendar');


// print_r($dom);
// echo ($dom);
$fdata = [];
$thead = [];
$tr = [];
$a = 0;
// while (empty($dom)) { }
if (!empty($dom)) {


    foreach ($dom->find('tr[data-url^=/]') as $trClass) {
        $tdata = [];
        if ($trClass->find('[class=calendar-iso]') != null) {
            $a++;

            // $tdata['date'] = trim($divClass->find('tr>th')[0]->innertext());
            // echo $trClass->find('[class^=calendar-date-]')[0]->innertext();
            // echo $trClass->find('[class=calendar-iso]')[0]->title;
            // echo $trClass->children(2)->children(0)->text();
            // echo $trClass->children(2)->children(1)->text();

            if ($trClass->find('[class^=calendar-date-]') != null) {
                $tdata['time'] =  trim($trClass->find('[class^=calendar-date-]')[0]->innertext());
            } else $tdata['time'] = null;

            $tdata['country'] =  $trClass->find('[class=calendar-iso]')[0]->title;
            $tdata['company'] =  $trClass->children(2)->children(0)->text();
            $tdata['abbreviation'] =  $trClass->children(2)->children(1)->text();
            $tdata['url'] = $trClass->attr['data-url'];
            $tdata['id'] = $trClass->attr['data-id'];

            if ($trClass->find('#actual')[0] != null) {
                // echo $trClass->find('#actual')[0]->innertext();
                $tdata['actual'] = $trClass->find('#actual')[0]->innertext();
            }

            if ($trClass->find('#previous')[0] != null) {
                // echo $trClass->find('#previous')[0]->innertext();
                $tdata['previous'] = $trClass->find('#previous')[0]->innertext();
            }

            if ($trClass->find('#consensus')[0] != null) {
                // echo $trClass->find('#consensus')[0]->innertext();
                $tdata['consensus'] = $trClass->find('#consensus')[0]->innertext();
            }

            if ($trClass->find('#forecast') != null) {
                // echo $trClass->find('#forecast')[0]->innertext();
                $tdata['forecast'] = $trClass->find('#forecast')[0]->innertext();
            }

            array_push($fdata, $tdata);

            // echo '<br>';
        } else echo 'none';
    }



    foreach ($dom->find('thead.hidden-head') as $ithead => $theadClass) {
        preg_match('/(?<=_ctl)\d+(?=_th)/', $theadClass->id, $list);
        if ($dom->find('thead.hidden-head')[$ithead + 1] != null) {
            preg_match('/(?<=_ctl)\d+(?=_th)/', $dom->find('thead.hidden-head')[$ithead + 1]->id, $list2);
            for ($i = 0; $i < $list2[0] - $list[0]; $i++) {
                $fdata[$list[0] + $i - 1]['date'] = trim($dom->find('thead.hidden-head')[$ithead]->find('tr>th')[0]->innertext());
                // echo $fdata[$list[0] + $i]['date'];
                // $fdata[0]['date'] = 'test';
            }
        } else {
            for ($i = 0; $i < count($fdata) + 1 - $list[0]; $i++) {
                $fdata[$list[0] + $i - 1]['date'] = trim($dom->find('thead.hidden-head')[$ithead]->find('tr>th')[0]->innertext());
            }
        }
        print_r($list2);
    }
} else echo 'waiting';


// if (!empty($dom)) {
//     foreach ($dom->find('thead[class="hidden-head"]') as $divClass) {
//         echo $divClass->next_sibling()->childNodes()[0]->nodeName();
//         foreach ($divClass->next_sibling()->childNodes() as $trClass) {
//             $tdata = [];
//             if ($trClass->nodeName() == "tr" && $trClass->find('[class^=calendar-date-]')[0] != null) {
//                 $a++;

//                 $tdata['date'] = trim($divClass->find('tr>th')[0]->innertext());
//                 echo $trClass->find('[class^=calendar-date-]')[0]->innertext();
//                 echo $trClass->find('[class=calendar-iso]')[0]->title;
//                 echo $trClass->children(2)->children(0)->text();
//                 echo $trClass->children(2)->children(1)->text();

//                 $tdata['time'] =  trim($trClass->find('[class^=calendar-date-]')[0]->innertext());
//                 $tdata['country'] =  $trClass->find('[class=calendar-iso]')[0]->title;
//                 $tdata['company'] =  $trClass->children(2)->children(0)->text();
//                 $tdata['abbreviation'] =  $trClass->children(2)->children(1)->text();
//                 $tdata['url'] = $trClass->attr['data-url'];

//                 if ($trClass->find('#actual')[0] != null) {
//                     echo $trClass->find('#actual')[0]->innertext();
//                     $tdata['actual'] = $trClass->find('#actual')[0]->innertext();
//                 }

//                 if ($trClass->find('#previous')[0] != null) {
//                     echo $trClass->find('#previous')[0]->innertext();
//                     $tdata['previous'] = $trClass->find('#previous')[0]->innertext();
//                 }

// if ($trClass->find('#consensus')[0] != null) {
//     echo $trClass->find('#consensus')[0]->innertext();
//     $tdata['consensus'] = $trClass->find('#consensus')[0]->innertext();
// }

//                 if ($trClass->find('#forecast')[0] != null) {
//                     echo $trClass->find('#forecast')[0]->innertext();
//                     $tdata['forecast'] = $trClass->find('#forecast')[0]->innertext();
//                 }

//                 array_push($fdata, $tdata);

//                 echo '<br>';
//             } else echo 'none';
//         }
//     }
// } else echo 'waiting';


// echo ($dom->find("li")[1]);
// var_dump($fdata);
echo $a;
echo "<script>data=" . json_encode($fdata) . ";console.clear();console.dir(data);</script>";
