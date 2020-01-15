<?php require 'navbar.php'; ?>





<div class="card">
	<article class="card-body">
		<h4 class="card-title text-center mb-4 mt-1">Sign in</h4>
		<hr>
		<!-- <p class="text-success text-center">Some message goes here</p> -->
		<br>
		<form>
			<div id="incorrect" style="display:none;border:red solid 2px;border-radius: 8px;font-size:24px;color:red;text-align: center;padding-bottom:5px;margin-bottom:15px;">Username or Password is Incorrect</div>
			<div id="correct" style="display:none;border:green solid 2px;border-radius: 8px;font-size:24px;color:green;text-align: center;padding-bottom:5px;margin-bottom:15px;">Login Succesful!</div>
			<div class="form-group ">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text"> <i class="fa fa-user"></i> </span>
					</div>
					<input name="" class="form-control" placeholder="User Name" id="username" type="text" required="true">
				</div> <!-- input-group.// -->
			</div> <!-- form-group// -->
			<div class="form-group">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text"> <i class="fa fa-lock"></i> </span>
					</div>
					<input class="form-control" placeholder="******" type="password" id="password" required="true">
				</div> <!-- input-group.// -->
			</div> <!-- form-group// -->
			<div class="form-group">
				<button type="submit" class="btn btn-primary btn-block"> Login </button>
			</div> <!-- form-group// -->
			<p class="text-center"><a href="reset.php" class="btn">Reset password?</a></p>
		</form>
	</article>
</div> <!-- card.// -->





<script>
	$(document).ready(function() {

		$("a#navbar_name").html("Login");


		var $form = $('form');
		$form.submit(function() {

			$.post("login_back.php", {
					username: $('#username').val(),
					password: $('#password').val()
				})
				.done(function(data) {
					console.log("Data Loaded: " + data);
					if (data.includes("logged")) {
						window.location = 'welcome.php';
						$("div#incorrect").hide();
						$("div#correct").show();
					} else if (data.includes("incorrect") && ($("div#correct").css("display") == "none")) {
						$("div#incorrect").show();
					}
				});
			return false;
		});
	});
</script>