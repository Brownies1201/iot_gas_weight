<?php
  $data = $_GET['value'];

  //user information
  $host = "140.120.14.240";
  $user = "brownies1201";
  $pass = "scrap321";

  //database information
  $databaseName = "wifidb";
  $tableName = "wifi";

  //Connect to mysql database
  $con = mysql_connect($host,$user,$pass);
  $dbs = mysql_select_db($databaseName, $con);

  //Query database for data
    $result = mysql_query("insert into $tableName (data) VALUES ($data)");

  //store matrix
  if($result==1)
    echo "success";
  else
    echo "error";
?>