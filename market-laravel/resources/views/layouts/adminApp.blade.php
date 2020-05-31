<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="description" content="">
	<meta name="author" content="Manasan">
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	<base href="{{ asset('') }}" target="">
	<title>E-Market - Dashboard</title>

	<!-- Custom fonts for this template-->
	<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">


	<link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

	<!-- Custom styles for this template-->
	<link href="css/sb-admin-2.min.css" rel="stylesheet">
	<link href="css/threedots.css" rel="stylesheet">

	<link href="https://cdn.jsdelivr.net/npm/multiple-select-js@latest/dist/css/multiple-select.css" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/multiple-select-js@latest/dist/js/multiple-select.js"></script>
	<style>
		.form-control {
			font-size: 20px !important;
			color: black !important;
			border-radius: 0.5rem !important;
		}

		textarea {
			padding: 14px !important;
		}

		.check-1::before,
		.check-1::after {
			/* margin: 10px 10px 0px 0px !important; */
			top: 15px;
			left: -20px;
		}

		ul.list-group>li {
			/* max-height: none !important; */
			min-height: 41px !important;
		}

		@media screen and (max-width: 800px) {
			.alert {
				left: 10% !important;
			}
		}
	</style>

</head>
<!--/head-->


<body id="page-top">

	<div id="wrapper">

		@include('adminInc.sidebar')


		<!-- Content Wrapper -->
		<div id="content-wrapper" class="d-flex flex-column">

			<!-- Main Content -->
			<div id="content">

				@include('adminInc.navbar')

				@yield('content')

			</div>
			<!-- End of Main Content -->

			@include('adminInc.footer')


		</div>
		<!-- End of Content Wrapper -->

	</div>


</body>

<!-- Bootstrap core JavaScript-->
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

<!-- Core plugin JavaScript-->
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>

<!-- Custom scripts for all pages-->
<script src="js/sb-admin-2.min.js"></script>
<script src="js/admin/customAll.js"></script>

<!-- Page level plugins -->
<!-- <script src="vendor/chart.js/Chart.min.js"></script> -->

<!-- Page level custom scripts -->
<!-- <script src="js/demo/chart-area-demo.js"></script>
<script src="js/demo/chart-pie-demo.js"></script> -->


@yield('self_script')

</html>