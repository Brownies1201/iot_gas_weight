<?php 
header('Content-Transfer-Encoding: Binary');
//db connection set
$localhost = "localhost";
$my_user = "test123";
$my_password = "test123";
$my_db =  "wifidb";
//db connection
$con = mysqli_connect($localhost,$my_user,$my_password,$my_db);
// Check connection
if (mysqli_connect_errno())
	echo "Failed to connect to MySQL: " . mysqli_connect_error();

mysqli_set_charset($con,"utf8");
//sql
$sql= "select * from user_contact";
//sql search
$result = mysqli_query($con,$sql);
//result array
$out = [];
//get the result
$i = 0;
if($result){
	while($row =mysqli_fetch_assoc($result)){
	    $out[] = $row;
	}
	echo json_encode($out);
}else{
	$errorResp = "no data";
	echo json_encode($errorResp);
}
//close connection
mysqli_close($con);
?>