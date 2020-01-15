<?php

function callback($buffer)
{
    // replace all the apples with oranges
}

ob_start("callback");

?>
<html>

<body>
    <p>It's like comparing apples to oranges.</p>
</body>

</html>
<?php

ob_end_flush();
