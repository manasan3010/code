<?php
$app_strings['LBL_GROUPTAB3_1560266291'] = 'Task_Menu';

$GLOBALS['app_list_strings']['task_priority_dom']=array (
  'High' => 'High',
  'Medium' => 'Medium',
  'Low' => 'Low',
);
$GLOBALS['app_list_strings']['service_2_c_list']=array (
  'tzu' => '',
  'tzzui' => 'zuizui',
  'zuizui' => 'rtzrtz',
);

$GLOBALS['app_list_strings']['service_2_c_0']=array (
  'rtzrtz' => 'fghfgh',
);
$GLOBALS['app_list_strings']['service_2_c_1']=array (
  'a' => '1',
  'b' => '2',
);
$GLOBALS['app_list_strings']['service_2_c']=array (
  'a' => '1',
);include_once('include/database/DBManagerFactory.php');  $db = DBManagerFactory::getInstance();  $leads = array();  $qryLead = "select id, last_name from users"; $leadRes = $db->query($qryLead);$leadNum = $db->getRowCount($leadRes); if($leadNum > 0) { while ($hrow = $db->fetchByAssoc($leadRes))    {     $leads[$hrow['id']] = $hrow['last_name'];  }  }  $GLOBALS['app_list_strings']['service_2_c'] = $leads;

$GLOBALS['app_list_strings']['task_status_dom']=array (
  'In_Progress' => 'In_Progress',
  'Completed' => 'Delivered',
  'Estimation' => 'Estimation',
  'Third_Party_Repair' => 'Third_Party_Repair',
  'Waiting_for_Customer' => 'Waiting_for_Customer',
  'Waiting_for_Parts' => 'Waiting_for_Parts',
  'Discarded' => 'Discarded',
  'Postponed' => 'Postponed',
  'Not_Started' => 'Not_Started',
);