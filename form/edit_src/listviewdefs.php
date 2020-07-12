<script>
console.log('Custome code injected')
$(document).ready(function(){
	$('a').attr('target','_blank');
	$('#customSearch').remove()
	// $('a[href^=javascript]').attr('target','');$('div.moduleTitle').prepend('<input type="number" onchange="searchId(this);" onkeyup="searchId(this);" placeholder="Task ID Search" style="margin-left: 30px;"> <button type="button" onclick="$(this).prev().val(\'\');searchId($(this).prev());" id="clear_id" tabindex="0" title="Clear ID" class="button lastChild" >X</button>      <input onkeyup="searchContact(this);" placeholder="Contact / Service Search" style="margin-left: 30px;"> <button type="button" onclick="$(this).prev().val(\'\');searchId($(this).prev());" id="clear_id" tabindex="0" title="Clear Contact Search" class="button lastChild" >X</button>')
	$('a[href^=javascript]').attr('target','');$('div.moduleTitle').prepend('<div id="customSearch" ><input type="number" onchange="postID(this);" placeholder="Task ID Search" style="margin-left: 30px;"> <button type="button" id="clear_id" tabindex="0" title="Search ID" class="button lastChild" >Search</button>      <input  onchange="postContact(this);" placeholder="Customer Search" style="margin-left: 30px;"> <button type="button" id="clear_id" tabindex="0" title="Search ID" class="button lastChild" >Search</button> </div>')

$('tr.oddListRowS1, .evenListRowS1').click(function(){
window.open($(this).find('a.edit-link').attr('href'));

})
$("a.list-view-data-icon,a.edit-link").click(function(e) {
        e.stopPropagation();
   });
   $("td[field=contact_name] a").click(function(e) {
        e.stopPropagation();
   });
   $("td[field=name] a").click(function(e) {
        e.stopPropagation();
   });
$("td:has(.listview-checkbox)").click(function(e) {
        e.stopPropagation();
   });
$("td[field=name] a").click(function(e) {
        e.stopPropagation();
   });

$('td[field=task_number_c]').css('cursor','pointer');
$('#admin_options').html("Modified by Manasan")

// $('#task_number_c_basic').on('change',()=>{
	// var oldID = $('#task_number_c_basic').val()
	// $('#task_number_c_basic').val("0".repeat(6-oldID.length)+oldID)
// })


})
function searchId(input){
	console.log(input.value);
	$('td[field=task_number_c]').parent().css('display','none')
	$('td[field=task_number_c]:contains('+input.value+')').parent().css('display','')
	if(input.value==undefined){$('td[field=task_number_c]').parent().css('display','')}
}
function postID(input){
	listViewSearchIcon.toggleSearchDialog('basic');
	setTimeout(()=>{
	console.log(input.value);
	// $.post( "index.php?module=Tasks&action=index", "searchFormTab=basic_search&module=Tasks&action=index&query=true&orderBy=&sortOrder=&current_user_only_basic=0&open_only_basic=0&favorites_only_basic=0&date_entered_basic_range_choice=%3D&range_date_entered_basic=&start_range_date_entered_basic=&end_range_date_entered_basic=&task_number_c_basic=000045&button=Search", function( data ) {
$('#task_number_c_basic').val(input.value)
$('#search_form_submit').click()
	},1000)
}
function postContact(input){
	listViewSearchIcon.toggleSearchDialog('advanced');
	setTimeout(()=>{
	console.log(input.value);
	$('#contact_name_advanced').val(input.value)
$('#search_form_submit_advanced').click()
	},1000)
}


function searchContact(input){
	console.log(input.value);
	$('td[field=contact_name]').parent().css('display','none')
	$('td[field=contact_name] a:contains('+input.value+')').parent().parent().css('display','')
	$('td[field=name] b a:contains('+input.value+')').parent().parent().parent().css('display','')
	if(input.value==undefined){$('td[field=task_number_c]').parent().css('display','')}
}

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
</script>
