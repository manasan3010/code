<!-- Cousetro Example

https://codepen.io/designcourse/pen/OrOZop

 -->

<style>
    body {
        margin: 0;
        font-size: 100px;
    }

    .parallax-wrapper {
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        overflow: hidden;
        background: no-repeat center/ cover url(http://unsplash.it/300/300)
    }

    .content {
        width: 60%;
        margin: auto;
        height: fit-content;
        float: left;
        font-size: 40px;
        background: #808080bf;
        overflow: hidden;
        transform: rotate(-10deg) scale(2);
    }

    .content div {
        transform: rotate(10deg) scale(0.5);
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


<div class="parallax-wrapper">
    <div class="content">
        <div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque quidam </div>
    </div>
</div>




<div>Lorem ipsum dolor sit amet, te sumo fuisset vix, no per qualisque iracundia interesset. Quo ad facer nostro blandit. Blandit voluptua ad eam, sea ut idque </div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

<script>
    $(window).scroll(() => {
        // console.log(event)
        for (i in [0]) {
            scrollOffset = $(".parallax-wrapper").eq(i).offset().top - $(window).scrollTop()
            console.log(scrollOffset)
            if (scrollOffset <= 0) {
                $('.parallax-wrapper').eq(i).css({
                    transform: `translateY(${-scrollOffset}px)`
                })


                return;
                if ($('.main').eq(i).height() + $(".parallax-wrapper").eq(i).offset().top - $(window).scrollTop() - window.innerHeight <= 0) {
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
                return;
                $('.d2').eq(i).css({
                    position: 'unset'
                })
            }
        }
    })
</script>






































<!-- 
<style>
    
    html {
    overflow: hidden;
}
body {
    margin: 0;
    font-size: 26px;
    color:black;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: #ffffff;
    height: 100vh;
    perspective: 1px;
    transform-style: preserve-3d;
    overflow-x:hidden;
    overflow-y:auto;
}
.parallax-wrapper {
    width: 100vw;
    height:100vh;
    padding-top:20vh;
    margin-bottom: 100vh;
    box-sizing: border-box;
    transform-style: preserve-3d;
}
.parallax-wrapper::before {
    content:"";
    width: 100vw;
    height: 100vh;
    top:0;
    left:0;
    background: no-repeat center /cover  url("http://unsplash.it/300/300?1");
    /* filter: blur(9px); */
    position: absolute;
    z-index: -1;
    transform:translateZ(-1px) scale(2);
}
.regular-wrapper {
    width: 100vw;
    height:100vh;
    padding-top:20vh;
    background: no-repeat center /cover  url("http://unsplash.it/300/300");
    z-index: 2;
    position: relative;
}
.content {
    margin: 0 auto;
    padding: 50px;
    width: 50%;
    background: #aaa;
}

</style>

<body>
    
        <div class="parallax-wrapper">
            <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   ....
                   .... 
                   Donec in justo eu ligula semper consequat sed a risus.</p>
            </div>
        </div>
        <div class="parallax-wrapper">
            <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   ....
                   .... 
                   Donec in justo eu ligula semper consequat sed a risus.</p>
            </div>
        </div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt obcaecati alias, dolore iusto doloremque, aspernatur repellendus consequuntur eveniet culpa suscipit aut quos minima id, inventore officia similique nostrum dolor fugiat. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum ullam dolorem eum amet facilis! Tempore qui nam recusandae cumque. Molestiae nihil ex modi ea consectetur eius soluta mollitia numquam nisi.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt obcaecati alias, dolore iusto doloremque, aspernatur repellendus consequuntur 
</body> -->