<?php
  require_once('db_settings.php');

  $params = file_get_contents('php://input');
  $datas = json_decode($params);
  $table = 'tasks';

  $connection = mysqli_connect($server,$login,$dbPass)
  or die('Impossible to establish a connection.');

  mysqli_select_db($connection, $db)
  or die('Databse not found.');

  mysqli_set_charset($connection,"utf8");
  
  $id = $datas->data->id;
  $designation = $datas->data->designation;
  $deadline = $datas->data->deadline;
  if(strlen($deadline) > 10)
      $deadline = substr($deadline, 0, 10);
  $status = $datas->data->status;

  $updateRequest = "UPDATE $table SET ";
  $updateRequest .= "designation = '$designation', ";
  $updateRequest .= "deadline = DATE('$deadline'), ";
  $updateRequest .= "status = $status ";
  $updateRequest .= "WHERE id = $id ";


  mysqli_query($connection, $updateRequest);
  mysqli_close($connection);
?>