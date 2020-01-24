



$('.add-to-cart').click(function (event) {

    // $.post("/cart/add", {id:$('#productId').val(), quantity:$('#quantity').val()});
    console.log(event)
    thisE = this;
    $(this).next().show()
    $(this).hide()

    $.ajax({
        url: '/cart/add/',
        type: 'POST',
        data: JSON.stringify({
            id: $(this).attr('id'),
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

})