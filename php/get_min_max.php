<?php 
header('Content-Transfer-Encoding: Binary');
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
//sql-select the oldest data by min time
$sql = "select * from wifi where time=(select min(time) from wifi)" ;
//sql-select the newest data by max time
$sql2 = "select * from wifi where time=(select max(time) from wifi)";
//first sql search
$result = mysqli_query($con,$sql);
//result array
$out = [];
//get the result
$i = 0;
if($result){
	//first sql
	while($row=mysqli_fetch_assoc($result)){
	    $out[] = $row;
	}
	//second sql research
	$result = mysqli_query($con,$sql2);
	if($result){
		//second sql
		while($row=mysqli_fetch_assoc($result)){
		   array_push($out, $row);
		}
		echo json_encode($out);
	}else{
		$errorResp = "no data";
		echo json_encode($errorResp);
	}
}else{
	$errorResp = "no data";
	echo json_encode($errorResp);
}
//close connection
mysqli_close($con);
?>