@extends('layouts.adminApp')

@section('content')

<style>
  tbody tr:hover {
    background: #bbdefb;
  }

  tbody tr:active {
    background: #90caf9;
  }

  .table {
    color: black !important;
	margin-bottom: 0px;
  }

  .dataTables_wrapper {
    width: fit-content;
  }

  .pDisc{
	width: 150px !important;
	word-break: break-all;
	overflow: hidden;
  }
  
  #productsTable th:nth-child(9), #productsTable td:nth-child(9){
	min-width: 120px !important;
  }
  
  #productsTable th:nth-child(10), #productsTable td:nth-child(10){
	min-width: 120px !important;
  }
  
 
 



  #editHolderClose {
    position: absolute;
    font-size: 70px;
    right: 0px;
    padding-right: 30px;
    margin-top: -2px;
    cursor: pointer;
    color: #3949AB;

  }

  @media (max-width:575px) {
    #editHolderClose {
      margin-top: -70px;
      right: -10px;
    }
  }
</style>

<script>

</script>

<!-- DataTales Example -->
<div class="card shadow " style="margin:0px 20px" id="tableHolder">
  <div class="card-header py-3">
    <span class="m-0 mr-4 font-weight-bold text-primary">Transcations History</span><a href="javascript:redrawTable();" class="mt-2 mt-sm-0 d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-redo fa-sm text-white-50 mr-1"></i> Refresh Table</a>
  </div>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-bordered" id="productsTable" width="100%" cellspacing="0">
        <thead>
          <tr>
            <th>Index</th>
            <th>Name</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Stock</th>
            <th>Brand</th>
            <th>Location</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</div>

<div id="editHolder" style="display:none;">
  @include('adminInc.addProductContent')
</div>

@endsection

@section('self_script')


<!-- Page level plugins -->
<script src="vendor/datatables/jquery.dataTables.min.js"></script>
<script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>

<!-- Page level custom scripts -->
<script src="js/admin/edit_product.js"></script>
<script src="js/admin/add_product.js"></script>

<!-- Custom styles for this page -->
<link href="vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">

@endsection