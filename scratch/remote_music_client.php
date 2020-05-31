<?php

if ($_SERVER["REQUEST_METHOD"] == 'GET' && isset($_GET['url']) && $_GET['url'] != '') {
    // file_put_contents('remote_music.log', '');
    file_put_contents('remote_music.log', 'https://www.youtube.com/embed/' . preg_split("/(\?v=|&)/", $_GET['url'])[1] . '?playlist=' . preg_split("/(\?v=|&)/", $_GET['url'])[1] . '&loop=1&autoplay=1');
    // preg_match_all ("/<b>(.*)<\/b>/U", $userinfo, $pat_array);

}
?>

<html>

<head>
    <title>Using Server-Sent Events</title>
    <script>
        prevData = 123;
        window.onload = function() {
            source = new EventSource("remote_music.php");
            source.onmessage = function(event) {
                if (prevData != event.data && prevData != 123) location.search = '';
                prevData = event.data
                console.log(event.data)
                // document.getElementById("result").innerHTML += "New time received from web server: " + event.data + "<br>";

            };


            // element = document.querySelector('form');
            // element.addEventListener('submit', event => {
            //     event.preventDefault();
            //     xhr = new XMLHttpRequest();
            //     xhr.open("POST", 'remote_music.php', true);
            //     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            //     xhr.send({
            //         'someStuff': 345345
            //     });
            // });
        };
    </script>
</head>

<body>
    <iframe width="560" height="315" src="<?php echo file_get_contents('remote_music.log'); ?>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <br>
    <br>
    <form method="get" action="">
        <i><textarea type="text" name="url" cols="50" rows="4" style="font-size: 22;"></textarea></i>
        <input type="submit" value="Update URL">
    </form>
    <div id="result">
        <!--Server response will be inserted here-->
    </div>
    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>


</body>

</html>