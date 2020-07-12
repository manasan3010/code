<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
require_once('include/SugarObjects/forms/FormBase.php');

class test_service_mainFormBase extends FormBase {

      var $moduleName = 'test_service_main';
      var $objectName = 'test_service_main';

      function handleSave($prefix, $redirect=true, $useRequired=false){
      require_once('include/formbase.php');
      $focus = new MyModule();
      $focus = populateFromPost($prefix, $focus);
      $focus->save(); 

}
}

?>
