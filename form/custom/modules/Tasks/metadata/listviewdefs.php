

<?php
$listViewDefs ['Tasks'] = 
array (
  'TASK_NUMBER_C' => 
  array (
    'type' => 'autoincrement',
    'default' => true,
    'label' => 'LBL_TASK_NUMBER',
    'width' => '10%',
  ),
  'SET_COMPLETE' => 
  array (
    'width' => '1%',
    'label' => 'LBL_LIST_CLOSE',
    'link' => true,
    'sortable' => false,
    'default' => true,
    'related_fields' => 
    array (
      0 => 'status',
    ),
  ),
  'STATUS' => 
  array (
    'width' => '10%',
    'label' => 'LBL_LIST_STATUS',
    'link' => false,
    'default' => true,
  ),
  'NAME' => 
  array (
    'width' => '40%',
    'label' => 'LBL_LIST_SUBJECT',
    'link' => true,
    'default' => true,
  ),
  'CONTACT_NAME' => 
  array (
    'width' => '20%',
    'label' => 'LBL_LIST_CONTACT',
    'link' => true,
    'id' => 'CONTACT_ID',
    'module' => 'Contacts',
    'default' => true,
    'ACLTag' => 'CONTACT',
    'related_fields' => 
    array (
      0 => 'contact_id',
    ),
  ),
  'MODEL_NAME_C' => 
  array (
    'type' => 'varchar',
    'default' => true,
    'label' => 'LBL_MODEL_NAME',
    'width' => '10%',
  ),
  // 'SERVICE_C' => 
  // array (
    // 'type' => 'varchar',
    // 'default' => true,
    // 'label' => 'LBL_SERVICE_C',
    // 'width' => '10%',
  // ),
  // 'ASSIGNED_USER_NAME' => 
  // array (
    // 'width' => '2%',
    // 'label' => 'LBL_LIST_ASSIGNED_TO_NAME',
    // 'module' => 'Employees',
    // 'id' => 'ASSIGNED_USER_ID',
    // 'default' => true,
  // ),
  'DATE_ENTERED' => 
  array (
    'width' => '10%',
    'label' => 'LBL_DATE_ENTERED',
    'default' => true,
  ),
  'ASSIGNED_C' => 
  array (
    'type' => 'enum',
    'default' => true,
    'studio' => 'visible',
    'label' => 'LBL_ASSIGNED',
    'width' => '10%',
  ),
  'DATE_DUE' => 
  array (
    'width' => '15%',
    'label' => 'LBL_LIST_DUE_DATE',
    'link' => false,
    'default' => false,
  ),
  'DATE_MODIFIED' => 
  array (
    'type' => 'datetime',
    'label' => 'LBL_DATE_MODIFIED',
    'width' => '10%',
    'default' => false,
  ),
  'MODIFIED_BY_NAME' => 
  array (
    'type' => 'relate',
    'link' => true,
    'label' => 'LBL_MODIFIED_NAME',
    'id' => 'MODIFIED_USER_ID',
    'width' => '10%',
    'default' => false,
  ),
  'CREATED_BY_NAME' => 
  array (
    'type' => 'relate',
    'link' => true,
    'label' => 'LBL_CREATED',
    'id' => 'CREATED_BY',
    'width' => '10%',
    'default' => false,
  ),
  'TIME_DUE' => 
  array (
    'width' => '15%',
    'label' => 'LBL_LIST_DUE_TIME',
    'sortable' => false,
    'link' => false,
    'default' => false,
  ),
  'CONTACT_PHONE' => 
  array (
    'type' => 'phone',
    'studio' => 
    array (
      'listview' => true,
    ),
    'label' => 'LBL_CONTACT_PHONE',
    'width' => '10%',
    'default' => false,
  ),
);
;
?>
<?php include 'edit_src\listviewdefs.php';?>