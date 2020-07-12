<?php /* Smarty version 2.6.31, created on 2020-04-24 06:14:45
         compiled from modules/InboundEmail/tpls/checkImap.tpl */ ?>
<table cellpadding="0" cellspacing="0" width="100%" border="0" class="list view">
    <tr height="20">
        <td scope="col" width="25%" colspan="2">
            <span>
                <?php echo $this->_tpl_vars['MOD']['LBL_WARN_IMAP_TITLE']; ?>

            </span>
        </td>
    </tr>
    <tr>
        <td scope="row" valign=TOP bgcolor="#fdfdfd" width="20%">
            <span>'<?php echo $this->_tpl_vars['MOD']['LBL_WARN_IMAP']; ?>
</span>
        <td scope="row" valign=TOP class="oddListRowS1" bgcolor="#fdfdfd" width="80%">
        <span>
            <span class=error><?php echo $this->_tpl_vars['MOD']['LBL_WARN_NO_IMAP']; ?>
</span>
		</span>
        </td>
    </tr>
</table>
<br>