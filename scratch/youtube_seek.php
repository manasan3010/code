 <div id="player1"></div>
 <div id="player2"></div>
 <br>
 <br>
 <div>
     <button onclick="playBothVideos(this)" style="width: 140px;">Play Both Streams</button>
     <button onclick="resetCurrentTime(this)" style="width: 140px;">Reset Current Time</button>
     <button onclick="updateCurrentTime(this)" style="width: 140px;">Update Current Time</button>
     <input placeholder="Video Stream URL" type="url" id="v1_url">
     <input placeholder="Audio Stream URL" type="url" id="v2_url">
 </div>


 <head>
     <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
 </head>
 <script>
     $.getScript('//www.youtube.com/iframe_api');

     var player1, player2
     var isVideoStart = {}
     var playerState = 0
     var site_url = new URL(location.href);

     function onYouTubePlayerAPIReady() {
         let video_1_URL = site_url.searchParams.get("v1");
         let video_2_URL = site_url.searchParams.get("v2");
         let video_1_ID = video_1_URL.substr(video_1_URL.length - 11);
         let video_2_ID = video_2_URL.substr(video_2_URL.length - 11);
         player1 = new YT.Player('player1', {
             height: '460',
             width: '1200',
             videoId: video_1_ID,
             playerVars: {
                 'start': site_url.searchParams.get('t1').split('.')[0],
                 'autoplay': 1,
                 'controls': 1,
                 'showinfo': 0,
                 'rel': 0,
                 'mute': 1,
             },
             events: {
                 'onReady': onPlayerReady,
                 'onStateChange': onPlayer1StateChange,
             }

         });
         player2 = new YT.Player('player2', {
             height: '100',
             width: '1200',
             videoId: video_2_ID,
             playerVars: {
                 'start': site_url.searchParams.get('t2').split('.')[0],
                 'autoplay': 1,
                 'controls': 1,
                 'showinfo': 0,
                 'rel': 0,
             },
             events: {
                 'onReady': onPlayerReady,
                 'onStateChange': onPlayer2StateChange,
             }

         });
     }

     function onPlayer1StateChange(evt) {

         if (evt.data == 1 && !isVideoStart['1']) {
             console.log(!isVideoStart['1']);
             isVideoStart['1'] = 1
             player1.pauseVideo()
             player1.seekTo(site_url.searchParams.get('t1'))
         }
     }

     function onPlayer2StateChange(evt) {
         if (evt.data == 1 && !isVideoStart['2']) {
             isVideoStart['2'] = 1
             player2.pauseVideo()
             player2.seekTo(site_url.searchParams.get('t2'))
         }
     }


     function onPlayerReady(evt) {

         // doesn't work here
         // player.seekTo(30);  

         // lets make ure we have a function
         //alert("typeof(player.SeekTo) = " + typeof(player.seekTo));
     }

     function playBothVideos(element) {
         playerState = !playerState
         if (playerState) {
             element.textContent = 'Pause Both Streams'
             player1.playVideo()
             player2.playVideo()

         } else {
             element.textContent = 'Play Both Streams'
             player1.pauseVideo()
             player2.pauseVideo()

         }
         // doesn't work here
         // player.seekTo(30);  

         // lets make ure we have a function
         //alert("typeof(player.SeekTo) = " + typeof(player.seekTo));
     }

     function updateCurrentTime(element) {
         let v1_url = document.getElementById('v1_url').value
         let v2_url = document.getElementById('v2_url').value
         if (v1_url) site_url.searchParams.set('v1', v1_url)
         if (v2_url) site_url.searchParams.set('v2', v2_url)
         site_url.searchParams.set('t1', player1 ? player1.getCurrentTime() : 0)
         site_url.searchParams.set('t2', player2 ? player2.getCurrentTime() : 0)
         let updatedURL = site_url.toString()
         window.history.pushState("", "title_1", updatedURL)

     }

     function resetCurrentTime(element) {
         player1.seekTo(site_url.searchParams.get('t1'))
         player2.seekTo(site_url.searchParams.get('t2'))
     }

     $(function() {

         $(document).on('click', '#btnSeek', function() {
             player.seekTo($(this).data('seek'), true);
         });
     });
 </script>
 <style>
     body {
         background-color: black;
     }
 </style>