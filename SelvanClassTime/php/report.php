<?php
require_once 'db.php';
?>

<html>

<head>
  
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>


  <script type="text/javascript">  

    times = ["6.00 AM", "6.30 AM", "7.00 AM", "7.30 AM", "8.00 AM", "8.30 AM", "9.00 AM", "9.30 AM", "10.00 AM", "10.30 AM", "11.00 AM", "11.30 AM", "12.00 AM", "12.30 AM", "1.00 PM", "1.30 PM", "2.00 PM", "2.30 PM", "3.00 PM", "3.30 PM", "4.00 PM", "4.30 PM", "5.00 PM", "5.30 PM", "6.00 PM", "6.30 PM", "7.00 PM", "7.30 PM", "8.00 PM", "8.30 PM", "9.00 PM", "9.30 PM"];
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    var mainClassTime = {};
    var mainAdjTime = {};
    var lTimes;

    function allPointsStart(arr) {
      allPoints = [];
      for (var i = 0; i < arr.length; i++) {
        if (i % 2 == 0) {
          var fillFirstAngle = arr[i];
        }

        if (i % 2 == 1) {

          for (var b = fillFirstAngle; b < arr[i]; b++) {
            allPoints.push(b);
          }
          //;console.log(allPoints);
        }
      }
    }

    function jsClass(arr) {
      console.log(arr);
      for (var a = 0; a < arr.length; a++) {
        allPointsStart(arr[a]); //console.log(allPoints);
        for (var c = 0; c < allPoints.length; c++) {
          if (mainClassTime[a] == undefined) {
            mainClassTime[a] = {};
          }
          if (mainClassTime[a][allPoints[c]] == undefined) {
            mainClassTime[a][allPoints[c]] = 1;
          } else {
            mainClassTime[a][allPoints[c]]++;
          }
          // console.log(mainClassTime[a]);
        }
        for (var d = 0; d < 31; d++) {
          if (mainClassTime[a] == undefined) {
            mainClassTime[a] = {};
          }
          if (mainClassTime[a][d] == undefined) {
            mainClassTime[a][d] = 0;
          }
        }
      }
      console.log(mainClassTime)
    }

    function jsAdj(arr) {
      // console.log(arr);
      for (var a = 0; a < arr.length; a++) {
        allPointsStart(arr[a]); //console.log(allPoints);
        for (var c = 0; c < allPoints.length; c++) {
          if (mainAdjTime[a] == undefined) {
            mainAdjTime[a] = {};
          }
          if (mainAdjTime[a][allPoints[c]] == undefined) {
            mainAdjTime[a][allPoints[c]] = 1;
          } else {
            mainAdjTime[a][allPoints[c]]++;
          }
        }
        for (var d = 0; d < 31; d++) {
          if (mainAdjTime[a] == undefined) {
            mainAdjTime[a] = {};
          }
          if (mainAdjTime[a][d] == undefined) {
            mainAdjTime[a][d] = 0;
          }
        }
      }
    }
    const range = (a, b) => Array.from(new Array(b > a ? b - a : a - b), (x, i) => b > a ? i + a : a - i);

    function jsRender() {
      console.log("JS Render Called");
      // for(let i=0;i<5;i++){ 
      // for(let o=3;o<15;o++){ mainClassTime[i][o]="";} }
      if (lTimes == undefined || lTimes == null || lTimes < 1 || lTimes == '') {
        lTimes = 0;
        for (let i = 0; i < 7; i++) {
          if (i < 5) {
            for (let o = 3; o < 15; o++) {
              mainClassTime[i][o] = "";
            }
          }
          lTimes = Math.max(lTimes, mainClassTime[i][Object.keys(mainClassTime[i]).reduce(function(a, b) {
            return mainClassTime[i][a] > mainClassTime[i][b] ? a : b
          })], mainAdjTime[i][Object.keys(mainAdjTime[i]).reduce(function(a, b) {
            return mainAdjTime[i][a] > mainAdjTime[i][b] ? a : b
          })]);

        }
      }
      table = '<table style="margin-top:6vh;">'

      table += '<tr>'
      for (let o = 0; o < 32; o++) {
        if (o == 0) {
          table += '<td><div style="width: 50px;height: 10vh;min-height:35px;max-height:50px;background-image: repeating-linear-gradient(-45deg,white,white 5px,black 5px,black  10px);"></div> </td>';
        }
        table += '<td><div style="font-weight: bold;background-color: #e0ab00;width: 50px;height: 10vh;min-height:35px;max-height:50px;">' + times[o] + '</div> </td>';

      }
      table += '</tr>';

      for (var i = 0; i < 7; i++) {
        table += '<tr style="border-right: 25px solid #a7a7a7;" >'
        for (var o = 0; o < 31; o++) {
          if (o == 0) {
            table += '<td class="tdstatic" rowspan=2  style=\"position: fixed;font-size: 20;font-weight: bold;line-height: 9vh;\" ><div style=\"width: 50px;height: 16.1vh;background-color:#a7a7a7;margin-top: -1px;\">' + days[i] + '</div> </td>';
          }
          if (i < 5 && (o > 2 && o < 15)) {
            table += '<td><div style=\"width: 50px;height: 5vh; background-image: repeating-linear-gradient(-45deg,transparent,transparent 5px,black 5px,black  10px);\"></div> </td>';
          } else {
            table += '<td><div style=\"border-left:solid black 2px;border-bottom:solid black 2px;border-TOP:solid black 2px;width: 50px;line-height: 5vh;height: 5vh;background-color:rgba(172, 16, 16, ' + mainClassTime[i][o] / lTimes + ');\">' + mainClassTime[i][o] + '</div> </td>';
          }

        }
        table += '</tr>';
        table += '<tr style="padding-bottom: 5vh;border-bottom: 3vh solid #a7a7a7;border-right: 25px solid #a7a7a7;">';
        for (var o = 0; o < 31; o++) {
          if (o == 0) {
            table += '<td><div style="width: 50px;height: 5vh;\"></div> </td>';
          }
          table += '<td><div style="border-left:solid black 2px;border-bottom:solid black 2px;width: 50px;line-height: 5vh;height: 5vh;background-color:rgba(24, 109, 182, ' + mainAdjTime[i][o] / lTimes + ');\">' + mainAdjTime[i][o] + '</div> </td>';

        }
        table += '</tr>'

      }
      table += '</table>'
      document.getElementById("content").innerHTML = table;



      $(document).ready(() => {
        var divs = document.getElementsByTagName('div');
        // divs[divs.length - 1].style.display = 'none';
        $('tr').find('div:last').css('border-right', '2px solid ');
        $('tr:first').find('div:last').css('border-right', '0px solid ');
        $('tr:first').css({
          'position': 'absolute',
          'top': '0px',
          'z-index': '2',
          'left': '-25px'
        })

        $(window).scroll(function(event) {
          $(".tdstatic").css("margin-top", 0 - $('body').scrollTop());

          $('tr:first').css({
            'top': $(window).scrollTop()
          });
        });
        $(window).scroll();
        $('table').css('margin-top', $('tr').height())


        document.getElementById("hr").width = document.getElementsByTagName("html")[0].scrollWidth;
        $(' td.tdstatic > div').css('box-shadow', 'rgb(76, 75, 75) 12px 0px 11px -3px');
        $('tr:first ').css('box-shadow', 'rgb(51, 51, 51) 0px 10px 20px -1px')
      })

    }
  </script>
</head>




<body>
  <div id="header">

  </div>
  <div id="side">

  </div>
  <div id="content">

  </div>

  <div>
    <!-- <input style="margin:40 20 20 20;background: rgb(229, 229, 229); display: inline-block; width: auto; font-size: 3.5vmin;" autocomplete="off" placeholder="No. to Normalize Data" type="number" onkeydown="     
    if((parseInt(this.value + String.fromCharCode(event.keyCode))>=0&amp;&amp;parseInt(this.value + String.fromCharCode(event.keyCode))>=0)||event.keyCode==8 ||parseInt(this.value + String.fromCharCode(event.keyCode))==''){if(event.keyCode!=190) {} else return false ;}else{return false ;}" class="form-control" id="normal" onkeyup="lTimes=this.value;jsRender();"> -->

<div style="height: 1600px"></div>
  </div>
</body>

</html>



<style type="text/css">
  #header {
    width: 100%;
    height: 0px;
    background-color: tomato;
  }

  #side {
    float: left;
    width: 10%;
    height: 0%;
    background-color: #a7a7a7;
  }

  #content {
    float: left;
    width: 90%;
    height: 100%;
    background-color: white;
    margin-bottom: 0px;
  }

  td {
    /*overflow: scroll;*/
    /*position: relative;*/
    color: black;
    /*border:2px solid black;*/
    padding: 0;


    text-align: center;
  }

  table {
    border-bottom: #a7a7a7 solid 6vh;
  }

  /* ::-webkit-scrollbar {
    width: 1em;
    height: 1em
}
::-webkit-scrollbar-button {
    background: #0d0c0c
}
::-webkit-scrollbar-track-piece {
    background: #eee
}
::-webkit-scrollbar-thumb {
    background: #888
}​*/
  @media (max-height: 410px) {
    table {
      font-size: 13px;
    }
  }

  @media (min-height: 588px) {
    table {
      font-size: 17px;
      font-weight: bold;
    }
  }

  @page {
    size: auto;
  }
</style>


<?php


$sql = "SELECT id, classtimes, adjtimes FROM classtable";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while ($row = $result->fetch_assoc()) {
    if (isset($row["classtimes"]) && $row["classtimes"] != "") {
      echo '<script type="text/javascript">',
        'jsClass(' . $row["classtimes"] . ');',
        'jsAdj(' . $row["adjtimes"] . ');',
        '</script>';
    }
  }
} else {
  echo '<h1 style="color:red;">No Entries Found</h1>';
}

$conn->close();
echo '<script type="text/javascript">',
  'jsRender();',
  '</script>';
?>

<script type="text/javascript" charset="utf-8" async defer>
  function deleteData() {
    $.getJSON(`delete.php?password=${prompt('Enter Secret Key: ')}`, data => {
      console.log(data)
    })
  }
</script>