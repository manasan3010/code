@extends('layouts.app')

@section('content')

<?php ?>

<style>
	.subImg {
		cursor: pointer;
		max-width: 32% !important;
		max-height: 80px !important;
		margin: 0px 0px !important;

	}

	.addToCart {
		margin-bottom: 0px !important;
	}

	#zoomImg {
		position: fixed;
		display: none;
		background: url(/storage/image_files/{{$images[0]}}) center no-repeat;
		background-size: contain;
		background-color: #e6e6e6;
		height: 100%;
		Width: 100%;
		/* background:#e6e6e6; */
		z-index: 9;
		top: 0;
		user-select: none;

	}
</style>

<div onclick="$(this).hide()" id="zoomImg" style="">
	<div style="position: fixed;right: 24px;top: -25px;font-size: 90px;cursor:pointer;">×</div>
	<!-- <img src="/storage/image_files/{{$images[0]}}" alt="" style="
max-height: 100%;
max-width: 100%;
"> -->
</div>
<section>
	<div class="container">
		<div class="row">
			<div class="col-sm-3"></div>

			<div class="col-sm-9 padding-right">

				<div class="product-details">
					<!--product-details-->
					<div class="col-sm-5">
						<div class="view-product">
							<img id="mainImg" src='
                                @if(isset($images[0]))
                                    /storage/image_files/{{$images[0]}}
                                    @else /images/product-details/no-image.png
                                    @endif
                                ' alt="">
							<h3 onclick="$('#zoomImg').css('display','flex')" style="cursor:pointer;">ZOOM</h3>
						</div>
						<div id="similar-product" class="carousel slide" data-ride="carousel">

							@if(isset($images[0]))
							<!-- Wrapper for slides -->
							<div class="carousel-inner">
								<div class="item active">
									<img class="subImg" src="/storage/image_files/{{$images[0] ?? '' }}" alt="">
									<img class="subImg" src="/storage/image_files/{{$images[1] ?? '' }}" alt="">
									<img class="subImg" src="/storage/image_files/{{$images[2] ?? '' }}" alt="">
								</div>
								@if(isset($images[3]))
								<div class="item ">
									<img class="subImg" src="/storage/image_files/{{$images[3] ?? '' }}" alt="">
									<img class="subImg" src="/storage/image_files/{{$images[4] ?? '' }}" alt="">
									<img class="subImg" src="/storage/image_files/{{$images[5] ?? '' }}" alt="">
								</div>
								@endif
								@if(isset($images[6]))
								<div class="item">
									<img class="subImg" src="/storage/image_files/{{$images[6] ?? '' }}" alt="">
									<img class="subImg" src="/storage/image_files/{{$images[7] ?? '' }}" alt="">
									<img class="subImg" src="/storage/image_files/{{$images[8] ?? '' }}" alt="">
								</div>
								@endif
							</div>
							@endif

							<!-- Controls -->
							<a class="left item-control" href="#similar-product" data-slide="prev">
								<i class="fa fa-angle-left"></i>
							</a>
							<a class="right item-control" href="#similar-product" data-slide="next">
								<i class="fa fa-angle-right"></i>
							</a>
						</div>

					</div>
					<div class="col-sm-7">
						<div class="product-information">
							<!--/product-information-->
							<img src="images/product-details/new.jpg" class="newarrival" alt="">
							<h2>{{$item->name}}</h2>
							<p>Product ID: {{$item->id}}</p>
							<div style="width:80px;overflow: hidden;" class="rating">
								<img src="images/product-details/rating.png" alt="" style="width:80px"></div>
							<span>
								<span>LKR {{$item->price}}</span>
								<span>
									<label style="font-size: 22px;margin-right:0px">Quantity:</label>
									<input type="hidden" id="productId" value="{{$item->id}}">
									<input type="number" id="quantity" @if((Auth::User())) value='{{ json_decode(Auth::User()->cart, true)[$item->id] ?? 1  }}' @else value='1' @endif style="width: 80px;" min="0">

									<button type="button" class="btn btn-fefault cart addToCart">
										<i class="fa fa-shopping-cart"></i>
										@if((Auth::User()))
										@if(isset(json_decode(Auth::User()->cart, true)[$item->id]))
										Update cart
										@else
										Add to cart
										@endif
										@else
										Add to cart
										@endif
									</button>
									<button type="button" style="display:none;" class="btn btn-fefault cart addToCart" disabled>
										<img src="/images/product-details/loader.svg" alt="" style="width:19px">
										&nbsp;Please Wait
									</button>
									<button type="button" style="display:none;" class="btn btn-fefault cart addToCart" disabled>
										Added to Cart
									</button>

								</span>
							</span>
							<p><b>Availability: </b>{{$item->availability}}</p>
							<p><b>Brand: </b>{{$item->brand}}</p>
							<p><b>Made in: </b> {{$item->location}}</p>
							<a href=""><img src="images/product-details/share.png" class="share img-responsive" alt=""></a>
						</div>
						<!--/product-information-->
					</div>
				</div>
				<!--/product-details-->

				<div class="category-tab shop-details-tab">
					<!--category-tab-->
					<div class="col-sm-12">
						<ul class="nav nav-tabs">
							<li class="active"><a href="#details" data-toggle="tab">Details</a></li>
							<li><a href="#companyprofile" data-toggle="tab">Company Profile</a></li>
							<li><a href="#tag" data-toggle="tab">Tag</a></li>
							<li><a href="#reviews" data-toggle="tab">Reviews ({{\App\Comments::where('productId', $item->id )->count()}})</a></li>
						</ul>
					</div>
					<div class="tab-content">
						<div class="tab-pane fade active in" id="details">
							<div class="col-sm-12">
								<div class="product-image-wrapper">
									{{$item->description}}
								</div>
								<hr style="border-top: 1.5px solid #bbbbbb; margin-bottom:0px;">
							</div>
						</div>

						<div class="tab-pane fade" id="companyprofile">
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery1.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery3.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery2.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery4.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="tab-pane fade" id="tag">
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery1.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery2.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery3.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="product-image-wrapper">
									<div class="single-products">
										<div class="productinfo text-center">
											<img src="images/home/gallery4.jpg" alt="">
											<h2>$56</h2>
											<p>Easy Polo Black Edition</p>
											<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="tab-pane fade" id="reviews">
							<div class="col-sm-12">
								@foreach( \App\Comments::where('productId', $item->id )->get() as $comment)
								<ul>
									<li><i class="fa fa-user"></i>{{\App\User::find($comment->userId)->name}}</li>
									<li><i class="fa fa-clock-o"></i>{{substr($comment->created_at,11)}}</li>
									<li><i class="fa fa-calendar-o"></i>{{substr($comment->created_at,0,10)}}</li>
								</ul>
								<p>{{$comment->comment}}</p>
								<hr style="border-top: 1px solid #a6a6a6 ;">
								@endforeach

								<!-- <ul>
										<li><i class="fa fa-user"></i>EUGEN</li>
										<li><i class="fa fa-clock-o"></i>12:41 PM</li>
										<li><i class="fa fa-calendar-o"></i>31 DEC 2014</li>
									</ul>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p> -->


								<p><b>Write Your Review</b></p>

								<form action="/comment/add" method="post" id="comment">
									<!-- <span>
											<input type="text" placeholder="Your Name">
											<input type="email" placeholder="Email Address">
										</span> -->
									<textarea name="comment"></textarea>
									<input type="hidden" name="rating" value="5">
									<input type="hidden" name="productId" value="{{$item->id}}">
									@csrf
									<b>Rating: </b>
									<div style="width:100px" onclick="$('[name=rating]').val(Math.round(event.offsetX*5/100));$('#ratingStars').width(event.offsetX+'px')">
										<img src="images/product-details/rating.png" style="position:absolute;opacity:0.3;width:100px" alt="">
										<div id="ratingStars" style="overflow:hidden;width:50px;">
											<img src="images/product-details/rating.png" style="width:100px" alt="">
										</div>
									</div>
									<button type="submit" class="btn btn-default pull-right">
										Submit
									</button>
								</form>
							</div>
						</div>

					</div>
				</div>
				<!--/category-tab-->
				@if(0)
				<div class="recommended_items">
					<!--recommended_items-->
					<h2 class="title text-center">recommended items</h2>

					<div id="recommended-item-carousel" class="carousel slide" data-ride="carousel">
						<div class="carousel-inner">
							<div class="item">
								<div class="col-sm-4">
									<div class="product-image-wrapper">
										<div class="single-products">
											<div class="productinfo text-center">
												<img src="images/home/recommend1.jpg" alt="">
												<h2>$56</h2>
												<p>Easy Polo Black Edition</p>
												<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="product-image-wrapper">
										<div class="single-products">
											<div class="productinfo text-center">
												<img src="images/home/recommend2.jpg" alt="">
												<h2>$56</h2>
												<p>Easy Polo Black Edition</p>
												<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="product-image-wrapper">
										<div class="single-products">
											<div class="productinfo text-center">
												<img src="images/home/recommend3.jpg" alt="">
												<h2>$56</h2>
												<p>Easy Polo Black Edition</p>
												<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="item active">
								<div class="col-sm-4">
									<div class="product-image-wrapper">
										<div class="single-products">
											<div class="productinfo text-center">
												<img src="images/home/recommend1.jpg" alt="">
												<h2>$56</h2>
												<p>Easy Polo Black Edition</p>
												<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="product-image-wrapper">
										<div class="single-products">
											<div class="productinfo text-center">
												<img src="images/home/recommend2.jpg" alt="">
												<h2>$56</h2>
												<p>Easy Polo Black Edition</p>
												<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="product-image-wrapper">
										<div class="single-products">
											<div class="productinfo text-center">
												<img src="images/home/recommend3.jpg" alt="">
												<h2>$56</h2>
												<p>Easy Polo Black Edition</p>
												<button type="button" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<a class="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
							<i class="fa fa-angle-left"></i>
						</a>
						<a class="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
							<i class="fa fa-angle-right"></i>
						</a>
					</div>
				</div>
				<!--/recommended_items-->
				@endif
			</div>







		</div>
	</div>
	</div>
</section>




@endsection

@section('self_script')


<script>
	$('.rating').width(String(16.3 * {
		{
			$item - > rating ? ? 0
		}
	}) + 'px')

	$('.subImg').click(function() {
		$('#mainImg')[0].src = $('#zoomImg>img')[0].src = $(this)[0].src;
	})

	$($('.addToCart')[0]).click(function() {
		// $.post("/cart/add", {id:$('#productId').val(), quantity:$('#quantity').val()});

		$($('.addToCart')[1]).show()
		$($('.addToCart')[0]).hide()

		$.ajax({
			url: '/cart/add/',
			type: 'POST',
			data: JSON.stringify({
				id: $('#productId').val(),
				quantity: $('#quantity').val()
			}),
			processData: false,
			contentType: 'application/json',
			dataType: 'json',
			success: function(result) {
				$($('.addToCart')[2]).show()
				$($('.addToCart')[1]).hide()
				$($('.addToCart')[2]).fadeOut(1000, "linear", function() {
					$($('.addToCart')[0]).show()
				});
			},
			error: function(jqXHR, exception) {
				console.log(jqXHR);
				if (jqXHR.status == 401) window.location.href = '/login'
			}
		});
	})
</script>

@endsection