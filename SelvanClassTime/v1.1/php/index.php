<html>

    <head>

        <title>PHP MVC Frameworks - Search Engine</title>

        <script type="text/javascript" src="auto_complete.js"></script>

    </head>

    <body>

        <h2>PHP MVC Frameworks - Search Engine</h2>

        <p><b>Type the first letter of the PHP MVC Framework</b></p>

        <form method="POST" >

            <p><input type="text" size="40" id="txtHint"  onkeyup="showName(this.value)"></p>

        </form>

        <p>Matches: <span id="txtName"></span></p>

    </body>

</html>




<script>
    function showName(str){

    if (str.length == 0){ //exit function if nothing has been typed in the textbox

        document.getElementById("txtName").innerHTML=""; //clear previous results

        return;

    }

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari

        xmlhttp=new XMLHttpRequest();

    } else {// code for IE6, IE5

        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

    }

    xmlhttp.onreadystatechange=function() {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){

            document.getElementById("txtName").innerHTML=xmlhttp.responseText;

        }

    }

    // xmlhttp.open("GET","frameworks.php?name="+str,true);

    // xmlhttp.send();
xmlhttp.open("POST", 'frameworks.php' , true);
xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
xmlhttp.send("name=rt&aertss=blertack");

}
</script>
