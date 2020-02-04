<?php
?>

<style>
    body {
        margin: 0;
        font-size: 100px;
    }

    .main {
        overflow: auto;
        position: relative;
    }

    div.d1 {
        width: 50%;
        /* height: 100%; */
        float: left;
        background: red;
        /* overflow: hidden; */
    }

    div.d2 {
        width: 50%;
        height: 100vh;
        float: left;
        background: blue;
        overflow: hidden;
        /* position: fixed; */
        right: 0;
        bottom: 0;
    }

    div.d1>div {
        width: 90%;
        background: #bbb;
        margin: auto;
    }

    div.d2 img {
        width: 100%;
        height: 100%;
        background: lightblue;
        margin: auto;
        /* transform: translateY(calc(100vh - 100%)); */
    }
</style>

<div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque .</div>


<div class="main">
    <div class="d1">
        <div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque quidam </div>
    </div>
    <div class="d2">
        <div><img src="http://unsplash.it/300/300?1" alt=""> </div>
    </div>
</div>

<div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque .</div>


<div class="main">
    <div class="d1">
        <div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque quidam </div>
    </div>
    <div class="d2">
        <div><img src="http://unsplash.it/300/300?2" alt=""></div>
    </div>
</div>



<div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque </div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

<script>
    $(window).scroll(() => {
        // console.log(event)
        for (i in [0, 1]) {
            if ($(".d1").eq(i).offset().top - $(window).scrollTop() <= 0) {
                if ($('.main').eq(i).height() + $(".d1").eq(i).offset().top - $(window).scrollTop() - window.innerHeight <= 0) {
                    $('.d2').eq(i).css({
                        position: 'absolute',
                        bottom: 0
                    })
                } else {
                    $('.d2').eq(i).css({
                        position: 'fixed'
                    })
                }
            } else {
                $('.d2').eq(i).css({
                    position: 'unset'
                })
            }
        }
    })
</script>