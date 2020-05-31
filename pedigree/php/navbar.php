<?php
if (!isset($_SESSION)) {
    session_start();
}
?>

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Pedigree</title>

    <link rel="icon" href="favicon.png" />
    <script src="jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script> -->
    <!-- <script src="niceCountryInput.js"></script> -->
    <script src="dropDown.js"></script>
    <!-- <script src="http://html2canvas.hertzen.com/dist/html2canvas.min.js"></script> -->
    <!-- <script src="https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js"></script> -->
    <script src="html2canvas.min.js"></script>
    <script src="jspdf.min.js"></script>


    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/ju/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/datatables.min.css" />
    <script type="text/javascript" src="https://cdn.datatables.net/v/ju/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/datatables.min.js"></script>

    <!-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/sc-2.0.1/datatables.min.css" />
    <script type="text/javascript" src="https://cdn.datatables.net/v/bs4/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/sc-2.0.1/datatables.min.js"></script> -->

    <!-- <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.20/datatables.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.20/datatables.min.css" /> -->

    <link href="bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.11/css/bootstrap-select.min.css" rel="stylesheet" /> -->
    <link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
    <!-- <link rel="stylesheet" type="text/css" href="niceCountryInput.css"> -->
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">



</head>

<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <a class="navbar-brand" href="#" id="navbar_name">Pedigree</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
    </button>

    <ul class="navbar-nav collapse navbar-collapse" id="collapsibleNavbar">
        <?php
        if (isset($_SESSION['user'])) {
            echo '
        <li class="nav-item">
            <a href="add.php" target="_blank" class="btn btn-success" >Add Pigeon</a>
        </li>
        ';
        } ?>
        <!-- <li class="nav-item">
            <button class="btn btn-success " onclick=" window.open('view.php', '_blank'); ">View Pedigree</button>
        </li> -->
        <li class="nav-item">
            <a href="search.php" target="_blank" class="btn btn-success">Search for Pigeons</a>
        </li>
        <li class="nav-item " style="margin-left: auto;">
            <?php

            if (isset($_SESSION['user'])) {
                echo '<button class="btn btn-light" onclick="document.cookie = \'PHPSESSID\' +\'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;\';window.location=\'login.php\';">Log Out</button>';
            } else {
                echo '<button class="btn btn-warning" onclick=" window.location=\'login.php\';">Log In</button>';
            }
            ?>

        </li>
    </ul>
</nav>
<!-- <div style="height:56px;width:10px;"></div> -->

<style>
    .btn-success {
        margin: 0 10px;
    }

    @media (max-width: 580px) {
        .btn-success {
            margin: 5px 0px !important;
            width: 93vw;
        }
    }

    .navbar {
        width: 100%;
        /* position: absolute; */
    }
</style>

<script>
    // $(document).ready(function() {
    //     var leftOffset = parseInt($(".navbar").css('left'));

    //     $(window).scroll(function() {
    //         $('.navbar').css({
    //             'left': $(this).scrollLeft() + leftOffset
    //         });
    //         // console.log($(this).scrollLeft() + leftOffset);
    //     });
    // });
</script>