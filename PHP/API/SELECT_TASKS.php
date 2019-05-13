<?php

require_once("db_settings.php");
$table = "tasks";
$tasks = [];
$index = 0;

$connection = mysqli_connect($server,$login,$dbPass)
or die("Impossible to connect");

mysqli_select_db($connection,$db)
or die("Database not found.");

$request = "SELECT * from $table";
$result = mysqli_query($connection,$request);

while($row = mysqli_fetch_row($result)){
    $tasks[$index] = $row;
    $index++;
}

echo json_encode(['data' => $tasks]);
?>