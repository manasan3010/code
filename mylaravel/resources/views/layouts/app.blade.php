<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Acme</title>
	<meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
	<link rel="stylesheet" href="css/app.css">
</head>
<body>
	@include('inc.navbar')
	<div class="container" >
	@include('inc.messages')
	@yield('content')
	</div>
	@include('inc.sidebar')

&copy;
</body>
</html>