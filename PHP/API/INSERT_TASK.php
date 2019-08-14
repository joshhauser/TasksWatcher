<?php
  require_once("db_settings.php");

  $params = file_get_contents("php://input");
  $datas = json_decode($params);
  $table= "tasks";

  $connection = mysqli_connect($server,$login,$dbPass)
  or die("Impossible to connect");

  mysqli_select_db($connection,$db)
  or die("Database not found.");

  mysqli_set_charset($connection,"utf8");

  $designation = $datas->data->designation;
  $deadline = substr($datas->data->deadline, 0, 10);
  $status = $datas->data->status;

  $insertRequest = "INSERT INTO $table(designation, deadline, status)";
  $insertRequest .= "VALUES(?,?,?)";

  $requestPrepare = mysqli_prepare($connection, $insertRequest);

  mysqli_stmt_bind_param($requestPrepare,'ssi', $designation, $deadline, $status);
  mysqli_stmt_execute($requestPrepare);
  mysqli_close($connection);
?>