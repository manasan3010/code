<?php

print_r(preg_split("/(\?v=|&)/", $_GET['url'])[1]);
// preg_match_all ("/<b>(.*)<\/b>/U", $userinfo, $pat_array);
