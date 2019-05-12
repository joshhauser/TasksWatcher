<?php
require_once("db_settings.php");

$task = $_GET['task'];

$table= "tasks";

$connection = mysqli_connect($server,$login,$dbPass)
or die("Impossible to connect");

mysqli_select_db($connection,$db)
or die("Database not found.");

$deleteRequest = "DELETE FROM $table WHERE task='$task'";

$result = mysqli_query($connection,$deleteRequest);

mysqli_close($connection);
?>