<?php /* Smarty version 2.6.31, created on 2020-02-10 07:34:26
         compiled from include/MySugar/tpls/dashletsSearchResults.tpl */ ?>
<?php require_once(SMARTY_CORE_DIR . 'core.load_plugins.php');
smarty_core_load_plugins(array('plugins' => array(array('function', 'counter', 'include/MySugar/tpls/dashletsSearchResults.tpl', 47, false),array('modifier', 'lower', 'include/MySugar/tpls/dashletsSearchResults.tpl', 53, false),array('modifier', 'replace', 'include/MySugar/tpls/dashletsSearchResults.tpl', 53, false),)), $this); ?>
<h4><?php echo $this->_tpl_vars['lblSearchResults']; ?>
 - <i><?php echo $this->_tpl_vars['searchString']; ?>
</i>:</h4>
<hr>
<?php if (count ( $this->_tpl_vars['dashlets'] )): ?>
<h3><?php echo $this->_tpl_vars['searchCategoryString']; ?>
</h3>
<table width="95%">
	<?php echo smarty_function_counter(array('assign' => 'rowCounter','start' => 0,'print' => false), $this);?>

	<?php $_from = $this->_tpl_vars['dashlets']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array'); }if (count($_from)):
    foreach ($_from as $this->_tpl_vars['module']):
?>
	<?php if ($this->_tpl_vars['rowCounter'] % 2 == 0): ?>
	<tr>
	<?php endif; ?>
		<td width="50%" align="left"><a id="<?php echo $this->_tpl_vars['module']['id']; ?>
_icon" href="javascript:void(0)" onclick="<?php echo $this->_tpl_vars['module']['onclick']; ?>
" style="text-decoration:none">
				<span class="suitepicon suitepicon-module-<?php echo ((is_array($_tmp=((is_array($_tmp=$this->_tpl_vars['module']['module_name'])) ? $this->_run_mod_handler('lower', true, $_tmp) : smarty_modifier_lower($_tmp)))) ? $this->_run_mod_handler('replace', true, $_tmp, '_', '-') : smarty_modifier_replace($_tmp, '_', '-')); ?>
"></span>&nbsp;
				<span class="mbLBLL" href="#" onclick="<?php echo $this->_tpl_vars['module']['onclick']; ?>
"><?php echo $this->_tpl_vars['module']['title']; ?>
</a><br /></td>
	<?php if ($this->_tpl_vars['rowCounter'] % 2 == 1): ?>
	</tr>
	<?php endif; ?>
	<?php echo smarty_function_counter(array(), $this);?>

	<?php endforeach; endif; unset($_from); ?>
</table>
<?php endif; ?>