@extends('layouts.app')

@section('content')

<style>
    .add-to-cart {
        margin: 0px;
    }

    .top-search-div {
        display: none;
    }

    #search-field-2 {
        color: black;
        font-family: roboto;
        font-size: 23px;
        font-weight: 300;
        height: 45px;
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 50px;
        width: 80%;
        border-width: medium;
        border-style: none;
        border-color: initial;
        border-image: initial;
        outline: none medium;
        background: rgb(240, 240, 233);
    }


    .search-div span {
        position: absolute;
        top: 0px;
        width: 46px;
        height: 45px;
        cursor: pointer;
        background: url(../images/home/searchicon.png) no-repeat center;
        background-size: 21px;
        background-color: #ffca2b;
    }

    .productinfo img {}

    div.image-view {
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-color: #fff;
        background-image: url(/images/product-details/no-image.png);
        z-index: 9;
        height: 250px;
        width: 250px;
    }

    .no-result {
        margin-bottom: 25px;
    }

    .pagination li {
        background-color: #f0f0e9;
        border: 0;
        float: left;
        line-height: 1.42857;
        margin-left: -1px;
        padding: 6px 12px;
        position: relative;
        text-decoration: none;
        margin-right: 5px;
        color: #000;
        cursor: pointer;
        user-select: none;
    }

    .pagination li:hover {
        background-color: #FE980F;
        color: #000;
    }

    .pagination .active-page {
        background-color: #d07c00 !important;
    }

    @media (max-width:760px) {
        div.image-view {
            width: unset;
        }

        .header-bottom {
            position: absolute;
            right: -20px;
            top: 117px;
            z-index: 9;
        }

        .header-bottom button {
            height: 45px;
        }

        #search-field-2 {
            width: 70%;
            margin-right: 28%;
            padding-right: 7%;
        }

        .search-div span {
            right: 18%;
        }
    }
</style>


<section>
    <div class="container">
        <div class="row">
            <div class="col-sm-3">
                @if(0) @include('inc.sidebar') @endif
            </div>

            <div class="col-sm-9 padding-right">

                <div class="text-center search-div">
                    <form action="/search" id="search-form-2" onsubmit="searchFor();return false;">
                        <input oninput="searchFor();" autocomplete="off" autocapitalize="on" style="" class="" name="q" type="text" id="search-field-2" placeholder="Search For Products" value="{{ $query ?? ''}}">
                        <span onclick="searchFor();" style=""></span>
                    </form>
                </div>

                <h2 class="title text-center">Search Results</h2>
                <!--features_items-->
                <div class="features_items">


                    @if(0)
                    <div class="col-sm-4">
                        <a href="/product/">
                            <div class="product-image-wrapper">
                                <div class="single-products">
                                    <div class="productinfo text-center">
                                        <img src='
                                
                                ' alt="" />
                                        <h2></h2>
                                        <p></p>
                                        <div onclick="event.preventDefault();">
                                            <button id="" onclick="" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>

                                            <button type="button" onclick="" style="display:none;" class="btn btn-default add-to-cart" disabled>
                                                <img src="/images/product-details/loader.svg" alt="" style="width:19px;display: contents;">
                                                &nbsp;Please Wait...
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="choose">
                                    <ul class="nav nav-pills nav-justified">
                                        <li><a href="#"><i class="fa fa-plus-square"></i>Add to wishlist</a></li>
                                        <li><a href="#"><i class="fa fa-plus-square"></i>Add to compare</a></li>
                                    </ul>
                                </div>
                            </div>
                        </a>
                    </div>

                    @endif
                </div>
                <!--features_items-->

                <div style="float: right;padding-right: 30px;padding-bottom: 20px;">
                    <ul class="pagination">
                        <li class="active-page">1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                        <!-- <li><i class="fa fa-angle-double-right"></i></li> -->
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection

@section('self_script')

<script src="js/search.js"></script>

@endsection