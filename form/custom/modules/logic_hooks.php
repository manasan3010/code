<?php
// Do not store anything in this file that is not part of the array or the hook version.  This file will	
// be automatically rebuilt in the future. 
$hook_version = 1;
$hook_array = array();
// position, file, function 
$hook_array['after_save'] = array();
$hook_array['after_save'][] = array(1, 'AOD Index Changes', 'modules/AOD_Index/AOD_LogicHooks.php', 'AOD_LogicHooks', 'saveModuleChanges');
$hook_array['after_save'][] = array(1, 'ElasticSearch Index Changes', 'lib/Search/ElasticSearch/ElasticSearchHooks.php', 'SuiteCRM\Search\ElasticSearch\ElasticSearchHooks', 'beanSaved');
$hook_array['after_save'][] = array(30, 'popup_select', 'modules/SecurityGroups/AssignGroups.php', 'AssignGroups', 'popup_select');
$hook_array['after_save'][] = array(31, 'send_status_sms', 'custom/Extension/modules/Tasks/Ext/LogicHooks/SMSIntegration.php', 'SMSIntegration', 'sendSMS');
$hook_array['after_delete'] = array();
$hook_array['after_delete'][] = array(1, 'AOD Index changes', 'modules/AOD_Index/AOD_LogicHooks.php', 'AOD_LogicHooks', 'saveModuleDelete');
$hook_array['after_delete'][] = array(1, 'ElasticSearch Index Changes', 'lib/Search/ElasticSearch/ElasticSearchHooks.php', 'SuiteCRM\Search\ElasticSearch\ElasticSearchHooks', 'beanDeleted');
$hook_array['after_restore'] = array();
$hook_array['after_restore'][] = array(1, 'AOD Index changes', 'modules/AOD_Index/AOD_LogicHooks.php', 'AOD_LogicHooks', 'saveModuleRestore');
$hook_array['after_ui_footer'] = array();
$hook_array['after_ui_footer'][] = array(10, 'popup_onload', 'modules/SecurityGroups/AssignGroups.php', 'AssignGroups', 'popup_onload');
$hook_array['after_ui_frame'] = array();
$hook_array['after_ui_frame'][] = array(20, 'mass_assign', 'modules/SecurityGroups/AssignGroups.php', 'AssignGroups', 'mass_assign');
$hook_array['after_ui_frame'][] = array(1, 'Load Social JS', 'include/social/hooks.php', 'hooks', 'load_js');
