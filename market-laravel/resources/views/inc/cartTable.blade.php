<style>
    .cart_product img {
        max-width: 110px;
        max-height: 110px;
    }

    .cart_product {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cart_quantity {
        min-width: 150px;
    }

    .update:not(:active) {
        background-color: #FE980F;
        color: white;
    }

    .update:hover {
        background-color: #ebebeb;
        color: black;
    }

    .update:active {
        background-color: grey;
        color: white;
    }
</style>

<section id="cart_items">
    <div class="container">
        @if(isset($checkoutpage))
        <br>
        @else
        <div class="breadcrumbs">
            <ol class="breadcrumb">
                <li><a href="#">Home</a></li>
                <li class="active">Shopping Cart</li>
            </ol>
        </div>
        @endif
        <div class="table-responsive cart_info">
            <table class="table table-condensed">
                <thead>
                    <tr class="cart_menu">
                        <td class="image">Item</td>
                        <td class="description"></td>
                        <td class="price">Unit Price</td>
                        <td class="quantity">Quantity</td>
                        <td class="total">Total</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    @foreach($cart as $i=>$a)
                    <tr id="{{$i}}" price="{{\App\Products::find($i)->price}}">
                        <td class="cart_product">
                            <a href="/product/{{$i}}"><img style="" src="@if(json_decode(\App\Products::find($i)->images))/storage/image_files/{!! json_decode(\App\Products::find($i)->images)[0] !!}@else /images/product-details/no-image.png @endif" alt=""></a>
                        </td>
                        <td class="cart_description">
                            <h4><a href="/product/{{$i}}">{{\App\Products::find($i)->name}}</a></h4>
                            <p>Product ID: {{$i}}</p>
                        </td>
                        <td class="cart_price">
                            <p>LKR {{\App\Products::find($i)->price}}</p>
                        </td>
                        <td class="cart_quantity">
                            <div class="cart_quantity_button">
                                <a class="cart_quantity_up" href="javascript:null" onclick="javascript:buttonChange(this,1)"> + </a>
                                <input class="cart_quantity_input" type="number" id="{{$i}}" name="quantity" value="{{$a}}" autocomplete="off" min="0" style="width:60px;">
                                <a class="cart_quantity_down" href="javascript:null" onclick="javascript:buttonChange(this,-1)"> - </a>
                            </div>
                        </td>
                        <td class="cart_total">
                            <p class="cart_total_price">LKR {{\App\Products::find($i)->price*$a}}</p>
                        </td>
                        <td class="cart_delete">
                            <a class="cart_quantity_delete" href="javascript:null" onclick="javascript:buttonChange(this,0)"><i class="fa fa-times"></i></a>
                        </td>
                    </tr>
                    @endforeach

                    <!-- <tr>
                        <td class="cart_product">
                            <a href=""><img src="images/cart/two.png" alt=""></a>
                        </td>
                        <td class="cart_description">
                            <h4><a href="">Colorblock Scuba</a></h4>
                            <p>Web ID: 1089772</p>
                        </td>
                        <td class="cart_price">
                            <p>$59</p>
                        </td>
                        <td class="cart_quantity">
                            <div class="cart_quantity_button">
                                <a class="cart_quantity_up" href=""> + </a>
                                <input class="cart_quantity_input" type="text" name="quantity" value="1" autocomplete="off" size="2">
                                <a class="cart_quantity_down" href=""> - </a>
                            </div>
                        </td>
                        <td class="cart_total">
                            <p class="cart_total_price">$59</p>
                        </td>
                        <td class="cart_delete">
                            <a class="cart_quantity_delete" href=""><i class="fa fa-times"></i></a>
                        </td>
                    </tr> -->

                </tbody>
            </table>
        </div>
    </div>
</section>


<section id="do_action">
    <div class="container">
        <!-- <div class="heading">
				<h3>What would you like to do next?</h3>
				<p>Choose if you have a discount code or reward points you want to use or would like to estimate your delivery cost.</p>
			</div> -->
        <div class="row">
            <!-- <div class="col-sm-6">
					<div class="chose_area">
						<ul class="user_option">
							<li>
								<input type="checkbox">
								<label>Use Coupon Code</label>
							</li>
							<li>
								<input type="checkbox">
								<label>Use Gift Voucher</label>
							</li>
							<li>
								<input type="checkbox">
								<label>Estimate Shipping &amp; Taxes</label>
							</li>
						</ul>
						<ul class="user_info">
							<li class="single_field">
								<label>Country:</label>
								<select>
									<option>United States</option>
									<option>Bangladesh</option>
									<option>UK</option>
									<option>India</option>
									<option>Pakistan</option>
									<option>Ucrane</option>
									<option>Canada</option>
									<option>Dubai</option>
								</select>
								
							</li>
							<li class="single_field">
								<label>Region / State:</label>
								<select>
									<option>Select</option>
									<option>Dhaka</option>
									<option>London</option>
									<option>Dillih</option>
									<option>Lahore</option>
									<option>Alaska</option>
									<option>Canada</option>
									<option>Dubai</option>
								</select>
							
							</li>
							<li class="single_field zip-field">
								<label>Zip Code:</label>
								<input type="text">
							</li>
						</ul>
						<a class="btn btn-default update" href="">Get Quotes</a>
						<a class="btn btn-default check_out" href="">Continue</a>
					</div>
				</div> -->
            <div class="col-sm-6">
                <div class="total_area">
                    <ul>
                        <li>Cart Sub Total <span id="subTotal">Calculating...</span></li>
                        <!-- <li>Eco Tax <span>$2</span></li>
							<li>Shipping Cost <span>Free</span></li>
							<li>Total <span>$61</span></li> -->
                    </ul>
                    @if(isset($checkoutpage))
                    <button class="btn btn-default update" onclick="purchase()">Purchase</button>
                    @else
                    <button class="btn btn-default update" onclick="update()">Update</button>
                    <button class="btn btn-default update" onclick="checkout()">Checkout</button>
                    @endif
                </div>
            </div>
        </div>
    </div>
</section>