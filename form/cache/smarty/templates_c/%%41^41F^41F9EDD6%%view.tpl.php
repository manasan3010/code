<?php /* Smarty version 2.6.31, created on 2020-04-24 12:48:11
         compiled from C:%5Cxampp%5Chtdocs%5Cform%5Cmodules%5CAdministration%5CSearch/view.tpl */ ?>
<?php require_once(SMARTY_CORE_DIR . 'core.load_plugins.php');
smarty_core_load_plugins(array('plugins' => array(array('function', 'sugar_translate', 'C:\\xampp\\htdocs\\form\\modules\\Administration\\Search/view.tpl', 38, false),array('function', 'sugar_help', 'C:\\xampp\\htdocs\\form\\modules\\Administration\\Search/view.tpl', 60, false),array('function', 'html_options', 'C:\\xampp\\htdocs\\form\\modules\\Administration\\Search/view.tpl', 68, false),)), $this); ?>
<h1><?php echo smarty_function_sugar_translate(array('label' => 'LBL_SEARCH_HEADER'), $this);?>
</h1>

<form id="SearchSettings"
      name="ConfigureSettings"
      class="detail-view"
      enctype='multipart/form-data'
      method="POST"
      action="index.php?module=Administration&action=SearchSettings&do=Save">

    <table class="edit view" width="100%" cellspacing="1" cellpadding="0" border="0">
        <tr>
            <th scope="row" colspan="4" align="left">
                <h4><?php echo smarty_function_sugar_translate(array('label' => 'LBL_SEARCH_INTERFACE'), $this);?>
</h4>
            </th>
        </tr>

        <tr>
                        <td>
                <div class="td-container">
                    <div>
                        <label for="search-engine"><?php echo smarty_function_sugar_translate(array('label' => 'LBL_SEARCH_ENGINE'), $this);?>
</label>
                        <?php echo smarty_function_sugar_help(array('text' => $this->_tpl_vars['MOD']['LBL_SEARCH_ENGINE_TOOLTIP']), $this);?>

                    </div>
                    <div>
                        <small class="form-text text-muted"><?php echo smarty_function_sugar_translate(array('label' => 'LBL_SEARCH_ENGINE_HELP'), $this);?>
</small>
                    </div>
                </div>
            </td>
            <td scope="row" style="vertical-align: middle">
                <?php echo smarty_function_html_options(array('options' => $this->_tpl_vars['engines'],'selected' => $this->_tpl_vars['selectedEngine'],'id' => "search-engine",'name' => "search-engine",'class' => "form-control"), $this);?>

            </td>
        </tr>
    </table>

    <div class="settings-buttons">
        <?php echo $this->_tpl_vars['BUTTONS']; ?>

    </div>

    <?php echo $this->_tpl_vars['JAVASCRIPT']; ?>


    <script src="modules/Administration/Search/ajaxSubmit.js"></script>

</form>