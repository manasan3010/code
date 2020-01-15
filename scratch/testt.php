<?php


$html = '
<div class="page-wrapper">
    <section class="page single-review" itemtype="http://schema.org/Review" itemscope="" itemprop="review">
        <article class="review clearfix">
            <div class="review-content">
                upper
                <div class="review-text" gtext="reviewBody">
                    Outstanding ...
                </div>
            </div>
            <h1>
                Hello World!
            </h1>
            test
        </article>
    </section>
</div>
';


/* update your path accordingly */
include_once 'simple_html_dom.php';

// $html = file_get_html('http://nimishprabhu.com/');
$html2 = str_get_html($html);


$url = 'https://www.phpbb.com/community/viewtopic.php?f=46&t=543171';
// $html = file_get_html($url);

// echo $html2->find('.review.clearfix', 0)->text;
print_r($_SERVER);
echo file_get_html('https://extreme-ip-lookup.com/json/');
