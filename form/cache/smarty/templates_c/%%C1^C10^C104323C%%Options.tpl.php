<?php /* Smarty version 2.6.31, created on 2020-02-10 07:27:55
         compiled from modules/SugarFeed/Dashlets/SugarFeedDashlet/Options.tpl */ ?>
<?php require_once(SMARTY_CORE_DIR . 'core.load_plugins.php');
smarty_core_load_plugins(array('plugins' => array(array('function', 'html_options', 'modules/SugarFeed/Dashlets/SugarFeedDashlet/Options.tpl', 69, false),)), $this); ?>


<div style='width:100%'>
<form name='configure_<?php echo $this->_tpl_vars['id']; ?>
' action="index.php" method="post">
<input type='hidden' name='id' value='<?php echo $this->_tpl_vars['id']; ?>
'>
<input type='hidden' name='module' value='Home'>
<input type='hidden' name='action' value='ConfigureDashlet'>
<input type='hidden' name='to_pdf' value='true'>
<input type='hidden' name='configure' value='true'>
<table width="100%" cellpadding="0" cellspacing="0" border="0" class="edit view" align="center">
<tr>
    <td scope='row'><?php echo $this->_tpl_vars['titleLBL']; ?>
</td>
    <td>
    	<input type="text" class="text" name="title" size='20' maxlength='80' value='<?php echo $this->_tpl_vars['title']; ?>
'>
    </td>
</tr>
<?php if ($this->_tpl_vars['isRefreshable']): ?>
<tr>
    <td scope='row'>
        <?php echo $this->_tpl_vars['autoRefresh']; ?>

    </td>
    <td>
        <select name='autoRefresh'>
            <?php echo smarty_function_html_options(array('options' => $this->_tpl_vars['autoRefreshOptions'],'selected' => $this->_tpl_vars['autoRefreshSelect']), $this);?>

        </select>
    </td>
</tr>
<?php endif; ?>
<tr>
    <td scope='row'><?php echo $this->_tpl_vars['rowsLBL']; ?>
</td>
    <td>
    	<input type="text" class="text" name="rows" size='3' value='<?php echo $this->_tpl_vars['rows']; ?>
'>
    </td>
</tr>
<tr>
    <td scope='row'><?php echo $this->_tpl_vars['categoriesLBL']; ?>
</td>
    <td>
        <select name='categories[]' multiple=true size=6 onchange='getMultiple(this);' id='categories_<?php echo $this->_tpl_vars['id']; ?>
'>
    	<?php echo smarty_function_html_options(array('options' => $this->_tpl_vars['categories'],'selected' => $this->_tpl_vars['selectedCategories']), $this);?>

    	</select>
    </td>
</tr>
<tr>
  <td align="right" colspan="2">
    <div id='externalApiDiv'>
    </div>
  </td>
</tr>
<tr>
    <td align="right" colspan="2">
        <input type='button' class='button' value='<?php echo $this->_tpl_vars['saveLBL']; ?>
' id='save_<?php echo $this->_tpl_vars['id']; ?>
' onclick='promptAuthentication(); if(SUGAR.dashlets.postForm("configure_<?php echo $this->_tpl_vars['id']; ?>
", SUGAR.mySugar.uncoverPage)) this.form.submit();'>
        <input type='submit' class='button' value='<?php echo $this->_tpl_vars['clearLBL']; ?>
' onclick='SUGAR.searchForm.clear_form(this.form,["title","autoRefresh","rows"]);return false;'>
   	</td>
</tr>
</table>
<script language='javascript'>
var externalApiList = <?php echo $this->_tpl_vars['externalApiList']; ?>
;
var authenticatedExternalApiList = new Array();
<?php echo '


function getMultiple(ob){
    var showAll = false;
    var selected = new Array();
    for (var i = 0; i < ob.options.length; i++){
        if (ob.options[ i ].selected){
            selected.push(ob.options[ i ].value);
            if(ob.options[ i ].value == \'ALL\'){
                showAll = true;
            }
        }
    }
    var buttonHtml = \'\';
    if(showAll){
        for (var j = 0; j < externalApiList.length; j++) 
        {
            if(!authenticatedExternalApiList[externalApiList[j]])
            {
	            buttonHtml += \'<div id="\' + externalApiList[j] + \'_div" style="visibility:;"><a href="#" onclick="window.open(\\\'index.php?module=EAPM&callbackFunction=hideExternalDiv&closeWhenDone=1&action=QuickSave&application=\'+externalApiList[j]+\'\\\',\\\'EAPM\\\');">'; ?>
<?php echo $this->_tpl_vars['authenticateLBL']; ?>
<?php echo ' \'+externalApiList[j]+\'</a></div>\';
            }
        }
    }else{
        for (var i = 0; i < selected.length; i++){
            for (var j = 0; j < externalApiList.length; j++)
            {
                if(selected[i] == externalApiList[j] && !authenticatedExternalApiList[externalApiList[j]]) 
                {
                    buttonHtml += \'<div id="\' + externalApiList[j] + \'_div" style="visibility:";><a href="#" onclick="window.open(\\\'index.php?module=EAPM&callbackFunction=hideExternalDiv&closeWhenDone=1&action=QuickSave&application=\'+externalApiList[j]+\'\\\',\\\'EAPM\\\');">'; ?>
<?php echo $this->_tpl_vars['authenticateLBL']; ?>
<?php echo ' \'+externalApiList[j]+\'</a></div>\';
                }
            }
        }
    }
    document.getElementById(\'externalApiDiv\').innerHTML = buttonHtml;
}

function initExternalOptions(){
    var ob = document.getElementById(\''; ?>
categories_<?php echo $this->_tpl_vars['id']; ?>
<?php echo '\');
    getMultiple(ob);
}

function hideExternalDiv(id)
{
    //Hide the div for the external API link, set the authenticated Array list to true
    if(YAHOO.util.Dom.get(id + \'_div\'))
    {
		YAHOO.util.Dom.get(id + \'_div\').style.visibility = \'hidden\';
		authenticatedExternalApiList[id] = true;
	}
}

function promptAuthentication()
{
    //This is how we know that not all external API links were authenticated
'; ?>

     categoryElement = YAHOO.util.Dom.get('categories_<?php echo $this->_tpl_vars['id']; ?>
');  
<?php echo ' 
    //Only check for prompt warning if the \'ALL\' option was selected
    if(categoryElement.selectedIndex != -1 && categoryElement.options[categoryElement.selectedIndex].value != \'ALL\')
    {
       return;
    }
    
	if(authenticatedExternalApiList.length < externalApiList.length)
	{
'; ?>

		if(!confirm("<?php echo $this->_tpl_vars['autenticationPendingLBL']; ?>
")) 
<?php echo '		
		{
		    //Cancel form submission here
		    e = event ? event : window.event;
		    if (e.preventDefault) e.preventDefault();
		    e.returnValue = false;
		    e.cancelBubble = true;
		    if (e.stopPropagation) e.stopPropagation();
		}
	}
}

YAHOO.util.Event.onDOMReady(initExternalOptions);
</script>
'; ?>

</form>
</div>