currentPage = 'edit_product';

$(document).ready(function () {

    pTable = $('#productsTable').DataTable({

        ajax: {
            url: "admin/product/info",
            dataType: "json",
            type: "POST",
            // success: function (dataR) {
            //     data = dataR.data;
            //     console.log(data)
            //     fnCallback(dataR)
            // },
            // dataSrc: ""
        },
        processing: true,
        serverSide: true,
        scrollX: true,
        // scrollY: "58vh",
        // pageResize: true,
        scrollCollapse: true,
        order: [
            [0, "desc"]
        ],
        columns: [{
            data: 'id'
        }, {
            data: 'name',
            // render: function (data, type, full, meta) {
            //     return `<button class="btn btn-danger" onclick='event.stopPropagation();if(typeof logged_in != "undefined"){window.location="login.php";} $("#edit_wrapper").dialog("open");editDialog("${data}"); ' >Edit</button>`;
            // }
        }, {
            data: 'price'
        }, {
            data: 'availability'
        }, {
            data: 'current_stock',
			render: function (data, type, full, meta) {
                return data!==null ? data: 'Unlimited' ;
            }
        }, {
            data: 'brand'
        }, {
            data: 'location'
        }, {
            data: 'description',
			 render: function (data, type, full, meta) {
                return data ? (data.length>30 ? `<div class="pDisc" >${data.substring(0,30) + '...'}</div>` : data ) : data ;
            }
        }, {
            data: 'created_at'
        }, {
            data: 'updated_at'
        }],
        // columnReorder: true,
    });

    scrollPosition = [0, 0]
    // redrawTable()






    $('#addContentHeading h1').text('Edit Product')
    $('button#submit').text('Update Product')
    $('button#delete').show()
    $('#addContentHeading').append(`<a href="javascript:redrawTable();" style="margin-right: 110px;" class="mt-2 mt-sm-0 d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-link fa-sm text-white-50 mr-1"></i> View in E-Market</a><div onclick="editHolderClose()" id="editHolderClose"  >&times;</div>`)

    $('#productsTable').on('draw.dt', function () {
        $('#productsTable tbody tr').click(function () {
            row = pTable.row($(this)).data();
            console.log(pTable.row($(this)).data());
            editProduct(row)
            scrollPosition[1] = window.scrollY
            window.scrollTo(0, 0)

            $('#tableHolder').hide();
            $('#editHolder').show();
        });
    })

    $("#productsTable").on('xhr.dt', function (e, settings, dataR, xhr) {
        // console.log(e, settings, dataR, xhr)
        if (xhr.readyState == 4) {
            data = dataR.data
            console.log(data)
        }
    });

});



function redrawTable() {

    pTable.ajax.reload(null, false);

    // $.post("admin/product/info")
    //     .done(function (dataR) {
    //         // console.log(dataR);
    //         window.data = dataR;

    //         // datatable = $('#pigeons').DataTable();
    //         pTable.clear();
    //         pTable.rows.add(data);
    //         pTable.draw();
    //         console.log(data);
    //     })
}

function editHolderClose() {

    $('.alert').hide();
    redrawTable();
    $('#tableHolder').show();
    $('#editHolder').hide();
    window.scrollTo(scrollPosition[0], scrollPosition[1])
}

function deleteProduct() {
    if (!confirm('Do you want to PERMANENTLY delete this item?\nThis action is irreversible')) return;

    $.ajax({
        url: 'admin/product/delete',
        type: 'POST',
        data: JSON.stringify({ 'id': row.id }),
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (result) {
            console.log(result)
            $('#delete').show();
            $('#deleteLoading').hide();
            $('.alert').hide();
            successFunction(result)
        },
        error: function (jqXHR, exception) {
            msg = errorFunction(jqXHR, exception)

            $('.alert').hide();
            $(".alert:eq(1)").fadeIn(200);
            $(".alert:eq(1)>span").text(msg);

            $('#delete').show();
            $('#deleteLoading').hide();
        }
    });

    $('#delete').hide();
    $('#deleteLoading').show();
}

function editProduct(row) {
    $('#productForm')[0].reset()
    $('.image_files_t').remove();
    $('#current_stock').attr('disabled', false);
    $(multipleSelect.$el).remove()
    $("#multiple-select option").removeAttr("selected")


    for (key in row) {
        // console.log(key);

        switch (key) {
            case "images":
                break;

            case "created_at":
            case "updated_at":
            case "id":
            case "tags":
            case "rating":
                break;



            default:

                $('#productForm [name="' + key + '"]').val(row[key])

        }

    }

    $('#productForm').append(`<input name="id" hidden value="${row.id}">`)

    if (row['current_stock'] == null) { $('#customCheck1').click() }
    for (key of JSON.parse(row['category'])) {
        $(`#multiple-select option[value=${key}]`).attr('selected', '')
    }

    multipleSelect = new MultipleSelect('#multiple-select', {
        placeholder: 'Choose Categories'
    })

}