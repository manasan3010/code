

lengthValue = 9
startValue = 0
searchFor();

function searchFor() {

    var inputValue = $('#search-field-2').val()
    console.log(inputValue)

    $.postJSON('/search', {
        "start": startValue,
        "length": lengthValue,
        "order": [{ "column": "price", "dir": "DESC" }],
        "search": { "value": inputValue }

    }).done(function (result) {
        console.log(result)

        createPagination(result.recordsFiltered)

        $(`.features_items`).html('')

        if (inputValue == "") { $(`.features_items`).html(`<div class="text-center no-result" ><h3>Your Search Query is empty</h3></div>`); return false; }

        if (!result.data.length) { $(`.features_items`).html(`<div class="text-center no-result" ><h3>No Results Found. Try narrowing your search terms</h3></div>`); return false; }


        result.data.forEach((e, i) => {
            // console.log(e, i)
            $(`.features_items`).append(`
            
            <div class="col-sm-4">
						<a href="/product/${e.id}">
							<div class="product-image-wrapper">
								<div class="single-products">
									<div class="productinfo text-center">
                                        <div class="image-view" ${e.images[0] ? `style="background-image: url(/storage/image_files/${e.images[0]}) "` : ""} ></div>
										<h2>LKR ${e.price}</h2>
										<p>${e.name}</p>
										<div onclick="event.preventDefault();">
											<button id="${e.id}" onclick="addToCart(this)" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</button>

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
            
            `)
        });
    })

}


function addToCart(thisE) {

    // $.post("/cart/add", {id:$('#productId').val(), quantity:$('#quantity').val()});
    console.log(thisE)
    $(thisE).next().show()
    $(thisE).hide()

    $.ajax({
        url: '/cart/add/',
        type: 'POST',
        data: JSON.stringify({
            id: $(thisE).attr('id'),
            quantity: 1
        }),
        processData: false,
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {
            console.log(this)
            $(thisE).show()
            $(thisE).next().hide()
            $(thisE).html('Added to cart')
            $(thisE).attr('disabled', '')
            $(thisE).css('background', '#bbb8b8')
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            if (jqXHR.status == 401) window.location.href = '/login'
        }
    });

}

function createPagination(recordsFiltered) {
    $('ul.pagination').html('')

    if (recordsFiltered <= lengthValue) {
        $('ul.pagination').append(`
            <li class="active-page">1</li>
        `);
        return false;
    }

    for (var i = 1; i <= Math.ceil(recordsFiltered / lengthValue); i++) {
        $('ul.pagination').append(`
             <li ${i == Math.ceil((startValue + 1) / lengthValue) ? 'class="active-page"' : `onclick="startValue=${lengthValue*(i-1)};searchFor();"`} >${i}</li>
    `)
    }

}