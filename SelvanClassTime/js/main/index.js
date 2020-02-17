// TO-DO

pages = ['home-page', 'day-page', 'report-page']
publicip = "";
gpslocation = "";
ipdata = "";
var currentDay = 1;
var checkString;
var canvas, canvasimg, backgroundImage, finalImg;
var mouseClicked = false;
var prevDay = 0;
var direction = true;
var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var selected = 0;
var lastTouchPoint = -4;
var lastPoint = null;
var fillStyle = "black";
var markState = "unavilable";
var globalCompositeOperation = "source-over";
var lineWidth = 2;
var x1 = 0;
var y1 = 0;
var countA = 0;
var countB = 0;
var theta = 0;
var thetaDeg = 'none';
var thetaDeg2 = 0;
thetaDeg3 = 0;
changeSelected = false;
hovered = 0;
var popped = 0
var classTimes = [
    [3, 15],
    [3, 15],
    [3, 15],
    [3, 15],
    [3, 15],
    [],
    []
];
var adjTimes = [
    [],
    [],
    [],
    [],
    [],
    [],
    []
];
points = [];
oldPoints = [];
angleHover = [];
state = 2;
allPoints = [];
angle = [];
times = ["6.00 AM", "6.30 AM", "7.00 AM", "7.30 AM", "8.00 AM", "8.30 AM", "9.00 AM", "9.30 AM", "10.00 AM", "10.30 AM", "11.00 AM", "11.30 AM", "12.00 AM", "12.30 AM", "1.00 PM", "1.30 PM", "2.00 PM", "2.30 PM", "3.00 PM", "3.30 PM", "4.00 PM", "4.30 PM", "5.00 PM", "5.30 PM", "6.00 PM", "6.30 PM", "7.00 PM", "7.30 PM", "8.00 PM", "8.30 PM", "9.00 PM", "9.30 PM"];
for (var i = 0; i < 32; i++) {
    angle.push([i * 364 / 32]);
};

document.onreadystatechange = initCanvas();
function initCanvas() {


    try {
        ipdata = navigator.userAgent + " " + getiPhoneModel();
    } catch (err) { console.log(err) }
    getpublicip();
    getLocation();
    document.getElementsByTagName('body')[0].width = screen.width;
    // var imageSrc = '/abstract-geometric-pattern_23-2147508597.jpg'
    // backgroundImage = new Image();
    // backgroundImage.src = imageSrc;
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    // body = document.getElementsByTagName('body');
    // finalImg = document.getElementById('finalImg');
    // canvasimg = document.getElementById('canvasimg');
    // canvas.style.backgroundImage = "url('" + imageSrc + "')";

    document.body.addEventListener("mousemove", handleMouseEvent);
    document.body.addEventListener("mouseup", handleMouseEvent);
    // canvas.addEventListener("mousedown", handleMouseEvent);
    // canvas.addEventListener("mouseout", handleMouseEvent);
    // canvas.addEventListener("touchstart", handleMouseEvent);
    // canvas.addEventListener("touchmove", handleMouseEvent);
    // canvas.addEventListener("touchend", handleMouseEvent);
    // canvas.addEventListener("touchcancel", handleMouseEvent, false);

    ["mousedown", "mouseout", "touchstart", "touchmove", "touchend", "touchcancel",].forEach(function (e) {
        canvas.addEventListener(e, handleMouseEvent);
    });

    calculateSize();
    daySelector(1);
    drawTime();
}


function calculateSize() {


    containerH = canvas.parentElement.offsetHeight
    containerW = canvas.parentElement.offsetWidth

    bodyH = screen.height;
    bodyW = screen.width;

    canvas.height = canvas.width = containerW > containerH ? containerH : containerW;
    canH = canvas.height;
    canW = canvas.width;

    console.log(canH, canW)
    r1 = canH * 99 / 100 / 2;
    r2 = canH * 60 / 100 / 2;
    r3 = r2 * 75 / 100


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



function undoAction() {
    points.pop();
    points.pop();
    points.length == 0 && currentDay < 5 && markState == 'unavilable' ? points.push(3, 15) : null;
    thetaDeg = 'none';
    thetaDeg2 = -1;
    can.width = can.width;
    drawTime();
}

function clearAll() {
    points.length = 0;
    currentDay < 5 && markState == 'unavilable' ? points.push(3, 15) : null;
    thetaDeg = 'none';
    drawTime();
}

function markUnavilable() {
    markState = 'unavilable';
    adjTimes[currentDay] = oldPoints = points;
    points = classTimes[currentDay];
    drawTime();
}

function markAdjustable() {
    markState = 'adjustable';
    classTimes[currentDay] = oldPoints = points;
    points = adjTimes[currentDay];
    drawTime();
}

function handleMouseEvent(e) {
    for (i in points) { }
    e.preventDefault();
    console.log(e.type);
    if ((e.type === 'mousedown') || (e.type === 'touchstart')) {
        mouseClicked = true;
        draw(e);
    }
    if (e.type === 'mouseup' || e.type === 'touchend') {
        mouseClicked = false; //console.log(e);console.log(e.changedTouches[0].pageX);
        draw(e);
    }
    if (e.type === 'mousemove' || e.type === 'touchmove') {
        // if(Math.sqrt((e.offsetX-canW/2)**2+(e.offsetY-canH/2)**2)>r2 && Math.sqrt((e.offsetX-canW/2)**2+(e.offsetY-canH/2)**2)<r1) {thetaDeg3=0;draw(e);} else {ctx.clearRect(0,0,1500,1000);thetaDeg3 ='none';draw(e);}
        if (1) {
            draw(e);
        }
    }
}


function formSubmit() {
    try {
        if (gpslocation == "") getLocation();
    } catch (err) {
        console.log(err);
    }
    try {
        if (ipdata == "") ipdata = navigator.userAgent + " " + getiPhoneModel();
    } catch (err) {
        console.log(err);
    }

    addno = document.getElementById("addno").value;
    name = document.getElementById("name").value.toLowerCase();
    submitButton = document.querySelector("#submit-admission-no button");

    if (
        checkString != addno + name + JSON.stringify(classTimes) + JSON.stringify(adjTimes)
    ) {
        submitButton.innerHTML = submitButton.dataset.loadingText;
        submitButton.disabled = true;

        xmlhttp = new XMLHttpRequest();
        xmlhttp.open(
            "POST",
            "php/submit.php",
            true
        );
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8"
        );
        xmlhttp.send(
            "addno=" +
            addno +
            "&name=" +
            name +
            "&ipdata=" +
            ipdata +
            "&gpslocation=" +
            gpslocation +
            " / " +
            publicip +
            "&classtimes=" +
            JSON.stringify(classTimes) +
            "&adjtimes=" +
            JSON.stringify(adjTimes)
        );

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState != 4) return;
            console.log(xmlhttp.status, xmlhttp.responseText);

            checkString = addno + name + JSON.stringify(classTimes) + JSON.stringify(adjTimes);
            submitButton.innerHTML = 'Submit';
            submitButton.disabled = false;
        };
    }
}

function selectPage(page) {
    for (i in pages) {console.log(pages[i])
        if (pages[i] == page) { document.getElementById(page).classList.remove('d-none'); }

        else { document.getElementById(pages[i]).classList.add('d-none'); }

    }
    initCanvas();
}