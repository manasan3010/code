<script> 
if(times==undefined){
	var times=1;
	$(document).ready(function(){console.log("start");
						if($("#name_advanced").val()==$('body > table.list.view > tbody > tr:nth-child(1) > td:nth-child(2) > a').text() && $("#name_advanced").val()!="" )
					{$('body > table.list.view > tbody > tr:nth-child(1) > td:nth-child(2) > a').click();}

  // The button we're adding to the dropdowns
	var button = $('<li><a href="javascript:void(0)" onclick="alert(\'Hello, world!\')">New Button!</a></li>")');
	
	// Add item to "select all" dropdown button on list view
	$("#popup_query_form > table > tbody > tr:nth-child(2) > td:nth-child(1)").append('<input  type="submit" name="button" class="button" id="search_form_create" title="Create" value="Create">');
	
$("#search_form_create").click(function(){
});
	
	$("#search_form_create").click(function() { 
	if($('#name_advanced').val()==''){alert("Enter a Service Type to Create");return false;}
	$.post("create.php", { 
                    service: $("#name_advanced").val(), 
                }, 
                  
                function(data,status) { 
                    console.log(data); 

                }); 
		});
});



}
</script>




<?php
$popupMeta = array (
    'moduleMain' => 'Bug',
    'varName' => 'BUG',
    'orderBy' => 'bugs.name',
    'whereClauses' => array (
  'name' => 'bugs.name',
),
    'searchInputs' => array (
  0 => 'name',
),
    'searchdefs' => array (
  'name' => 
  array (
    'name' => 'name',
    'width' => '10%',
  ),
),
    'listviewdefs' => array (
  'NAME' => 
  array (
    'width' => '32%',
    'label' => 'LBL_LIST_SUBJECT',
    'default' => true,
    'link' => true,
    'name' => 'name',
  ),
),
);
