
{if strlen($fields.last_name.value) <= 0}
{assign var="value" value=$fields.last_name.default_value }
{else}
{assign var="value" value=$fields.last_name.value }
{/if}  
<input type='text' name='{$fields.last_name.name}' 
    id='{$fields.last_name.name}' size='30' 
    maxlength='100' 
    value='{$value}' title=''  tabindex='1'      >