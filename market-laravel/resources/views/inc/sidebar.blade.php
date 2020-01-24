<style>
	.shipping {
		background: none;
		width: 260px;
	}

	@media (max-width:700px) {
		.shipping {
			margin: auto;
			width: 300px;
		}
	}
</style>


<div class="left-sidebar">
	<h2>Categories</h2>
	<div class="panel-group category-products" id="accordian">
		<!--category-productsr-->

		<!-- <div id="womens" class="panel-collapse collapse">
				<div class="panel-body">
					<ul>
						<li><a href="#">Fendi</a></li>
						<li><a href="#">Guess</a></li>
						<li><a href="#">Valentino</a></li>
						<li><a href="#">Dior</a></li>
						<li><a href="#">Versace</a></li>
					</ul>
				</div>
			</div>
		</div> -->
		@foreach(Schema::getColumnListing('categories') as $key)
		@if($key!='product_id')
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a href="/category/{{$key}}">{{$key}}</a></h4>
			</div>
		</div>
		@endif
		@endforeach
	</div>
	<!--/category-products-->
	<?php


	// dd(DB::table('categories')->where('nuts',1)->count() 	);
	?>
	<div class="brands_products">
		<!--brands_products-->
		<h2>Brands</h2>
		<div class="brands-name">
			<ul class="nav nav-pills nav-stacked">
				@foreach(\App\Products::pluck('brand')->unique() as $key)
				@if($key)
				<li><a href="/brand/{{$key}}"> <span class="pull-right">({{DB::table('products')->where('brand',$key)->count()}})</span>{{$key}}</a></li>
				@endif
				@endforeach
			</ul>
		</div>
	</div>
	<!--/brands_products-->

<!--price-range-->
	<!-- <div class="price-range">
		<h2>Price Range</h2>
		<div class="well text-center">
			<input type="text" class="span2" value="" data-slider-min="0" data-slider-max="600" data-slider-step="5" data-slider-value="[250,450]" id="sl2"><br />
			<b class="pull-left">$ 0</b> <b class="pull-right">$ 600</b>
		</div>
	</div> -->
	<!--/price-range-->

	<div class="shipping text-center">
		<!--shipping-->
		<img src="resize/home/shipping.jpg?q=20" style=" width:100%;" />
	</div>
	<!--/shipping-->

</div>