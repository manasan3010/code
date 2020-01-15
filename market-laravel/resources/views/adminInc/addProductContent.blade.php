<!-- Begin Page Content -->
<div class="container-fluid">

    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4" id="addContentHeading">
        <h1 class="h3 mb-0 text-gray-800">Add New Product</h1>
    </div>

    <div class="alert alert-success mr-5 " style="display:none;position: fixed;top: 80px;left:40%;z-index:99;">
        <strong>Success!</strong> The Product has been submitted
    </div>

    <div class="alert alert-danger mr-5 " style="display:none;position: fixed;top: 80px;left:40%;z-index:99;">
        <a href="javascript:void" class="close" onclick="$(this).closest('.alert').hide();" aria-label="close">&times;</a>
        <strong>Submission Failed:&nbsp;</strong><span> Something Went Wrong</span>&nbsp;&nbsp;
    </div>

    <!-- Content Row -->
    <div class="">
        <div class="pt-3">
            <div class="">
                <form class="user" enctype="multipart/form-data" autocomplete="off" id="productForm">
                    @csrf
                    <div class="form-group">
                        <input type="text" class="form-control form-control-user" id="name" autocomplete="on" name="name" required placeholder="Name Of Product">
                    </div>
                    <div class="form-group">
                        <textarea rows=4 class="form-control form-control-user" id="exampleInputEmail" name="description" placeholder="Details Of Product"></textarea>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0" style="display: inherit;">
                            <input type="number" class="form-control form-control-user lkr-symbol" style="border-bottom-right-radius : 0!important;border-top-right-radius: 0!important;" name="price" required id="exampleInputPassword" placeholder="Price in LKR">
                            <div class="input-group-append">
                                <button disabled class="btn btn-primary" style="border-bottom-left-radius: 0;border-top-left-radius: 0;height: 50px;" type="button">
                                    LKR
                                </button>
                            </div>
                        </div>
                        <div class="col-sm-6 mb-3 mb-sm-0" style="">
                            <!-- <label for="select-language">Multiple Select</label> -->
                            <select id="multiple-select" class="custom-select" name="category[]" multiple>
                                @foreach(Schema::getColumnListing('categories') as $key)
                                @if($key!='product_id')
                                <option value="{{$key}}">{{$key}}</option>
                                @endif
                                @endforeach
                            </select>

                        </div>

                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0" style="display: inherit;">
                            <input type="text" class="form-control form-control-user lkr-symbol" style="" id="stock" name="availability" placeholder="Availability" autocomplete="on" value="In Stock">
                        </div>
                        <div class="col-sm-6" style="display: inherit;">
                            <input type="number" class="form-control form-control-user" id="current_stock" name="current_stock" placeholder="Current Available Stock">

                            <div class="custom-control custom-checkbox" style=" margin: 0px 0px 0px  4px;">
                                <input type="checkbox" class="custom-control-input" id="customCheck1" onchange="$('#current_stock').attr('disabled',(this.checked));">
                                <label class="custom-control-label check-1" for="customCheck1">Infinite Stock</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0" style="display: inherit;">
                            <input type="text" class="form-control form-control-user lkr-symbol" autocomplete="on" style="" name="brand" id="brand" placeholder="Brand Name">
                        </div>
                        <div class="col-sm-6 mb-3 mb-sm-0" style="display: inherit;">
                            <input type="text" class="form-control form-control-user lkr-symbol" autocomplete="on" style="" id="location" name="location" placeholder="Location of Production">
                        </div>

                    </div>



                    <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0" style="">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="image_files[]" name="image_files[]" multiple accept="image/*" onchange="imagesPreview(this);">
                                <label class="custom-file-label" for="customFileLangHTML" data-browse="Browse">Choose Images</label>
                            </div>
                        </div>
                    </div>


                    <hr>
                    <button type="submit" id="submit" class="btn btn-primary btn-user btn-block" style="font-size: 18px;">

                        Create Product

                    </button>

                    <button id="loading" style="display:none;height:52.6px;" class="btn btn-primary btn-user btn-block" style="font-size: 18px;" disabled>
                        <div class="spinner pr-2">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                        Please Wait...
                    </button>
                    <hr>

                    <button type="button" id="delete" onclick="deleteProduct()" class="btn btn-danger btn-user btn-block" style="display:none;">
                        <i class="fas fa-trash fa-sm"></i>
                        &nbsp;Delete Product
                    </button>

                    <button type="button" id="deleteLoading" disabled class="btn btn-danger btn-user btn-block" style="display:none;">
                        <div class="spinner pr-2">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                        Please Wait...
                    </button>

                    <hr>

                </form>


            </div>
        </div>


    </div>
    <!-- /.container-fluid -->