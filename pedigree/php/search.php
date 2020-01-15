<?php
require 'navbar.php';
require 'get_data.php';
ob_clean();
print_r("<script> data = $data; </script>");

if (isset($_SESSION['user'])) {
    print_r("<script> isEditVisible = true; </script>");
} else {
    print_r("<script> isEditVisible = false; </script>");
}
?>
<base target="_blank">
<style>
    #pigeons tr.odd {
        background: #c3c3bd73 !important;
    }

    #pigeons tr:hover {
        background: #b4bcc0 !important;
    }

    .ui-dialog .ui-dialog-titlebar-close {
        height: 30px;
        width: 30px;
        top: 40%;
        background: #f33434;
        margin-right: 10px;
    }

    .ui-widget-header .ui-icon {
        background-image: url(https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons_444444_256x240.png);

    }

    .ui-dialog-content.ui-widget-content {
        padding: 0;
    }

    #dialog_wrapper>div>div {
        /* border: 2px black solid; */
        float: left;
        word-wrap: break-word;
        height: 96%;
        margin: 10px;
        padding: 7px;
    }

    #base_level,
    #level_1>div,
    #level_2>div {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #level_2>div:nth-child(2),
    #level_2>div:nth-child(3) {
        justify-content: start;
    }


    a {
        /* color: blue !important; */
    }

    .hoveredDiv {
        background-color: #b0bec5;
    }

    #loading {
        position: fixed;
        width: 100vw;
        height: 100vh;
        margin-top: -44px;
        background: #fff url('loader.gif') no-repeat center center;
        z-index: 9999;
        background-size: 45%;
    }

    .dataTables_scrollHeadInner {
        margin: auto;
        padding-right: 0px !important;
    }

    .dataTables_scrollBody {
        max-height: 0px;
    }

    body {
        height: 100%;
    }
</style>

<script>
    bodyHeight = $('body').height();
    bodyWidth = $('body').width();



    $(document).ready(function() {

        // $.post("get_data.php")
        //     .done(function(dataR) {
        //         window.data = JSON.parse(dataR);
        //         console.log(data);

        table = $('#pigeons').DataTable({

            data: data,
            scrollX: true,
            // scrollY: "58vh",
            // pageResize: true,
            scrollCollapse: true,
            order: [
                [2, "desc"]
            ],
            columns: [{
                data: 'p_image',
                visible: true,
                render: function(data, type, full, meta) {
                    return `<img alt="No Image" style="width:50px;height:50px" src='../uploads/${data}' >`;
                }
            }, {
                data: 'ring',
                render: function(data, type, full, meta) {
                    return `<button class="btn btn-info" onclick='event.stopPropagation(); $("#view_wrapper").dialog("open");viewDialog("${data}"); ' >View</button>`;
                }
            }, {
                data: 'ring',
                visible: isEditVisible,
                render: function(data, type, full, meta) {
                    return `<button class="btn btn-danger" onclick='event.stopPropagation();if(typeof logged_in != "undefined"){window.location="login.php";} $("#edit_wrapper").dialog("open");editDialog("${data}"); ' >Edit</button>`;
                }
            }, {
                data: 'ring'
            }, {
                data: 'name'
            }, {
                data: 'created_date'
            }, {
                data: 'sex',
                visible: false
            }, {
                data: 'description',
                visible: false
            }, {
                data: 'color',
                visible: false
            }, {
                data: 'breeder',
                visible: false
            }, {
                data: 'owner',
                visible: false
            }, {
                data: 'owner_add_1',
                visible: false
            }, {
                data: 'owner_add_2',
                visible: false
            }, {
                data: 'country',
                visible: false
            }, {
                data: 'performance',
                visible: false
            }, {
                data: 'father',
                visible: false
            }, {
                data: 'mother',
                visible: false
            }, {
                data: 'file',
                visible: false,
            }, {
                data: 'p_image',
                visible: false,
            }, {
                data: 'a_image',
                visible: false,
            }]
        });

        maxH = $('body').height() -
            $("div.fg-toolbar.ui-toolbar.ui-widget-header.ui-helper-clearfix.ui-corner-bl.ui-corner-br").offset().top - $('div.fg-toolbar.ui-toolbar.ui-widget-header.ui-helper-clearfix.ui-corner-bl.ui-corner-br').outerHeight();

        // console.log($('body').height(), $("div.fg-toolbar.ui-toolbar.ui-widget-header.ui-helper-clearfix.ui-corner-bl.ui-corner-br").offset().top, $('div.fg-toolbar.ui-toolbar.ui-widget-header.ui-helper-clearfix.ui-corner-bl.ui-corner-br').outerHeight(), maxH);

        $('.dataTables_scrollBody').css('max-height', maxH);

        $('#loading').fadeOut(100);
        // })

        // $('#pigeons').wrap('<div id="wrapper" style="overflow:auto;"></div>');


        // console.log(createDic('t_ere'));



        $('#pigeons').on('click', 'tbody tr', function() {
            row = table.row($(this)).data();
            // console.log(row, 111);
            // console.log(table.row($(this)).data());
            pedigree(row);

            $("#dialog_wrapper").dialog("open");

        })

        $("#dialog_wrapper").dialog({
            title: 'Pedigree view',
            height: bodyHeight,
            width: bodyWidth,
            autoOpen: false,
            position: {
                my: "left top",
                at: "left top"
            },

        });

        $("#edit_wrapper").dialog({
            title: 'Edit Pigeon',
            height: bodyHeight,
            width: bodyWidth,
            autoOpen: false,
            position: {
                my: "left top",
                at: "left top"
            },

        });

        $("#view_wrapper").dialog({
            title: 'View Pigeon',
            height: bodyHeight,
            width: bodyWidth,
            autoOpen: false,
            position: {
                my: "left top",
                at: "left top"
            },

        });


        <?php require 'dialog_pedigree.js'; ?>

        $('#dialog_wrapper').on('click', 'div[id^=level_]>div', function() {
            h_text = $(this).find('h4,h5').text();
            if (h_text) {
                row = {};
                row['ring'] = h_text;
                // console.log(row);
                pedigree(row);
                console.log(h_text);
            }
        });
        $('#dialog_wrapper').on('mouseenter mouseleave', 'div[id^=level_]>div', function() {
            if ($(this).find('h4,h5').text()) {
                $(this).toggleClass('hoveredDiv');
            }
        });



    });

    function createDic(value) {
        // console.log(value);
        return {
            ring: value,
            father: (function() {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['ring'] == value && data[i]['father']) {
                        return createDic(data[i]['father']);
                    }
                    if (i == data.length - 1) {
                        return false;
                    }
                }
            })(),

            mother: (function() {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['ring'] == value && data[i]['mother']) {
                        return createDic(data[i]['mother']);
                    }
                    if (i == data.length - 1) {
                        return false;
                    }
                }
            })()
        };
    }

    function findDic(ring) {
        for (i in data) {
            if (data[i]['ring'] == ring) return data[i];
        }
    }

    function redrawTable() {

        $.post("get_data.php")
            .done(function(dataR) {
                // console.log(dataR);
                window.data = JSON.parse(dataR);

                var datatable = $('#pigeons').DataTable();
                datatable.clear();
                datatable.rows.add(data);
                datatable.draw();
                console.log(data);
            })
    }


    function createPDF() {

        // $('#getpdf').hide();
        html2canvas(document.querySelector("#dialog_wrapper>div")).then(canvas => {
            $('#dialog_wrapper canvas').remove();
            document.querySelector("#dialog_wrapper").appendChild(canvas);
            $('#dialog_wrapper canvas').hide();
            // createPDF(canvas);


            var doc = new jsPDF('l', 'mm', 'a4');
            if ($('canvas').width() > $('canvas').height()) {
                cw = 200;
                ch = 180;
            } else {
                cw = 180;
                ch = 190;
            }
            // console.log(cw, ch);

            doc.addImage(canvas, 'JPEG', 10, 10, cw, ch, 'monkey');
            // doc.addImage('monkey', 70, 10, 100, 120); // use the cached 'monkey' image, JPEG is optional regardless

            doc.save(`pedigree-${ringSet['ring']}.pdf`);
            // $('#getpdf').show();

            // doc.output('datauri');
            // var string = doc.output('datauristring');
            // $('#getpdf').wrap('<a href="' + string + '" download="DownloadPDF"><\a>');
            // document.getElementById('obj').data = doc.output("datauristring");
            // var iframe = "<iframe width='100%' height='100%'  src='" + string + "'></iframe>"
            // var x = window.open('', '', 'height=400,width=800');
            // x.document.open();
            // x.document.write(iframe);
            // x.document.close();

        });
    }
</script>


<table id="pigeons" class="" style="">
    <thead>
        <tr>
            <th>Image</th>
            <th>View</th>
            <th>Edit</th>
            <th>ring</th>
            <th>name</th>
            <th>Date_Updated</th>
            <th>sex</th>
            <th>description</th>
            <th>color</th>
            <th>breeder</th>
            <th>owner</th>
            <th>owner_add_1</th>
            <th>owner_add_2</th>
            <th>country</th>
            <th>performance</th>
            <th>father</th>
            <th>mother</th>
            <th>PEDIGREE File</th>
            <th>P_Image</th>
            <th>A_Image</th>

        </tr>
    </thead>
</table>
<!-- <div style="height:2000px;width:2000px;"></div> -->

<div id="dialog_wrapper" class="" style="overflow:auto;">
    <div style="float: left;display: flex;">

    </div>
</div>

<div id="loading"></div>

<div id="view_wrapper" class="" style="">
    <div style="padding-bottom:220px;">
        <?php require 'view.php'; ?>
    </div>
</div>
<div id="edit_wrapper" class="" style="">
    <div style="">
        <?php require 'edit.php'; ?>
    </div>
</div>