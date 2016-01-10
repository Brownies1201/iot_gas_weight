//Document ready
$(function () {
	FindUserContact();
	PreventPhoneWrong();
	ChangeShopData();
});
//Prevent phone input wrong 
var PreventPhoneWrong = function(){
	$("#set_shop_phone").keydown(function (e) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			 // Allow: Ctrl+A, Command+A
			(e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
			 // Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40)) {
			     // let it happen, don't do anything
			     return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});
};
//Find user default gas contact
var FindUserContact = function(){
	$.ajax({
        type: "POST",
        url: '../php/home_user_contact.php',
        dataType: "json",
        success: function(data){ 	
        	if(data){
        		var shop_info = data[0];
        		//set the gas shop information
        		if(shop_info.shop_name){
        			$('#set_shop_name').val(shop_info.shop_name);
        		}
        		if(shop_info.address){
        			$('#set_shop_address').val(shop_info.address);
        		}
        		if(shop_info.phone || shop_info.phone!=0){
        			$('#set_shop_phone').val(shop_info.phone);
        		}
        		//Phone call btn event
        		$('#set_shop_phone_btn').click(function() {
					if(shop_info.phone || data[0]!=0){//call
						location.href='tel:'+shop_info.phone;
					}else{//not set phone number already
						$('.set_alert_msg').html("還沒設定電話");
					}	
				});
				//Find the direction of the gas shop
				$('#set_shop_map_btn').click(function() {
					if(shop_info.address){//link to set_get_direction.html
						location.href="../page/set_get_direction.html?"+shop_info.address;
					}else{//not set address already
						$('.set_alert_msg').html("還沒設定地址");
					}
				});
        	}
        },
        error: function(data) {
        	alert("資料庫連結失敗，請在重新輸入一次");
        }
    });	
};
//Change shop data
var ChangeShopData = function(){
	//Change shop data btn click event
	$('#set_shop_change_btn').click(function() {
		//get the input value
		var shop_name = $('#set_shop_name').val();
		var shop_phone = $('#set_shop_phone').val();
		var shop_address = $('#set_shop_address').val();
		//post
		$.ajax({
	        type: "POST",
	        url: '../php/set_change.php',
	        data:{shop_name: shop_name, shop_phone: shop_phone, shop_address: shop_address},
	        success: function(data){ 	
	        	if(data=="success"){
	        		alert("資料更新成功");
	        	}else{
	        		alert("資料更新失敗");
	        	}
	        },
	        error: function(data) {
	        	alert("資料庫連結失敗，請在重新輸入一次");
	        }
	    });	
	});
};