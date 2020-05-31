
function buttonChange(elem, action) {
    // elemId = parseInt($(elem).parent().parent().parent().attr('id'));

    if (action == +1) {
        elemVal = (parseInt($(elem).parent().find('input').val()) + 1 > 0) ?
            parseInt($(elem).parent().find('input').val()) + 1 : 1;
    } else if (action == 0) {
        elemVal = 0;
        $(elem).parent().parent().hide();
    } else if (action == -1) {
        elemVal = (parseInt($(elem).parent().find('input').val()) - 1 > 0) ?
            parseInt($(elem).parent().find('input').val()) - 1 : 1;
    }

    $(elem).parent().parent().find('input.cart_quantity_input').val(elemVal).change()

    // $(elem).closest('tr').find('.cart_total_price').html('LKR ' + parseInt($(elem).closest('tr').attr('price')) * elemVal)

}

function update() {

    $('tbody>tr').each(function () {
        elemVal = parseInt($(this).find('input.cart_quantity_input').val());

        $.postJSON('/cart/add', {
            id: this.id,
            quantity: elemVal >= 0 ? elemVal : 1
        })
    })
}

function checkout() {

    $('tbody>tr').each(function () {
        elemVal = parseInt($(this).find('input.cart_quantity_input').val());

        $.postJSON('/cart/add', {
            id: this.id,
            quantity: elemVal >= 0 ? elemVal : 1
        }).done(function () {
            window.location.href = '/checkout'
        })
    })
}

function typedChange() {

}

$('.cart_quantity_input').each(function () {

    $(this).on('input change', function () {
        elemVal = parseInt(this.value)
        // console.log(this);
        if (!(elemVal > 0) && $(this).closest('tr').css('display') !== 'none') {
            elemVal = 1;
            this.value = 1
        }
        $(this).closest('tr').find('.cart_total_price').html('LKR ' + parseInt($(this).closest('tr').attr('price')) * elemVal)

        totalSum = 0;
        $('.cart_quantity_input').each(function () {

            totalSum += parseInt($(this).closest('tr').attr('price')) * parseInt(this.value)
        })
        $('#subTotal').html('LKR ' + totalSum)

    })

})

function formatLimitDecimals(value, decimals) {
    value = value.toString().split('.')

    if (value.length === 2) {
        return Number([value[0], value[1].slice(0, decimals)].join('.'))
    } else {
        return Number(value[0]);
    }
}

$('input.cart_quantity_input').trigger('input')
