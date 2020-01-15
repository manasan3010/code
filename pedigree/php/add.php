<?php session_start();
if (!isset($_SESSION['user'])) {
   header("location: login.php");
   exit();
} ?>
<?php require 'navbar.php'; ?>

<style>
   button.btn-success {
      margin: 0 10px;
   }

   .form-group {
      display: inline-block;
      margin: 10px 10px;
      width: 40vw;
   }

   fieldset {
      padding-left: 5vw;
   }

   .custom-control-label::before,
   .custom-control-label::after {
      width: 20px;
      height: 20px;
   }

   label.custom-checkbox {
      margin: 0px 10px;
   }

   .custom-combobox {
      position: relative;
      display: inline-block;
   }

   .custom-combobox-toggle {
      position: absolute;
      top: 0;
      bottom: 0;
      margin-left: -1px;
      padding: 0;
   }

   .custom-combobox-input {
      margin: 0;
      padding: 5px 10px;
      text-transform: uppercase;
      margin-right: 35px;
      height: 36.5px;
   }

   .custom-combobox-toggle.ui-corner-right {
      width: 34px;
      height: 36.4px;
      border: 1px #7b8289 solid;
      background: white;
   }

   .ui-icon-triangle-1-s {
      margin: 10px 10px;
   }

   .custom-combobox-toggle.ui-corner-right:hover {
      background: lightgrey !important;
   }

   .custom-combobox-toggle.ui-corner-right:active {
      background: #007fff !important;
   }

   .custom-combobox-toggle.ui-corner-right {
      margin-left: -35px;
   }

   input[name="ring"] {
      text-transform: uppercase;
   }

   @media (max-width: 580px) {
      button.btn {
         margin: 5px 0px;
         width: 93vw;
      }

      .form-group {
         display: block;
         width: 80vw;
         /* margin-left:20px; */
      }
   }
</style>


<body>
   <div id="submitted" class="" style="display:none;border: 2px solid green; border-radius: 8px; font-size: 24px; color: green; text-align: center; padding-bottom: 5px; margin: 15px 50px;">Submission Successful</div>

   <div class="">
      <table class="table table-striped">
         <tbody>
            <tr>
               <td colspan="1">
                  <form class="well form-horizontal" enctype="multipart/form-data" id="form">
                     <fieldset>
                        <div class="form-group">
                           <label class="control-label">Pegion Ring No</label>
                           <div class=" inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="ring" name="ring" class="form-control" required pattern="" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Name</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="name" name="name" class="form-control" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Description</label>
                           <div class=" inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><textarea id="description" name="description" rows="2" cols="50" name="comment"></textarea></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">PEDIGREE (Image/PDF)</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="file" name="file" accept=".pdf,image/*" name="file" class=" filestyle" value="" type="file"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Color</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="color" name="color" class="form-control" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Sex</label>
                           <div class="inputGroupContainer">
                              <div class="input-group">
                                 <label class="custom-control custom-checkbox" style="display: inline-block;font-size:1.25em;" for="cock">
                                    <input type="radio" id="cock" value="cock" name="sex" class="custom-control-input ">
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-label">Cock</span>
                                 </label>
                                 <label class="custom-control custom-checkbox" style="display: inline-block;font-size:1.25em;" for="hen">
                                    <input type="radio" id="hen" value="hen" name="sex" class="custom-control-input ">
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-label">Hen</span>
                                 </label>
                                 <label class="custom-control custom-checkbox" style="display: inline-block;font-size:1.25em;" for="unknown">
                                    <input type="radio" id="unknown" value="unknown" name="sex" checked class="custom-control-input ">
                                    <span class="custom-control-indicator"></span>
                                    <span class="custom-control-label">Unknow</span>
                                 </label>
                              </div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Primary Image</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="p_image" name="p_image" accept="image/*" name="fullName" class="form-control" value="test" type="file"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Add. Images(Max-6)</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input style="width: 100%;" id="a_image" name="a_image" accept="image/*" name="fullName" class="form-control" value="" type="file" multiple></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">Breeder</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="breeder" name="breeder" class="form-control" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">New Owner</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="owner1" name="owner2" class="form-control" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">New Owner’s Address Line 1</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="owner_add_1" name="owner_add_1" class="form-control" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label">New Owner’s Address Line 2</label>
                           <div class="inputGroupContainer">
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="owner_add_2" name="owner_add_2" class="form-control" value="" type="text"></div>
                           </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label" for="country">New Owner’s Country</label>
                           <div class="inputGroupContainer" id=country>
                              <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                 <!-- <input type="hidden" name="country"> -->
                                 <?php include "country.html" ?>
                              </div>
                           </div>
                        </div>
   </div>
   <div class="form-group">
      <label class="control-label">Performance</label>
      <div class=" inputGroupContainer">
         <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><textarea id="performance" rows="2" cols="50" name="performance"></textarea></div>
      </div>
   </div>
   <div class="form-group">
      <label class="control-label">Father</label>
      <div class=" inputGroupContainer">
         <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <div class="ui-widget">
               <select id="father" name="father">
                  <option value="" selected></option>
               </select>
               <div onclick="window.open('add.php?add=father');" class="btn btn-success" style="font-size: 30px;line-height: 25px;">+</div>
            </div>
         </div>
      </div>
   </div>
   <div class="form-group">
      <label class="control-label">Mother</label>
      <div class=" inputGroupContainer">
         <div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <div class="ui-widget">
               <select id="mother" name="mother">
                  <option value="" selected></option>
               </select>
               <div onclick="window.open('add.php?add=mother');" class="btn btn-success" style="font-size: 30px;line-height: 25px;">+</div>
            </div>
         </div>
      </div>
   </div>
   </fieldset>
   <button id="submit_btn" style="height: 60px;font-size: 31px;line-height: 20px;margin-top: 40px;" class="btn btn-primary btn-lg btn-block">Submit</button>

   <button id="wait_btn" type="button" style="height: 60px;font-size: 31px;line-height: 20px;margin-top: 40px;" class="d-none btn btn-primary btn-lg btn-block" type="button" disabled>
      <span class="spinner-border " role="status" aria-hidden="true" style="width: 3.1rem;height: 3.1rem;border-width:0.2em;margin-top: -4.9px;margin-right: 7px;"></span>
      Please Wait...
   </button>
   </form>
   </td>
   </tr>
   </tbody>
   </table>
   </div>

   <!-- The Modal -->
   <div class="modal" id="myModal">
      <div class="modal-dialog">
         <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header bg-danger">
               <h4 class="modal-title">Submission Failed</h4>
               <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
               Please Try Again
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
               <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
            </div>

         </div>
      </div>
   </div>

   <!-- <div id="php_output" style="height:1000px"></div> -->
</body>

<script>
   var fatherArray = [];
   var motherArray = [];
   var ringArray = [];
   var add_father;
   var add_mother;
   var showCombobox = true;

   $(document).ready(function() {


      $("a#navbar_name").html("Add Pigeon")
      $('input:not(#color,#breeder,#owner)').attr("autocomplete", "off");

      $("#ring").on('change keydown paste input', function(e) {
         var ringId = document.getElementById("ring");


         if ($("#ring").val() == '') {
            $("#ring").attr('pattern', '');
            ringId.setCustomValidity("Please fill out this field.");
         } else if (~ringArray.indexOf($("#ring").val().toUpperCase())) {
            $("#ring").attr('pattern', '');
            ringId.setCustomValidity("Ring No already Exists");
         } else {
            console.log("Pattern Passed");
            $("#ring").removeAttr('pattern');
            ringId.setCustomValidity("");
         }
         return e.which !== 32;

      });

      // if (window.location.href.includes("submitted")) {
      //    $('#submitted').removeClass('d-none');
      //    $('#submitted').fadeOut(1300, 'linear');
      // }

      $("#mother").ready(function() {
         $('#father, #mother').parent().find('input').on('change keydown paste input', function(e) {
            return e.which !== 32;
         });

      });
      // Form Values Submitting
      var $form = $('form');
      $form.submit(function(event) {

         $("#ring").val($("#ring").val().toUpperCase())

         $('#submit_btn, #wait_btn').toggleClass('d-none');
         event.preventDefault();
         var $inputs = $('form :input');
         var formValues = {};
         $inputs.each(function() {
            if (this.id != "") {
               formValues[this.id] = $(this).val();
            }
         });

         formValues['father'] = $('#father').parent().find('input').val();
         formValues['mother'] = $('#mother').parent().find('input').val();
         $('#father').parent().find('input').attr("name", "father");
         $('#mother').parent().find('input').attr("name", "mother");

         // if (~ringArray.indexOf($("#ring").val())) {
         //    $("#ring").attr('pattern', '');
         //    document.getElementById("ring").setCustomValidity("Pigeon already created with this Ring No");
         //    return false;
         // }

         // $("input[name=country]").val($('div.niceCountryInputMenu > span > a > span').html());
         // formValues['country'] = $('div.niceCountryInputMenu > span > a > span').html();

         // if (fatherArray[fatherArray.findIndex(item => $('input').eq(-2).val().toLowerCase() === item.toLowerCase())] != undefined) {
         //    formValues['father'] = fatherArray[fatherArray.findIndex(item => $('input').eq(-2).val().toLowerCase() === item.toLowerCase())]
         // }

         // if (motherArray[motherArray.findIndex(item => $('input').eq(-2).val().toLowerCase() === item.toLowerCase())] != undefined) {
         //    formValues['mother'] = motherArray[motherArray.findIndex(item => $('input').eq(-2).val().toLowerCase() === item.toLowerCase())]
         // }


         // console.log(formValues);

         // $.post("add_back.php", formValues)
         //    .done(function(data) {
         //       console.log("Data Loaded: " + data);
         //       if (data.includes("success")) {
         //          if (window.location.href.includes("add=father")) {
         //             window.opener.document.getElementById("father").parentElement.getElementsByTagName("input")[0].value = formValues['ring'];
         //             window.opener.get_ring();
         //             window.close();
         //          }
         //          if (window.location.href.includes("add=mother")) {
         //             window.opener.document.getElementById("mother").parentElement.getElementsByTagName("input")[0].value = formValues['ring'];
         //             window.opener.get_ring();
         //             window.close();
         //          }
         //       }
         //    });
         var formData = new FormData($('form')[0]);
         var filesLength = document.getElementById('a_image').files.length;
         for (var i = 0; i < filesLength; i++) {
            formData.append("a_image[]", document.getElementById('a_image').files[i]);
         }

         $.ajax({
            url: 'add_back.php',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data, textStatus, jqXHR) {
               get_ring();

               // $('#php_output').html(data);
               if (data.includes("Duplicate")) {
                  $('#myModal').modal('show');
                  $('.modal-body').html('Pigeon already created with this Ring No<br>Try a different Ring No');
                  // alert("Ring No Already Exists");
               } else if (data.includes("error:")) {
                  $('#myModal').modal('show');
                  $('.modal-body').html('Form Submission Failed! <br>Unkown Error');
                  // alert("Form Submission Failed");
               } else if (data.includes("upload_error")) {
                  $('#myModal').modal('show');
                  $('.modal-body').html('File Upload Failed');
                  // alert("File Upload Failed");
               } else if (add_father) {
                  window.opener.get_ring(data.match("ring=&(.*)&")[1]);
                  // window.opener.document.getElementById("father").parentElement.getElementsByTagName("input")[0].value = data.match("ring=&(.*)&")[1]
                  window.close();
               } else if (add_mother) {
                  window.opener.get_ring(data.match("ring=&(.*)&")[1]);
                  // window.opener.document.getElementById("mother").parentElement.getElementsByTagName("input")[0].value = data.match("ring=&(.*)&")[1]
                  window.close();
               } else if (1) {
                  // window.location = '?submitted';
                  document.getElementById("form").reset();
                  $('#p_image, #a_image').trigger('change');
                  $(window).scrollTop($('html').position().top);
                  $('#submitted').css('display', 'block').fadeOut(2000, 'linear');
               }

               $('#submit_btn, #wait_btn').toggleClass('d-none');

            }
         });

         // return false;
      }); //End of Form Values Submitting


      // $(".niceCountryInputSelector").each(function(i, e) {
      //    new NiceCountryInput(e).init();
      // });

      if (window.location.href.includes("add=father")) {
         $("a#navbar_name").html("Add Father")
         $("#cock").click();
         add_father = true;
      }
      if (window.location.href.includes("add=mother")) {
         $("a#navbar_name").html("Add Mother");
         $("#hen").click();
         add_mother = true;
      }

   }); //End of document.ready Function

   // Single images preview
   var imagesPreview = function(input) {
      $('.p_image_t').remove();
      if (input.files) {
         var filesAmount = input.files.length;
         for (i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
            reader.onload = function(event) {
               $("input#p_image").after('<img class="p_image_t" src=' + event.target.result + ' style="height:80px;" >');
               // $("img:last").attr('src', event.target.result);
            }
            reader.readAsDataURL(input.files[i]);
         }
      }
   };

   // Multiple images preview
   var imagesPreview2 = function(input) {
      $('.a_image_t').remove();
      if (input.files) {
         var filesAmount = input.files.length;
         for (i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
            reader.onload = function(event) {
               $("input#a_image").after('<img class="a_image_t" src=' + event.target.result + ' style="height:80px;" >');
               // $("img:last").attr('src', event.target.result);
            }
            reader.readAsDataURL(input.files[i]);
         }
      }
   };

   $('#p_image').on('change', function() {
      imagesPreview(this);
   });
   $('#a_image').on('change', function() {
      imagesPreview2(this);
   });


   get_ring();

   function get_ring(selection) {
      $.post("get_ring.php", {})
         .done(function(data) {
            data = JSON.parse(data);
            ringArray = data[0].concat(data[1]).sort();
            fatherArray = data[0].sort();
            motherArray = data[1].sort();

            $('select#father').html('<option value="" selected></option>');
            $('select#mother').html('<option value="" selected></option>');
            fatherArray.forEach(function(element, i) {
               if (selection == element) {
                  $('select#father').append('<option selected value="' + element + '">' + element + '</option>');
                  $('#father').parent().find('input').val(selection);
               } else {
                  $('select#father').append('<option value="' + element + '">' + element + '</option>');
               }
            });
            motherArray.forEach(function(element, i) {
               if (selection == element) {
                  $('select#mother').append('<option selected value="' + element + '">' + element + '</option>');
                  $('#mother').parent().find('input').val(selection);
               } else {
                  $('select#mother').append('<option value="' + element + '">' + element + '</option>');
               }
            });

            console.log(data);
         });
   }
</script>