//variable initial
var datetitle;
var daterange_start;
var daterange_finish; 
$(function () {
	//set datepicker format
	GetMinAndMaxDate();
	DataPickerBtn();
});
//Get the min and max date form DB
var GetMinAndMaxDate = function(){
	$.ajax({
        type: "POST",
        url: '../php/get_min_max.php',
        dataType: "json",
        success: function(data){ 	
        	if(data){
        		//datepicker set
        		$('.input-daterange input').datepicker({
				    format: "yyyy-mm-dd",
				    startDate: data[0].time.split(' ')[0],
				    endDate:  data[1].time.split(' ')[0]
				});
				//initial chart by max date
        		GetChartData(data[1].time.split(' ')[0], data[1].time.split(' ')[0])
        	}
        },
        error: function(data) {
        	alert("資料庫連結失敗，請在重新輸入一次");
        }
    });	
};

//Chart time select btn trigger
var DataPickerBtn = function(){
	$('.datepicker_btn').click(function(){
		//get the datepicker value
	  	daterange_start = $( ".datepicker1" ).val();
	  	daterange_finish = $( ".datepicker2" ).val();
	  	//two chart type-one day& days
	  	if(daterange_start && daterange_finish){
		  	if((Date.parse(daterange_start)).valueOf() <= (Date.parse(daterange_finish)).valueOf() ){
		  		if($( window ).width()<770){
					$( ".navbar-toggle" ).trigger( "click" );
				}
		  		GetChartData(daterange_start, daterange_finish);
		  	}else{
		  		alert("時間範圍輸入錯誤");
		  	}
	  	}
	});	
};
//Get char data and set chart
var GetChartData = function(daterange_start, daterange_finish){
    $.ajax({
        type: "POST",
        url: '../php/chart.php',
        data: {daterange_start: daterange_start, daterange_finish: daterange_finish},
        dataType: "json",
        success: function(data)
        { 	
            if(data || data!="no data"){
            	SetChart(data, daterange_start, daterange_finish);
            }else{
            	alert(data);
            }
          
        },
        error: function(data) {
        	alert("資料庫連結失敗，請在重新輸入一次");
        }
    });
};
var SetChart = function(data, daterange_start, daterange_finish){
	var time = [];
	var value = [];
	//Get the time range from time select
	var tmp_start = (Date.parse(daterange_start));
	var tmp_finish = (Date.parse(daterange_finish));
	var tmp_range = (tmp_finish-tmp_start)/(1000*60*60*24);

	if(tmp_range==0){//Chart type- one day mode
		datetitle = daterange_start+" 使用量/小時";
		//average the weight in same hour
		for(i=0; i<data.length;){
			var tmp = parseInt(data[i].data);
			var j=i+1;
			for(; j<data.length; j++){
				if(data[j].time.split(":")[0]==data[i].time.split(":")[0]){
					tmp+=parseInt(data[j].data);
				}else{
					tmp/=(j-i+1);
					value.push(parseInt(tmp));
					time.push(data[i].time.split(" ")[1]);
					break;
				}
			}
			i=j;
		}
	}else{//Chart type- many days mode
		datetitle = daterange_start+"~"+daterange_finish+" 使用量/日";
			var count = 0;
			//average the weight in same day
		for(i = 0; i<=tmp_range; i++){
			var tmp = 0;
    		for(j=count; j<data.length; j++){
    			if(j==data.length-1){
    				tmp/=(j-count+1);
    			}else if(j!=count){
    				if(data[j].time.split(" ")[0]==data[j-1].time.split(" ")[0]){
    					tmp+=parseInt(data[j].data);
    					
    				}else{
    					tmp/=(j-count);
    					count = j;
    					
    					break;
    				}
    			}else{
    				tmp+=parseInt(data[j].data);
    				time[i] = data[j].time.split(" ")[0].split(":")[0];
    			}
    		}
    		value[i] = tmp;
    	}
	}
	//Set chart
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '瓦斯 '+datetitle,
            style: {
	            fontFamily: "Microsoft JhengHei"
	        }
        },
        xAxis: {
            categories: time
        },
        yAxis: {
            min: 0,
            title: {
                text: '使用重量'
            },
            style: {
	            fontFamily: "Microsoft JhengHei"
	        }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: '瓦斯剩餘重量',
            data: value,
            style: {
	            fontFamily: "Microsoft JhengHei"
	        },
	        color: '#52bde0',
        }]
    });

};
