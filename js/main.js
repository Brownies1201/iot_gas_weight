//variable set
var min_weight = 120;//the min weight of gas
//Document ready
$(function () {
	CheckAlertStates();
	FindUserContact();
});
//Find user default gas contact
var FindUserContact = function(){
	$(".home_gas_contact_btn").click(function() {
		$.ajax({
	        type: "POST",
	        url: './php/home_user_contact.php',
	        dataType: "json",
	        success: function(data){ 	
	        	if(data){
	        		if(data[0].phone || data[0]!=0){
	        			//call to gas store
	        			location.href='tel:'+ data[0].phone;
	        		}else{//not set gas store phone number
	        			//show alert modal
	        			$('#home_alert_modal').modal('show');
	        			//edit phone number-link to set.html
	        			$('#home_alert_set_btn').click(function() {
	        				location.href="../page/set.html";
	        			});
	        		}
	        		
	        	}
	        },
	        error: function(data) {
	        	alert("資料庫連結失敗，請在重新輸入一次");
	        }
	    });	
	});
};
//Check gas alert 
var CheckAlertStates = function(){
	$.ajax({
        type: "POST",
        url: './php/home_alert.php',
        dataType: "json",
        success: function(data)
        { 	//get gas data
        	if(data || data!="no data"){
        		//Check the gas weight
        		if(parseInt(data[0].data)<=min_weight){
        			//gas weight alert
        			$(".home_row_alert").css("visibility", "visible");
        		}
        	}
        },
        error: function(data) {
        	alert("資料庫連結失敗，請在重新輸入一次");
        }
    });
};