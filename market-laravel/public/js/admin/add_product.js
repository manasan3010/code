$(document).ready(function () {

    multipleSelect = new MultipleSelect('#multiple-select', {
        placeholder: 'Choose Categories'
    })

    imagesPreview = function (input) {
        $('.image_files_t').remove();
        if (input.files) {
            var filesAmount = input.files.length;
            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    $(input).parent().parent().after('<img class="image_files_t" src=' + event.target.result + ' style="height:80px;" >');
                    // $("img:last").attr('src', event.target.result);
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    };


})

$('form.user').submit(
    function (e) {
        $.ajax({
            url: 'admin/product/add/submit',
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (result) {
                console.log(result)
                $('#submit').show();
                $('#loading').hide();
                $('.alert').hide();
                successFunction(result)
            },
            error: function (jqXHR, exception) {
                msg = errorFunction(jqXHR, exception)

                $('.alert').hide();
                $(".alert:eq(1)").fadeIn(200);
                $(".alert:eq(1)>span").text(msg);

                $('#submit').show();
                $('#loading').hide();
            }
        });
        e.preventDefault();

        $('#submit').hide();
        $('#loading').show();
    }
);

successFunction = function (result) {

    if (result.state == 1) {
        $(".alert:eq(0)").fadeIn(200);
        setTimeout(function () {
            $(".alert:eq(0)").fadeOut(400);
        }, 1000);

        if (typeof currentPage == 'undefined') {
            $('#productForm')[0].reset();
            $('.image_files_t').remove();
            $('#current_stock').attr('disabled', false);
            scroll(0, 0);
            $(multipleSelect.$el).remove()
            $("#multiple-select option").removeAttr("selected")
            multipleSelect = new MultipleSelect('#multiple-select', {
                placeholder: 'Choose Categories'
            })
        }


    } else if (result.state == 2) {
        editHolderClose();
    }
    else {
        $(".alert:eq(1)").fadeIn(200);
        $(".alert:eq(1)>span").text(result.error);
    }
}

errorFunction = function (jqXHR, exception) {
    msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connect. Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error. ' + jqXHR.responseText;
    }
    console.log(jqXHR, exception)
    return msg;

}