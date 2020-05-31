<?php
header("Content-Type: application/json");


function dlPage($href)
{

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_URL, $href);
    curl_setopt($curl, CURLOPT_REFERER, 'https://www.nsfwyoutube.com/youtube-bypass-login');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.125 Safari/533.4");
    $str = curl_exec($curl);
    curl_close($curl);
    echo ('<script> a=' . $str . ';console.log(a);</script>');
    // $dom = new simple_html_dom();

    // $dom->load($str);

    // return $dom;
}
// $dom = dlPage('http://localhost/Economic%20Calendar.html');
// $dom = dlPage('https://www.googleapis.com/youtube/v3/search?key=AIzaSyCN3EeSqlCJ24-sqWM-VgoURb8xAQFSm80&q=red&type=video&safeSearch=none&part=snippet&maxResults=50&pageToken=&_=1576292748185');
