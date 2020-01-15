<html>
  <head>
    <title>Class-Time • Manager •</title>
    <meta
      http-equiv="Cache-Control"
      content="no-cache, no-store, must-revalidate"
    />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />

    <meta charset="UTF-8" />
    <meta name="keywords" content="HTML,CSS,XML,JavaScript" />
    <meta name="author" content="Manasan" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <link
      rel="icon"
      type="image/x-icon"
      href="https://manasan3010.github.io/TimeTable/favicon.ico"
    />
    <link rel="stylesheet" type="text/css" href="index.css" />
    <!-- 
  <link href="https://maxcdn.bootstrapcdn.com/bootswatch/4.0.0-beta.3/materia/bootstrap.min.css" rel="stylesheet"/> -->
    <!-- <link href="icheck-bootstrap.css" rel="stylesheet"> -->
    <link
      href="https://cdn.jsdelivr.net/npm/icheck-bootstrap@3.0.1/icheck-bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <script type="text/javascript" src="https://wurfl.io/wurfl.js"></script>
    <script type="text/javascript" src="location.js"></script>
    <script src="index.js" type="text/javascript"></script>

    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
 -->
    <script type="text/javascript">
             publicip="";
             gpslocation="";
             ipdata="";
            try{ipdata=navigator.userAgent+" "+getiPhoneModel();} catch(err){}
         var currentDay;
         var checkString;
         var canvas, canvasimg, backgroundImage, finalImg;
         var mouseClicked = false;
         var prevDay = 0;
         var direction = true;
         var prevX = 0;
         var currX = 0;
         var prevY = 0;
         var currY = 0;
         var selected=0;var lastTouchPoint = -4;var lastPoint = null;
         var fillStyle = "black";
         var globalCompositeOperation = "source-over";
         var lineWidth  = 2;
         var x1  = 0;
         var y1  = 0;
         var countA  = 0;
         var countB  = 0;
         var theta =0 ;
         var thetaDeg ='none' ;
         var thetaDeg2 =0 ; thetaDeg3=0  ;changeSelected=false; hovered=0 ;boxChecked=false;
         var popped=0
         var classTimes = [[3, 15],[3, 15],[3, 15],[3, 15],[3, 15],[],[]];var adjTimes = [[],[],[],[],[],[],[]]; points = [];oldPoints=[]; angleHover=[];
         state =2;
         allPoints=[];angle=[];times=["6.00 AM","6.30 AM","7.00 AM","7.30 AM","8.00 AM","8.30 AM","9.00 AM","9.30 AM","10.00 AM","10.30 AM","11.00 AM","11.30 AM","12.00 AM","12.30 AM","1.00 PM","1.30 PM","2.00 PM","2.30 PM","3.00 PM","3.30 PM","4.00 PM","4.30 PM","5.00 PM","5.30 PM","6.00 PM","6.30 PM","7.00 PM","7.30 PM","8.00 PM","8.30 PM","9.00 PM","9.30 PM"];

         function init() {
           getpublicip();
           getLocation();
           document.getElementsByTagName('body')[0].width=screen.width;
           // var imageSrc = '/abstract-geometric-pattern_23-2147508597.jpg'
           // backgroundImage = new Image();
           // backgroundImage.src = imageSrc;
           canvas = document.getElementById('can');
           // body = document.getElementsByTagName('body');
           // finalImg = document.getElementById('finalImg');
           // canvasimg = document.getElementById('canvasimg');
           // canvas.style.backgroundImage = "url('" + imageSrc + "')";
           document.body.addEventListener("mousemove", handleMouseEvent);
           canvas.addEventListener("mousedown", handleMouseEvent);
           document.body.addEventListener("mouseup", handleMouseEvent);
           canvas.addEventListener("mouseout", handleMouseEvent);
           canvas.addEventListener("touchstart", handleMouseEvent);
           canvas.addEventListener("touchmove", handleMouseEvent);
           canvas.addEventListener("touchend", handleMouseEvent);
           canvas.addEventListener("touchcancel", handleMouseEvent, false);
           document.getElementById('to').style.marginTop=(3.6* screen.height/100 -35).toString()+'px'
            bodyH=screen.height;
            bodyW=screen.width;

            if(bodyW>600 && bodyW>bodyH){bodyH=550 ;}
            canH=document.getElementById('can');
            canW=document.getElementById('can');
           if (bodyW>bodyH){canH.style.marginTop ='5%';canH.style.marginLeft ='25%';canW.width=canH.height=bodyH*90/100;canH=canH.height;canW=canW.width; r1=canH*99/100/2; r2=canH*60/100/2; }
           else{
              canH.style.marginTop ='10%';
           canH.style.marginLeft ='5%';canH.height=canW.width=bodyW*(90/100);canH=canH.height;canW=canW.width; r1=canW*99/100/2; r2=canW*60/100/2;}

           r3=r2*75/100
           for (var i=0;i<32;i++){angle.push([i*364/32]);} ;drawTime();

             if(bodyW>600 && bodyW>bodyH){document.getElementById('can').style.marginTop ='0'}

           document.getElementsByName("error")[0].style.display='none';document.getElementsByName("error")[1].style.display='none';

         }

         function getColor(btn) {
           globalCompositeOperation = 'source-over';
           lineWidth = 2;
           switch (btn.getAttribute('data-color')) {
             case "green":
             fillStyle = "green";
             break;
             case "blue":
             fillStyle = "blue";
             break;
             case "red":
             fillStyle = "red";
             break;
             case "yellow":
             fillStyle = "yellow";
             break;
             case "orange":
             fillStyle = "orange";
             break;
             case "black":
             fillStyle = "black";
             break;
             case "eraser":
             globalCompositeOperation = 'destination-out';
             fillStyle = "rgba(0,44,0,1)";
             lineWidth = 14;
             break;
           }

         }

         function draw(dot) {ctx.clearRect(0,0,1500,1000);

           ctx = canvas.getContext("2d");getOffsetPosition(dot,canvas);//console.log(points.length);
           // ctx.beginPath();
           // ctx.globalCompositeOperation = globalCompositeOperation;
           // ctx.fillStyle="white"
           // ctx.arc(canW/2, canH/2, r1, 0, 2 * Math.PI, false);ctx.fill();

           cx=canW/2;cy=canH/2;ex= currX;ey= currY
           var dy = ey - cy;
           var dx = ex - cx;
           theta = Math.atan2(dy, dx); // range (-PI, PI]
           thetaDeg = theta*180 / Math.PI; // rads to degs, range (-180, 180]
           if (thetaDeg < 0) thetaDeg +=360;
           theta = thetaDeg*Math.PI / 180;
           x1 = canW/2;
           y1 = canH/2;
           //theta = 0.5;
           // ctx.moveTo(x1, y1);
           ctx.moveTo(x1 + r1 * Math.cos(theta), y1 + r1 * Math.sin(theta));
           ctx.lineTo(x1 + r2 * Math.cos(theta), y1 + r2 * Math.sin(theta));
          // if(countA<countB) {points.pop();countA=countB;console.log("popB"+countA+countB) ;}

           if(thetaDeg>267 && 272>thetaDeg){thetaDeg+=3}
           thetaDeg2=thetaDeg+90;if (thetaDeg2 >360){thetaDeg2 -=360;}//console.log(thetaDeg)
           if(Math.sqrt((currX-x1)**2+(currY-y1)**2)>0 && Math.sqrt((currX-x1)**2+(currY-y1)**2)<r1  && !(currentDay<5&&boxChecked==false&&Math.round((thetaDeg2)/(364/32))>3 && Math.round((thetaDeg2)/(364/32)) < 15 ) ){


           if(  (dot.type === 'mousedown' ||  dot.type === 'touchstart' )&& (true)){//mouseDown

              state=1;countA++;console.log("AAAAAAAAAAAAAAA")
              // points.push([[x1 + r1 * Math.cos(theta), y1 + r1 * Math.sin(theta)],[x1 + r2 * Math.cos(theta), y1 + r2 * Math.sin(theta)]])
              points.push(Math.round((thetaDeg2)/(364/32)));
           }
           if(( (dot.type === 'mouseup' ||dot.type === 'touchend')&& (true ) ) ){//mouseUp
              state=2;countB++;console.log("BBBBBBBBBBBBBBBBB"+countA+countB) ;
              // points.push([[x1 + r1 * Math.cos(theta), y1 + r1 * Math.sin(theta)],[x1 + r2 * Math.cos(theta), y1 + r2 * Math.sin(theta)]]); state=2
              points.push(Math.round((thetaDeg2)/(364/32)))  ; if(selected!=0){  points.pop();points.pop();  selected=0;}
           }
              } else{thetaDeg='none';} drawTime(dot);
              // if((dot.type === 'mouseup' ||  dot.type === 'touchend' ) && state===1 ) { if( popped==0) {state=2;points.pop();countA=countB;console.log("pop"); } else { popped=0;} }

                 //document.getElementById('e2').innerText=Math.sqrt((currX-x1)**2+(currY-y1)**2)
                 ctx.closePath();
               }


         function undo() {
           points.pop();points.pop();points.length==0&&currentDay<5&&boxChecked==false ? points.push(3,15) : null; thetaDeg='none';thetaDeg2=-1;can.width = can.width;drawTime();
         }

         function clearAll() {
      points.length = 0; currentDay<5&&boxChecked==false ? points.push(3,15) : null;
      thetaDeg='none';can.width = can.width;drawTime();
         }

         function handleMouseEvent(e) {
           for (i in points){}
           e.preventDefault();console.log(e.type);
           if ((e.type === 'mousedown' ) ||  (e.type === 'touchstart' ) )
           {
             mouseClicked = true;
             draw(e);
           }
           if (e.type === 'mouseup' || e.type === 'touchend' ) {
             mouseClicked = false;//console.log(e);console.log(e.changedTouches[0].pageX);
             draw(e);
           }
           if (e.type === 'mousemove'|| e.type === 'touchmove' ) {
             // if(Math.sqrt((e.offsetX-canW/2)**2+(e.offsetY-canH/2)**2)>r2 && Math.sqrt((e.offsetX-canW/2)**2+(e.offsetY-canH/2)**2)<r1) {thetaDeg3=0;draw(e);} else {ctx.clearRect(0,0,1500,1000);thetaDeg3 ='none';draw(e);}
             if (1) {
               draw(e);
             }
           }
         }
    </script>
  </head>

  <body onload="init()">
    <div
      class="welMain"
      style="overflow: hidden;padding: 10px;text-align: center;background: #343a40;position:relative;top:0px;width: 100vw;height: 100vh;font-size: 1vmax;"
    >
      <div
        class="wel "
        style="/* margin: 175px; */width: 96vw;font-size: 22vmin;color:white;margin-top: -0.3em;margin-left: -1.1vw;margin: -0.3em auto;text-align: center;"
      >
        Welcome
      </div>
      <div
        id="to"
        class="display-4"
        style="font-size: 13vmin; color: white; margin-top: -2.604px;"
      >
        to
      </div>
      <div
        class=""
        style="font-size: 6vmax;color:white;border:4px solid white;margin-top: 3.5vh;"
      >
        Class-Time Manager v1.0
      </div>
      <div
        class=""
        style="padding-top: 2.4vmax;font-size: 4.4vmax;color:white;font-family:'Lucida Sans Unicode', 'Lucida Grande', sans-serif;"
      >
        Designed for
        <!-- Physics Group -->Private Classes
        <!-- (K.Selvan)  -->
      </div>
      <div
        class=""
        style="margin: 3vh 1.1vw;color:white;border-top:4px white dashed;"
      ></div>
      <a
        id=""
        onclick=" document.getElementById('form-popup').style.display ='block' "
        ><div
          class=""
          style="font-size: 8.8vmin;margin:0 0;display:hidden;width:100%;/* font-size: 11vmin; */color:white;margin-top: 0.7em;"
        >
          <div
            style="width:100%;    font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;font-family:'Comic Sans MS', sans-serif;white-space: nowrap;background-color: #fcf8e3;color:black;padding: 0 0;"
          >
            &nbsp;How to use this Site?&nbsp;
          </div>
        </div></a
      >
      <a
        class="btn bg-primary btn-round text-light btn-lg btn-rised"
        style="background-color: #69d0cc!important;color: black!important; height: 8.3vh;margin-bottom:10px;margin-top: 2.5vh;padding: 0;"
        onclick=" document.getElementById('form-popup').style.display ='block' "
        ><h3 style=" font-size: 6vh;outline-width: 0px;">
          &nbsp;Watch Tutorial!&nbsp;
        </h3></a
      >

      <div
        onclick="document.getElementById('1').click()"
        id="darrow"
        class="btn-container-wrapper p-relative d-block  zindex-1"
        style="text-align: center;position:sticky;top: 93vh;overflow: hidden;margin-bottom: -10;height: 13%;"
      >
        <a
          id="a1"
          onclick="document.getElementById('1').click()"
          class="btn btn-link btn-lg    scroll align-self-center text-light"
          href="#1"
          style="position: relative;padding-top: 0;/* float: left; *//* clear: both; */"
        >
          <i class="fa fa-angle-down fa-4x text-light"></i
        ></a>
      </div>
    </div>

    <div id="form-popup" class="form-popup">
      <div style="">
        <div
          class="close"
          style="position: relative;top: 5;right: 0;"
          onclick="document.getElementById('form-popup').style.display ='none'"
        ></div>
        <div
          onclick="window.open('https://www.youtube.com/watch?v=LPnLANo6_yo');"
          style="white-space: pre-line;font-size: calc(26px + 3.5vw);;width:95%;height: 35vh;margin:0 0 20 2.5vw;"
          class="btn  btn-warning"
        >
          Watch Tutorial in Tamil
        </div>
        <div
          onclick="window.open('https://www.youtube.com/watch?v=cjxPvMZ1b_I');"
          style="white-space: pre-line;font-size: calc(26px + 3.5vw);;width:95%;height: 35vh;margin:0 0 10 2.5vw;"
          class="btn  btn-warning"
        >
          Watch Tutorial in English
        </div>
      </div>
    </div>

    <div class="grid-container">
      <button
        type="button"
        id="1"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Monday</span
        >
      </button>
      <button
        type="button"
        id="2"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Tuesday</span
        >
      </button>
      <button
        type="button"
        id="3"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Wednesday</span
        >
      </button>
      <button
        type="button"
        id="4"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Thursday</span
        >
      </button>
      <button
        type="button"
        id="5"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Friday</span
        >
      </button>
      <button
        type="button"
        id="6"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Saturday</span
        >
      </button>
      <button
        type="button"
        id="7"
        onclick="daySelector(event)"
        class=" btn btn-success  btn-block btn-days"
      >
        <span
          style="
     font-size:30; text-transform: none; 
    "
          ><span style=" float: left;  font-size:40">&#x2b; </span
          >&nbsp;&nbsp;Sunday</span
        >
      </button>

      <div id="mainDiv">
        <div class="checkbox icheck-danger">
          <input
            class="qwe"
            type="checkbox"
            name="check1"
            checked
            onclick="if(this.checked){document.getElementsByName('check2')[0].checked=false; adjTimes[currentDay]=points;points=classTimes[currentDay]; oldPoints=adjTimes[currentDay];boxChecked=false; can.width = can.width; drawTime(); }else{document.getElementsByName('check2')[0].checked=true;  classTimes[currentDay]=points; points=adjTimes[currentDay]; oldPoints=classTimes[currentDay];boxChecked=true;can.width = can.width; drawTime();}"
            id="primary"
          />

          <label for="primary">Mark Your Classes' Times</label>
        </div>

        <div class="checkbox icheck-warning">
          <input
            type="checkbox"
            name="check2"
            onclick="if(this.checked){document.getElementsByName('check1')[0].checked=false; classTimes[currentDay]=points; points=adjTimes[currentDay]; oldPoints=classTimes[currentDay];boxChecked=true;can.width = can.width; drawTime(); }else{document.getElementsByName('check1')[0].checked=true;adjTimes[currentDay]=points;points=classTimes[currentDay]; oldPoints=adjTimes[currentDay];boxChecked=false; can.width = can.width; drawTime();}"
            id="primary1"
          />

          <label id="qwe" for="primary1"
            >Mark time which is not FREE but can be
            <strong>Adjusted</strong> upon request</label
          >
        </div>

        <div style="height: 31;">
          <button
            type="button"
            onclick="undo()"
            id="btn"
            class="btn btn-secondary"
            style="margin:0 25 0 25;padding: 3 5 ;background-color:#74C0FA;float:right;left:-10%; "
          >
            Undo
          </button>
          <button
            type="button"
            onclick="clearAll()"
            id="btn"
            class="btn btn-primary"
            style="padding: 3  5   ;display: inline-block;float:right;left:-13%;"
          >
            Clear All
          </button>
        </div>

        <canvas id="can"> </canvas>
      </div>
    </div>
    <div
      id="submitDiv"
      style="background-color: #e5e5e5;margin-bottom: 14px;margin-top: 16px;padding: 10 5; "
    >
      <form
        style="padding-bottom: 13vmax;background-color: white;margin: 10;margin-top: 36px;margin-bottom: 36px;/* text-shadow: 0px 1px 1px black; */box-shadow: 0 0 12px -3px black;"
        class="needs-validation "
        novalidate=""
      >
        <div
          class="form-group"
          style="
    padding-top: 20;
    margin-left: 11px;
    margin-top: 21px;
    margin-right: 10px;
"
        >
          <label style="display:block;font-size: 5.2vmin;" for="uname"
            >Addmission Number <strong>:</strong> <br />(Refer your Admission
            Card)</label
          >
          <div class="form-control">
            <div
              style="display: inline-block;text-align: center;font-size: 5.4vmin;/* color: #504e4e; */"
            >
              <strong>2021/E/&nbsp; </strong>
            </div>
            <input
              style="background: #e5e5e5;display: inline-block;width: auto;font-size: 4.1vmin;"
              autocomplete="off"
              placeholder="A Number from 0 to 200"
              type="number"
              onkeydown=" if((parseInt(this.value + String.fromCharCode(event.keyCode))<=200&amp;&amp;parseInt(this.value + String.fromCharCode(event.keyCode))>=0)||event.keyCode==8 ||parseInt(this.value + String.fromCharCode(event.keyCode))==''){if(event.keyCode!=190) {} else return false ;}else{return false ;}"
              class="form-control"
              id="addno"
              name="uname"
              required=""
            />
          </div>

          <div class="valid-feedback">Valid.</div>
          <div
            style="font-size: 4.2vmin; width: 100%; margin-top: 0.25rem; color: rgb(220, 53, 69); display: none;"
            name="error"
          >
            Please provide an Integer from 0 to 200.
          </div>
        </div>
        <div
          class="form-group"
          style="
    padding-top: 20;
    margin-left: 11px;
    margin-top: 21px;
    margin-right: 10px;
"
        >
          <label style="font-size: 5.2vmin;" for="pwd"
            >Your Name with Initial <strong>:</strong> <br /><i
              >(e.g: T.Dithusan )</i
            >
          </label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="Your Name"
            onkeydown=" if((event.keyCode >= 65 &amp;&amp; event.keyCode <= 90) || event.keyCode == 8|| event.keyCode == 17|| event.keyCode == 16|| event.keyCode == 190){}else return false; "
            name="pswd"
            required=""
            style="
    background-color: #e5e5e5;width: 94%;margin-left: 11px;font-size: 4.1vmin;
"
          />
          <div class="valid-feedback">Valid.</div>
          <div
            style="font-size: 4.2vmin; width: 100%; margin-top: 0.25rem; color: rgb(220, 53, 69); display: none;"
            name="error"
          >
            Provide your name with <strong>Initial</strong>.
          </div>
        </div>

        <div style="">
          <button
            style=" display: inline-block;float: left;font-size: 6.3vmin;padding-top:0px;margin: 10px;margin-left: 21px;/* margin-bottom: -22px; *//*display: inline-block;*//* padding: 20px; */width: 26vmin;height: 12vmin;"
            type="submit"
            onclick="event.preventDefault();formSubmit()"
            class="btn btn-primary "
          >
            Submit
          </button>
          <div
            style="display: none !important;margin-left: 7vmin;margin-top: 10px;display: inline-block;float: left;"
            class="loader"
          ></div>
          <div
            class="pleaseWait"
            style="
        display: none !important;font-size: 5.5vmin;
    padding-left: 53vmin;
    padding-top: 17px;
"
          >
            Please Wait...
          </div>
        </div>
      </form>
    </div>

    <div>
      <button
        style=" display: inline-block;font-size: 6.3vmin;padding-top:0px;margin: 10px;margin-left: 2.5%;width:95%;height: 12vmin;"
        onclick="event.preventDefault();window.location.replace('https://manasan3010.000webhostapp.com/result.php')"
        class="btn btn-info btn-block "
      >
        View Data
      </button>
    </div>
  </body>
</html>
