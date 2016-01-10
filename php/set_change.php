<?php 
header('Content-Transfer-Encoding: Binary');

$localhost = "localhost";
$my_user = "test123";
$my_password = "test123";
$my_db =  "wifidb";

$shop_name = $_POST["shop_name"];
$shop_phone = $_POST["shop_phone"];
$shop_address = $_POST["shop_address"];

$con = mysqli_connect($localhost,$my_user,$my_password,$my_db);
// Check connection
if (mysqli_connect_errno())
	echo "Failed to connect to MySQL: " . mysqli_connect_error();

mysqli_set_charset($con,"utf8");

$sql= "update user_contact set shop_name='".$shop_name."', phone='".$shop_phone."', address='".$shop_address."'";
$result = mysqli_query($con,$sql);

if($result){
	echo "success";
}else{
	echo "update fail";
}

mysqli_close($con);
?>