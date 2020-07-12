<link href="https://www.jqueryscript.net/demo/Datetime-Picker-jQuery-Moment/css/datetimepicker.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	
   
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.0/moment-with-locales.min.js"></script>
    <script type="text/javascript" src="edit_src/datetimepicker.js"></script>
    <script type="text/javascript" src="edit_src/autocomplete.js"></script>

    <link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
<style>
.close_button {
	float: right;
    position: relative;
    display: inline-block;
    width: 50px;
    height: 50px;
    overflow: hidden;
    top: 0px;
}
.close_button:hover::before, .close_button:hover::after {
  background: #1ebcc5;
}
.close_button::before, .close_button::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 100%;
  top: 50%;
  left: 0;
  margin-top: -1px;
  background: #000;
}
.close_button::before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.close_button::after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.close_button.black::before, .close_button.black::after {
  height: 8px;
  margin-top: -4px;
}
ul.items.dropdown-menu{
	padding:0px !important;
}
ul.items.dropdown-menu li a{
	height: 23px;
    font-size: 20px;
}
ul.items.dropdown-menu li a:hover{
	background-color:red;
}

</style>

<script>
var sendData="";
var modules=[];
estimation_value='<div class="col-xs-12 col-sm-8 edit-view-field " ><div class="col-xs-12 col-sm-4 label" style="margin-top: 10px;width: max-content;margin-right: 25px;" >Estimated Amount:</div><input style="font-size:20px;width: 40%;margin-right: 5px;text-align:right;" type="text"  id="estimation_value" size="30" maxlength="255" value="" title="" onkeyup="format(this)" ><p style="font-size:20px;display:inline;font-style: italic;">Rs.</p></div>'

date_result='<div style="width: 250px;margin: 55px 0px 15px 153px;"><div class="picker"> </div><input type="hidden" class="date_result" value="" /></div>'

comment_box='<div class="col-xs-12 col-sm-12 edit-view-row-item"><div class="col-xs-12 col-sm-2 label" >Comment:</div><div class="col-xs-12 col-sm-8 edit-view-field " type="text" field="description" colspan="3"><textarea id="description" name="description_box" rows="2" cols="180" title="" tabindex="0"></textarea></div></div>'

customer_notified='<div class="col-xs-12 col-sm-6 edit-view-row-item" style="margin-top: 11px;" ><div class="col-xs-12 col-sm-4 label" style="padding-top: 5px;white-space:nowrap;text-align: center;width: fit-content;" >Customer Notified:</div><div class="col-xs-12 col-sm-8 edit-view-field "  type="bool"     style="padding-left: 10px;width: fit-content;" ><input type="hidden" value="0"><input type="checkbox" id="customer_notified"  checked="checked" title="" tabindex="0"></div></div>'

select_dropdown='\
<div class="col-xs-12 col-sm-12 edit-view-row-item">\
<div class="col-xs-12 col-sm-2 label" data-label="LBL_STATUS" style="color: rgb(255, 0, 0); padding-top: 10px;">Current Status:*</div>\
<div class="col-xs-12 col-sm-8 edit-view-field " type="enum" field="status" colspan="3">\
<select name="status" id="status" title="">\
<option label="In_Progress" value="In_Progress">In Progress</option>\
<option label="Delivered" value="Completed">Delivered</option>\
<option label="Estimation" value="Estimation">Estimation</option>\
<option label="Third_Party_Repair" value="Third_Party_Repair">Third_Party_Repair</option>\
<option label="Waiting_for_Customer" value="Waiting_for_Customer">Waiting_for_Customer</option>\
<option label="Waiting_for_Parts" value="Waiting_for_Parts">Waiting_for_Parts</option>\
<option label="Discarded" value="Discarded">Discarded</option>\
<option label="Postponed" value="Postponed">Postponed</option>\
<option label="Not_Started" value="Not_Started">Not Started</option>\
</select>\
</div>\
</div>'

Waiting_for_Customer='<div class="Waiting_for_Customer"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:10px;" >Status: &nbsp&nbsp Waiting for Cutomer</div>'+customer_notified + date_result + comment_box+'</div>'

Estimation='<div class="Estimation"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:10px;" >Status: &nbsp&nbsp Estimation</div>'+estimation_value + date_result + comment_box+'</div>'

In_Progress='<div class="In_Progress"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp In_Progress</div>'+ date_result + comment_box+'</div>'

Completed='<div class="Completed"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp Delivered</div>'+ date_result + comment_box+'</div>'

Discarded='<div class="Discarded"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp Discarded</div>'+ date_result + comment_box+'</div>'

Not_Started='<div class="Not_Started"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp Not_Started</div>'+ date_result + comment_box+'</div>'

Postponed='<div class="Postponed"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp Postponed</div>'+ date_result + comment_box+'</div>'

Third_Party_Repair='<div class="Third_Party_Repair"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp Third Party Repair</div>    <div style="     height: 20px;     position: relative;     top: 30px;     margin-top: 29px; ">   <div class="col-xs-12 col-sm-8 edit-view-field " style="     width: 58%; "><div class="col-xs-12 col-sm-4 label" style="margin-top: 10px;width: max-content;margin-right: 25px;">Part Name:</div><input style="width: 40%;margin-right: 5px;" type="text" id="part_name" size="30" maxlength="255" value="" title=""></div>   <div class="col-xs-12 col-sm-8 edit-view-field " style="     display: inline;     float: right;     width: 50%;     margin-left: -200px; "><div class="col-xs-12 col-sm-4 label" style="margin-top: 10px;width: max-content;margin-right: 25px;">Repairer:</div><input style="width: 45%;margin-right: 5px;" type="text" id="repairer" size="30" maxlength="255" value="" title=""></div>   </div>'+ date_result + comment_box+'</div>'

Waiting_for_Parts='<div class="Waiting_for_Parts"  name="custom_module" style="background-color:lightsteelblue;display:inline-block;border-radius: 6px;padding:15px;margin-bottom:15px;" >'+'<div class="close_button black"></div><div style="font-size:17px;font-weight:600;margin-bottom:-41px;" >Status: &nbsp&nbsp Waiting for Parts</div>   <div style="height: 20px;position: relative;     top: 30px;     margin-top: 29px; ">   <div class="col-xs-12 col-sm-8 edit-view-field " style="     width: 58%; "><div class="col-xs-12 col-sm-4 label" style="margin-top: 10px;width: max-content;margin-right: 25px;">Part Name:</div><input style="width: 40%;margin-right: 5px;" type="text" id="part_name_wait" size="30" maxlength="255" value="" title=""></div>   <div class="col-xs-12 col-sm-8 edit-view-field " style="     display: inline;     float: right;     width: 50%;     margin-left: -200px; "><div class="col-xs-12 col-sm-4 label" style="margin-top: 10px;width: max-content;margin-right: 25px;">Preferred Model:</div><input style="width: 45%;margin-right: 5px;" type="text" id="model_name_wait" size="30" maxlength="255" value="" title=""></div>   </div>'+ date_result + comment_box+'</div>'


$(document).ready(function(){
$('div[data-label=LBL_STATUS]').text("New Current Status:*").css("color", "red").css("padding-top","10px").css("margin-left","-15px").css("margin-right","34px").css("white-space","nowrap");

$( '<input title="Save" class="button" type="button" name="button" value="Save" id="savedown">' ).insertBefore( "#EditView > div.buttons #SAVE" );
$( '<input title="Save" class="button" type="button" name="button" value="Save" onclick="$( \'#savedown\' ).click()" id="saveup">' ).insertBefore( "#EditView > table > tbody > tr > td.buttons > div #SAVE" );
$('input[accesskey=a]').hide();

$('#content').css('padding-top','20px');
$('#pagecontent > p.error').remove();
// $('#pagecontent > p:nth-child(2)').remove();
$(' <div id="dialog-message" style="display:none;color:red;" title="System Error"><p style="color:black;font-size: 15px;"> Critical System Error.<br>Contact Your System Administrator as soon as possible. </p><div id="error_box" style="overflow:scroll;height:140px;margin-top: 20PX;border: 1px solid #4f4949;border-radius: 5px;padding: 5px;" >Unknown Error</div></div>').insertBefore('#content')

$.get("edit_src/get_repair.php", function(data, status){
  console.log(JSON.parse(data));
});

$.post("edit_src/edit_tasks_response.php",
                function(data,status) {
                   responseText(data);console.log(data);
                }); 

$('input').attr('autocomplete','off');

$('#name').parent().prepend('<input type="hidden" id="hidden-field" >')


$.get("edit_src/get_bugs.php", function(data, status){
	  var str = JSON.parse(data);console.log(data);
	  myData = window.myData;
	  // str = str.slice(0, -2);str+="]";console.log(escape_char(str));window.str=escape_char(str);str=JSON.parse(escape_char(str));
	  window.myData= str.sort(function(a,b){ return a['name'] > b['name'] ? 1 : -1; });
	  var myDataNew = []
	  for (var i = 0; i < myData.length; i++) {
		myData[i]['name'] = myData[i]['name'].replace(/  +/g, ' ')
		myData[i]['name'] = myData[i]['name'].trim()
		if(myDataNew.indexOf(myData[i]['name'])== -1){myDataNew.push(myData[i]['name'])}
		
	  }
	  myData=[]
	  for (var i = 0; i < myDataNew.length; i++) {
		myData.push({'name':myDataNew[i]})
	  }
		console.log(myData);
	$('#name').autocomplete({
  nameProperty: 'name',
  valueField: '#hidden-field',
  dataSource: myData,
  selectFirstMatch: false,
  distinct: true
});

// $('input#name').val($('input#name').attr('value'));
// window.serviceval=$('input#name').attr('value')
// $('#name').focusout(function(){window.serviceval=$('input#name').val();console.log($('input#name').val());

	// $('body').mouseup(function(event){  $('#name').val(window.serviceval);console.log('OUT :'+$('input#name').val());});
// })
$('input#name').val($('input#name').attr('value'));

$('input#name').keydown(function(event){
	if(event.keyCode == 17) {
		event.preventDefault();
		console.log("Ctrl Event Captured "+$('ul.items.dropdown-menu').css('display'));
		$('ul.items.dropdown-menu li:first-child').click();
		if($('ul.items.dropdown-menu').css('display')=="block"){console.log('qw');$('ul.items.dropdown-menu li:first-child').click();}
	}
	
})


// $('ul.items.dropdown-menu').click(function(){
	// window.serviceval=$('#name').val();
// })


});



$('select#status').change(function(){
	if(window.location.href.indexOf('record=')!=-1){
	var selectStaus = $('select#status').val();
	// modules.push(selectStaus);
	$(".col-xs-12.col-sm-12.edit-view-row-item").last().before(window[selectStaus]);
	$('.'+ $('select#status').val()+':last' ).find(".picker").dateTimePicker({
  selectData: "now",
  positionShift: { top: -100, left: 0},
  title: "Select Date and Time",
  buttonTitle: "Select"
});
	$('.'+ $('select#status').val()+':last' ).find("input.date_result").val($('.'+ $('select#status').val()+':last' ).find(".picker span:nth-child(1)").html() +" "+$('.'+ $('select#status').val()+':last' ).find(".picker span:nth-child(3)").html());
	$('input').attr('autocomplete','off');
	
	$('.'+ $('select#status').val()+':last' ).find("#estimation_value").ForceNumericOnly();
	
	$("html, body").animate({ scrollTop: $(document).height() }, 600);
	$('div.close_button.black').click(function(){
	$(this).parent().remove();
	
});
}
});



$('#savedown').click(function(){
	console.log('Button Clicked');sendData="";
	$('[name=custom_module]').each(function(i, obj) {
    if($(obj).attr('class')=='Estimation'){sendData += '&name[]=' + $(obj).attr('class') + "&field1[]=" + $(obj).find('#estimation_value').val() + "&field2[]=" + $(obj).find('.date_result').val() + "&field3[]=" + $(obj).find('#description').val()  +  "&field4[]=" }
	if($(obj).attr('class')=='In_Progress'){sendData += '&name[]=' + $(obj).attr('class') +  "&field1[]=" + $(obj).find('.date_result').val() + "&field2[]=" + $(obj).find('#description').val() +  "&field3[]=" +  "&field4[]=" }
	if($(obj).attr('class')=='Completed'){sendData += '&name[]=' + $(obj).attr('class') +  "&field1[]=" + $(obj).find('.date_result').val() + "&field2[]=" + $(obj).find('#description').val() +  "&field3[]=" +  "&field4[]=" }
	if($(obj).attr('class')=='Discarded'){sendData += '&name[]=' + $(obj).attr('class') +  "&field1[]=" + $(obj).find('.date_result').val() + "&field2[]=" + $(obj).find('#description').val() +  "&field3[]=" +  "&field4[]=" }
	if($(obj).attr('class')=='Not_Started'){sendData += '&name[]=' + $(obj).attr('class') +  "&field1[]=" + $(obj).find('.date_result').val() + "&field2[]=" + $(obj).find('#description').val() +  "&field3[]=" +  "&field4[]=" }
	if($(obj).attr('class')=='Postponed'){sendData += '&name[]=' + $(obj).attr('class') + "&field1[]=" + $(obj).find('.date_result').val() + "&field2[]=" + $(obj).find('#description').val() +  "&field3[]=" +  "&field4[]=" }
	
	if($(obj).attr('class')=='Waiting_for_Customer'){sendData += '&name[]=' + $(obj).attr('class') + "&field1[]=" + $(obj).find('#customer_notified').is(':checked') + "&field2[]=" + $(obj).find('.date_result').val()+ "&field3[]=" + $(obj).find('#description').val() +  "&field4[]=" }
	
	if($(obj).attr('class')=='Third_Party_Repair'){sendData += '&name[]=' + $(obj).attr('class') +  "&field1[]=" + $(obj).find('#part_name').val() + "&field2[]=" + $(obj).find('#repairer').val() +  "&field3[]=" + $(obj).find('.date_result').val() + "&field4[]=" + $(obj).find('#description').val()}
	if($(obj).attr('class')=='Waiting_for_Parts'){sendData += '&name[]=' + $(obj).attr('class') +  "&field1[]=" + $(obj).find('#part_name_wait').val() + "&field2[]=" + $(obj).find('#model_name_wait').val() +  "&field3[]=" + $(obj).find('.date_result').val() + "&field4[]=" + $(obj).find('#description').val()}
	
	
});

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText+" Response");
	  if(this.responseText.includes('ErrorRecord')){
		
		$('#error_box').html(this.responseText);
		$( "#dialog-message" ).dialog({
			modal: true,
			buttons: {
			'I will inform': function() {
			$( this ).dialog( "close" );
			} 
		}}).prev(".ui-dialog-titlebar").css("color","black").css("background-color","#ff0000c2").parent().css("width","400px")
	
    }
  }
  }
  xhttp.open("POST", "edit_tasks.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(escape_char(sendData));console.log(escape_char(sendData)); 
  
  var xhttp4 = new XMLHttpRequest();
  xhttp4.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText+" Response2");
	  if(this.responseText.includes('ErrorRecord')){
		
		$('#error_box').html(this.responseText);
		$( "#dialog-message" ).dialog({
			modal: true,
			buttons: {
			'I will inform': function() {
			$( this ).dialog( "close" );
			} 
		}}).prev(".ui-dialog-titlebar").css("color","black").css("background-color","#ff0000c2").parent().css("width","400px")
	
    }
  }
  }
  xhttp4.open("POST", "create.php", true);
  xhttp4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if($('#name').val()==""){console.log("Empty Field");}
  else if(findIfExist()!=true){
	  xhttp4.send("service="+escape_char($('#name').val().toLowerCase())); 
	  console.log(escape_char($('#name').val()));
	  window.myData.push({"name":($('#name').val().toLowerCase())})
	  }
  $('#name').val($('#name').val().toLowerCase());
  $('#SAVE').click();
});








});


















function responseText(responseResponse){
	// responseResponse=responseResponse.replace(/[\n]/g, '\\n');
	var nowTime;console.log(responseResponse);
	try{window.responseResponse=JSON.parse(responseResponse);
	}
	catch(err){
		$('#error_box').html(err);
		$( "#dialog-message" ).dialog({
			modal: true,
			buttons: {
			'I will inform': function() {
			$( this ).dialog( "close" );
   } 
}}).prev(".ui-dialog-titlebar").css("color","black").css("background-color","#ff0000c2").parent().css("width","400px")
	}
	responseResponse=window.responseResponse;
	console.log(responseResponse);
	for (var i=0;i<responseResponse.length-1;i++){
	var selectStaus = responseResponse[i]['name']; 
	$(".col-xs-12.col-sm-12.edit-view-row-item").last().before(window[selectStaus]);
	obj='.'+ selectStaus +':last' ;console.log(obj);
	
	
	if(selectStaus=='In_Progress'){
		nowTime=responseResponse[i]['field1'];
		$(obj).find('#description').val(responseResponse[i]['field2'])
	}
	if(selectStaus=='Completed'){
		nowTime=responseResponse[i]['field1'];
		$(obj).find('#description').val(responseResponse[i]['field2'])
	}
	if(selectStaus=='Discarded'){
		nowTime=responseResponse[i]['field1'];
		$(obj).find('#description').val(responseResponse[i]['field2'])
	}
	if(selectStaus=='Not_Started'){
		nowTime=responseResponse[i]['field1'];
		$(obj).find('#description').val(responseResponse[i]['field2'])
	}
	if(selectStaus=='Postponed'){
		nowTime=responseResponse[i]['field1'];
		$(obj).find('#description').val(responseResponse[i]['field2'])
	}
	if(selectStaus=='Estimation'){
		$(obj).find('#estimation_value').val(responseResponse[i]['field1']); 
		nowTime=responseResponse[i]['field2'];
		$(obj).find('#description').val(responseResponse[i]['field3']);
		$(obj).find('#estimation_value').ForceNumericOnly();
	}
	if(selectStaus=='Waiting_for_Customer'){
		if(responseResponse[i]['field1']=='false'){$("#customer_notified").removeAttr('checked')} 
		nowTime=responseResponse[i]['field2']; 
		$(obj).find('#description').val(responseResponse[i]['field3']);
	}
	if(selectStaus=='Third_Party_Repair'){
		$(obj).find('#part_name').val(responseResponse[i]['field1']);
		$(obj).find('#repairer').val(responseResponse[i]['field2']);
		nowTime=responseResponse[i]['field3'];
		$(obj).find('#description').val(responseResponse[i]['field4'])
	}		
	if(selectStaus=='Waiting_for_Parts'){
		$(obj).find('#part_name_wait').val(responseResponse[i]['field1']);
		$(obj).find('#model_name_wait').val(responseResponse[i]['field2']);
		nowTime=responseResponse[i]['field3'];
		$(obj).find('#description').val(responseResponse[i]['field4'])
	}
	
	

	
	
	
	$(obj).find(".picker").dateTimePicker({
  selectData: nowTime,
  positionShift: { top: -100, left: 0},
  title: "Select Date and Time",
  buttonTitle: "Select"
});
	$(obj ).find("input.date_result").val($(obj).find(".picker span:nth-child(1)").html() +" "+$(obj).find(".picker span:nth-child(3)").html())
	
	// $("html, body").animate({ scrollTop: $(document).height() }, 600);
	$('div.close_button.black').click(function(){
	$(this).parent().remove();
	
});
};







}


function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}
escape_char = function (str) {
  return str
    .replace(/[\\]/g, '\\\\\\\\')
    .replace(/[\']/g, "\\\'")
    .replace(/[\"]/g, '\\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};
function format(input)
            {
                var nStr = input.value + '';
                nStr = nStr.replace( /\,/g, "");
                x = nStr.split( '.' );
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while ( rgx.test(x1) ) {
                    x1 = x1.replace( rgx, '$1' + ',' + '$2' );
                }
                input.value = x1 + x2;
            };
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {	ctrlPushed=false;
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
			if(key==17){ctrlPushed=true}
            if(ctrlPushed==true){return true}
			else{
            return (
				
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
			}
				
        });$(this).keyup(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
			if(key==17){ctrlPushed=false}
            
				
        });
    });
};

function findIfExist(){
	$('#name').val($('#name').val().replace(/  +/g, ' '));
	$('#name').val($('#name').val().trim());
	for(var i=0;i<window.myData.length;i++){
	if(window.myData[i]["name"].toLowerCase()==$('#name').val().toLowerCase()){return true}
}}
			
</script>
