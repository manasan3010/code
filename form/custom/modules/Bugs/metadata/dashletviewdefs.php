<?php
$dashletData['BugsDashlet']['searchFields'] = array (
  'name' => 
  array (
    'default' => '',
  ),
);
$dashletData['BugsDashlet']['columns'] = array (
  'name' => 
  array (
    'width' => '40%',
    'label' => 'LBL_LIST_SUBJECT',
    'link' => true,
    'default' => true,
    'name' => 'name',
  ),
  'resolution' => 
  array (
    'width' => '15%',
    'label' => 'LBL_RESOLUTION',
    'name' => 'resolution',
    'default' => false,
  ),
  'release_name' => 
  array (
    'width' => '15%',
    'label' => 'LBL_FOUND_IN_RELEASE',
    'related_fields' => 
    array (
      0 => 'found_in_release',
    ),
    'name' => 'release_name',
    'default' => false,
  ),
  'type' => 
  array (
    'width' => '15%',
    'label' => 'LBL_TYPE',
    'name' => 'type',
    'default' => false,
  ),
  'fixed_in_release_name' => 
  array (
    'width' => '15%',
    'label' => 'LBL_FIXED_IN_RELEASE',
    'name' => 'fixed_in_release_name',
    'default' => false,
  ),
  'source' => 
  array (
    'width' => '15%',
    'label' => 'LBL_SOURCE',
    'name' => 'source',
    'default' => false,
  ),
  'date_entered' => 
  array (
    'width' => '15%',
    'label' => 'LBL_DATE_ENTERED',
    'name' => 'date_entered',
    'default' => false,
  ),
  'date_modified' => 
  array (
    'width' => '15%',
    'label' => 'LBL_DATE_MODIFIED',
    'name' => 'date_modified',
    'default' => false,
  ),
  'created_by' => 
  array (
    'width' => '8%',
    'label' => 'LBL_CREATED',
    'name' => 'created_by',
    'default' => false,
  ),
  'assigned_user_name' => 
  array (
    'width' => '8%',
    'label' => 'LBL_LIST_ASSIGNED_USER',
    'name' => 'assigned_user_name',
    'default' => false,
  ),
);
