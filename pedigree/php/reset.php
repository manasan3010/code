<?php require 'navbar.php'; ?>
<style>
    button.btn-success {
        margin: 0 10px;
    }

    @media (max-width: 580px) {
        button.btn-success {
            margin: 5px 0px;
            width: 93vw;
        }
    }
</style>




<div class="card">
    <article class="card-body">
        <h4 class="card-title text-center mb-4 mt-1">Reset Password</h4>
        <hr>
        <!-- <p class="text-success text-center">Some message goes here</p> -->
        <br>
        <form>
            <div id="incorrect" style="display:none;border:red solid 2px;border-radius: 8px;font-size:24px;color:red;text-align: center;padding-bottom:5px;margin-bottom:15px;">Username or Old Password is Incorrect</div>
            <div id="correct" style="display:none;border:green solid 2px;border-radius: 8px;font-size:24px;color:green;text-align: center;padding-bottom:5px;margin-bottom:15px;">Password Changed Successfully</div>
            <div class="form-group ">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="User Name" value="" id="username" type="text" required="true">
                </div> <!-- input-group.// -->
            </div> <!-- form-group// -->
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                    <input class="form-control" placeholder="Old Password" type="text" id="old_password" required="true" autocomplete="off">
                </div> <!-- input-group.// -->
            </div> <!-- form-group// -->
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                    <input class="form-control" placeholder="New Password" type="text" id="new_password" required="true" autocomplete="off">
                </div> <!-- input-group.// -->
            </div> <!-- form-group// -->
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block"> Reset Password </button>
            </div> <!-- form-group// -->
        </form>
    </article>
</div> <!-- card.// -->





<script>
    $(document).ready(function() {

        $("a#navbar_name").html("Go To login");
        $("a#navbar_name").attr("href", 'login.php');


        var $form = $('form');
        $form.submit(function() {

            $.post("reset_back.php", {
                    username: $('#username').val(),
                    old_password: $('#old_password').val(),
                    new_password: $('#new_password').val()
                })
                .done(function(data) {
                    console.log("Data Loaded: " + data);
                    if (data.includes("updated")) {
                        // window.location = 'php/add.php';
                        $("div#incorrect").hide();
                        $("div#correct").show();
                    } else if (data.includes("incorrect")) {
                        $("div#incorrect").show();
                        $("div#correct").hide();
                    }
                });
            return false;
        });
    });
</script>