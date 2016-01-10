<?php 
header('Content-Transfer-Encoding: Binary');
//get the post value
$daterange_start = $_POST["daterange_start"];
$daterange_finish = $_POST["daterange_finish"];
//db connection
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
//sql-select the range of time by post value
$sql = "select * from wifi where time>='".$daterange_start." 00:00:00' and time<='".$daterange_finish." 23:59:59' " ;
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