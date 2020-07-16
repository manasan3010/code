<?php

if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
abstract class Status
{
    const Estimation = 'Estimation';
    const Waiting_for_Customer = 'Waiting_for_Customer';
    const In_Progress = 'In_Progress';
}

class SMSIntegration
{
    static $SMSfooter =
    "

    
ASTP TEC 
(PVT) LTD
0212222674";

    function sendSMS($bean, $event, $arguments)
    {
        // return
        if (!isset($bean->contact_id) || !$bean->contact_id) return;
        $contactsBean = BeanFactory::getBean('Contacts');
        $contact = $contactsBean->retrieve_by_string_fields([
            'id' => $bean->contact_id
        ]);
        $mobile =  $contact->phone_mobile;
        // Try to predict Number stored in name 
        if (!isset($mobile)) {
            $nameArray = explode(' ', $contact->name);
            foreach ($nameArray as $namePart) {
                if (is_numeric($namePart) && strlen($namePart) > 8) {
                    $mobile = $namePart;
                }
            }
        }
        if (!isset($mobile) || !$mobile) return;

        $status = $bean->status;
        if ($status == Status::Estimation) {
            $allStatus = SMSIntegration::getAllStatus($bean->id);
            $latestStatus = SMSIntegration::getLatestStatus($allStatus, $status);
            $message = "The estimation for your JOB-NO $bean->task_number_c is LKR {$latestStatus['field1']}" . SMSIntegration::$SMSfooter;
            SMSIntegration::sendAPIRequest($message, $mobile);
        } elseif ($status == Status::Waiting_for_Customer) {
            $message = "Your JOB of JOB-NO $bean->task_number_c has been completed. Please come and collect it" . SMSIntegration::$SMSfooter;
            SMSIntegration::sendAPIRequest($message, $mobile);
        } elseif (!$bean->fetched_row) {
            $message = "Thank you for visiting us. We received your JOB $bean->task_number_c" . SMSIntegration::$SMSfooter;
            SMSIntegration::sendAPIRequest($message, $mobile);
        }
    }
    function getLatestStatus($taskDetails, $statusName)
    {
        for ($i = count($taskDetails) - 1; $i >= 0; $i--) {
            $status = $taskDetails[$i];
            if ($status['name'] == $statusName) {
                return $status;
            }
        }
    }
    function getAllStatus($task_id)
    {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $conn = new mysqli($servername, $username, $password, "suitecrm");
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }


        $sql = "SELECT id,name,field1,field2,field3,field4 FROM tasks_extra WHERE id='{$task_id}'";
        $result = $conn->query($sql);
        $resultsArray = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultsArray[] = $row;
            }
        }
        return $resultsArray;
    }
    function sendAPIRequest($message, $reciever)
    {
        $APIuser = "94775824250";
        $APIpassword = "4777";
        $text = urlencode($message);
        $reciever = urlencode($reciever);
        $baseURL = "http://www.textit.biz/sendmsg";

        $url = "$baseURL/?id=$APIuser&pw=$APIpassword&to=$reciever&text=$text";
        $response = file($url);

        $parsedResponse = explode(":", $response[0]);

        if (trim($parsedResponse[0]) == "OK") {
            echo "Message Sent - ID : " . $parsedResponse[1];
        } else {
            if (strpos($parsedResponse[1], 'Ins_Crd') !== false) {
                die("
                <h1 style='color:red'>Your SMS Account balance is over. Please Reload your account</h1>
                <h2><a href='https://textit.biz/login.php'>https://textit.biz/login.php</a></h2>
                <h2>User ID: 94775824250</h2>
                <h2>Password: 4777</h2>
                ");
            } else {
                die("Sent Failed - Error : " . $parsedResponse[1]);
            }
        }
    }
}
