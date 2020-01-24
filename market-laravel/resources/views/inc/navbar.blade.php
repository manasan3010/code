<style>
	#search-field {
		color: black;
		font-family: roboto;
		font-size: 20px;
		font-weight: 300;
		height: 35px;
		padding-left: 10px;
		padding-right: 60px;
		width: 155px;
		border-width: medium;
		border-style: none;
		border-color: initial;
		border-image: initial;
		outline: none medium;
		background: rgb(240, 240, 233);
	}

#search-field:focus {
		width: 350px;
	}

@media (max-width:800px){
	#search-field:focus {
		width: 90vw; */
	}
}

	.pull-right span{

	position: absolute;
    top: 0px;
    right: 12px;
    width: 36px;
    height: 35px;
	cursor:pointer;
    background: url(../images/home/searchicon.png) no-repeat center;
    background-size: 21px;
    background-color: #ffca2b;
	}

	#search-field:not(:focus) + span:before {
    content: '...';
    POSITION: relative;
    font-size: 21px;
    right: 22px;
    top: 2.4px;
}
</style>

<header id="header">
	<!--header-->
	<!--header_top-->

	<!-- <div class="header_top">		
		<div class="container">
			<div class="row">
				<div class="col-sm-6">
					<div class="contactinfo">
						<ul class="nav nav-pills">
							<li><a href="#"><i class="fa fa-phone"></i> +2 95 01 88 821</a></li>
							<li><a href="#"><i class="fa fa-envelope"></i> info@domain.com</a></li>
						</ul>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="social-icons pull-right">
						<ul class="nav navbar-nav">
							<li><a href="#"><i class="fa fa-facebook"></i></a></li>
							<li><a href="#"><i class="fa fa-twitter"></i></a></li>
							<li><a href="#"><i class="fa fa-linkedin"></i></a></li>
							<li><a href="#"><i class="fa fa-dribbble"></i></a></li>
							<li><a href="#"><i class="fa fa-google-plus"></i></a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div> -->

	<!--/header_top-->

	<div class="header-middle">
		<!--header-middle-->
		<div class="container">
			<div class="row">
				<div class="col-md-4 clearfix">
					<div class="logo pull-left">
						<a href=""><img src="images/home/logo.png" alt="" /></a>
					</div>
					<!-- <div class="btn-group pull-right clearfix">
							<div class="btn-group">
								<button type="button" class="btn btn-default dropdown-toggle usa" data-toggle="dropdown">
									USA
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu">
									<li><a href="">Canada</a></li>
									<li><a href="">UK</a></li>
								</ul>
							</div>

							<div class="btn-group">
								<button type="button" class="btn btn-default dropdown-toggle usa" data-toggle="dropdown">
									DOLLAR
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu">
									<li><a href="">Canadian Dollar</a></li>
									<li><a href="">Pound</a></li>
								</ul>
							</div>
						</div> -->
				</div>
				<div class="col-md-8 clearfix">
					<div class="shop-menu clearfix pull-right">
						<ul class="nav navbar-nav">
							<li><a href="/account"><i class="fa fa-user"></i> Account</a></li>
							<li><a href="/wishlist"><i class="fa fa-star"></i> Wishlist</a></li>
							<li><a href="/checkout"><i class="fa fa-crosshairs"></i> Checkout</a></li>
							<li><a href="/cart"><i class="fa fa-shopping-cart"></i> Cart</a></li>
							<li>
								@if(Auth::User())
								<a href="/logout"><i class="fa fa-sign-out"></i> Logout</a>
							
								@else
								<a href="/login"><i class="fa fa-lock"></i> Login/Singup</a>
								@endif
							
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!--/header-middle-->

	<div class="header-bottom">
		<!--header-bottom-->
		<div class="container">
			<div class="row">
				<div class="col-sm-9">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div class="mainmenu pull-left">
						<ul class="nav navbar-nav collapse navbar-collapse">
							<li><a href="" class="active">Home</a></li>
							<li class="dropdown"><a href="#">Shop<i class="fa fa-angle-down"></i></a>
								<ul role="menu" class="sub-menu">
									<li><a href="shop.html">Products</a></li>
									<li><a href="product-details.html">Product Details</a></li>
									<li><a href="checkout.html">Checkout</a></li>
									<li><a href="cart.html">Cart</a></li>
									<li><a href="login.html">Login</a></li>
								</ul>
							</li>
							<li class="dropdown"><a href="#">Blog<i class="fa fa-angle-down"></i></a>
								<ul role="menu" class="sub-menu">
									<li><a href="blog.html">Blog List</a></li>
									<li><a href="blog-single.html">Blog Single</a></li>
								</ul>
							</li>
							<li><a href="404.html">404</a></li>
							<li><a href="/contact">Contact</a></li>
						</ul>
					</div>
				</div>
				<div class="col-sm-3">
					<div class="top-search-div pull-right">
						<form action="/search" id="search-form">
						<input autocomplete="off" autocapitalize="on" style="" class="" name="q" type="text" id="search-field" placeholder="Search For Products" />
						<span onclick="$('#search-form').submit()" style=""></span>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!--/header-bottom-->
</header>
<!--/header-->