<head>
    <title></title>
    <script type="text/javascript" src="jquery.min.js"></script>
    <script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>
    <script src="http://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>

    <script type="text/javascript">
        $(function() {
            $("#btnPrint").on("click", function() {
                // var divContents = $("#dvContainer").html();
                // var printWindow = window.open('', '', 'height=400,width=800');
                // printWindow.document.write('<html><head><title>DIV Contents</title>');
                // printWindow.document.write('</head><body >');
                // printWindow.document.write(divContents);
                // printWindow.document.write('</body></html>');
                // printWindow.document.close();
                // window.print();
            });

            html2canvas(document.querySelector("#form1")).then(canvas => {
                document.body.appendChild(canvas);
                createPDF(canvas);

            });

        });
        var getImageFromUrl = function(url, callback) {
            var img = new Image();

            img.onError = function() {
                alert('Cannot load image: "' + url + '"');
            };
            img.onload = function() {
                callback(img);
            };
            img.src = url;
        }


        var createPDF = function(imgData) {
            var doc = new jsPDF('l', 'mm', 'a4');
            if ($('canvas').width() > $('canvas').height()) {
                cw = 297;
                ch = $('canvas').height() * 297 / $('canvas').width()
            } else {
                ch = 210;
                cw = $('canvas').width() * 210 / $('canvas').height()
            }
            console.log(cw, ch);

            doc.addImage(imgData, 'JPEG', 10, 10, cw, ch, 'monkey');
            // doc.addImage('monkey', 70, 10, 100, 120); // use the cached 'monkey' image, JPEG is optional regardless



            // doc.output('datauri');
            var string = doc.output('datauristring');
            // $('body').append('<a href="' + string + '" download="DownloadPDF">Download PDF<\a>');
            // document.getElementById('obj').data = doc.output("datauristring");
            var iframe = "<iframe width='100%' height='100%'  src='" + string + "'></iframe>"
            var x = window.open('', '', 'height=400,width=800');
            x.document.open();
            x.document.write(iframe);
            x.document.close();
        }

        // getImageFromUrl('https://picsum.photos/id/1021/300/300', createPDF);
    </script>
</head>

<body>
    <form id="form1">
        <div id="dvContainer">
            <h1 style="color:red;"> This content needs to be printed.This content needs to be printed.This content needs to be printed.</h1>
            <img src="loader.gif" alt="">
        </div>
        <input type="button" value="Print Div Contents" id="btnPrint" />
    </form>


    <object id="obj" type="application/pdf"></object>
</body>

</html>