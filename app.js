let form = document.getElementById('weather'); //get form object

//add eventlistner to form submit
form.addEventListener("submit", function(){
	let city = form.city.value;
	let country = form.country.value;
	let unit = form.unit.value;
	let units = '';
	if(unit == '0')
		units = 'metric';
	else
		units = 'imperial';
	let future = form.future.value;
	
	//console.log();
	//return false;
	function getDay(day) {
	 let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	 return (days[day])
	}

	function getMonth(month) {
	 let months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
	 return (months[month])

	}
	
	let citycode = '';
   	let countrycode = '';
	fetch('http://maps.googleapis.com/maps/api/geocode/json?address='+city+','+country+'&sensor=false')
	.then(function(response) { return response.json(); })
    .then(function(data) {
    	//console.log(data);
    	let dataLen = data.results['0'].address_components.length;
    	citycode = data.results['0'].address_components['0'].short_name;
    	countrycode = data.results['0'].address_components[dataLen-1].short_name;

		//console.log(citycode);         	
		//console.log(countrycode);
    	if(citycode !='' && countrycode !='') {
    		let myHeaders = new Headers();
			let myInit = { method: 'GET',
			              headers: myHeaders,
			              cache: 'default',
			              dataType : "jsonp",
			          	};         	
			if(document.getElementById("future").checked){   //to check if 5 days forcast is required or not        	
				fetch('http://api.openweathermap.org/data/2.5/forecast/daily?q='+citycode+','+countrycode+'&units='+units+'&appid=ae90958c318f907c4f35609efd85e9c3', myInit)
				.then(function(response) { return response.json(); })
			   .then(function(weather) {
			   	//console.log(weather);
			   	let htmlData = '';
					for(let i = 0; i < weather.list.length; i++) {
						htmlData +='<ul>';
						let date = new Date((weather.list[i].dt) * 1000);
						htmlData +='<li class="text-c"><h4>'+getDay(date.getDay())+'</h4></li>';
						htmlData +='<li class="text-c"><h4>'+date.getDate() + " " + getMonth(date.getMonth())+'</h4></li>';
						htmlData +='<li class="text-c wet-c">'+weather.list[i].weather['0'].description+'</li>';
						htmlData +='<li class="text-c"><img src="http://openweathermap.org/img/w/'+weather.list[i].weather['0'].icon+'.png"></li>';
						htmlData +='<li>Pressure : '+weather.list[i].pressure+'</li>';
						htmlData +='<li>Wind '+weather.list[i].speed+'</li>';
						htmlData +='<li>Humidity %: '+weather.list[i].humidity+'</li>';
						htmlData +='<li>Max temp. : '+weather.list[i].temp.max+'</li>';
						htmlData +='<li>Min temp. : '+weather.list[i].temp.min+'</li>';
						htmlData +='</ul>';
					}
					
					document.getElementById('display').innerHTML = htmlData;
					//console.log(htmlData);
			   })
				.catch(function(error) {  
				console.log('Fetch Error :-S'+error);  
				});
			}else{
				fetch('http://api.openweathermap.org/data/2.5/weather?q='+citycode+','+countrycode+'&units='+units+'&appid=ae90958c318f907c4f35609efd85e9c3', myInit)
				.then(function(response) { return response.json(); })
			   .then(function(weather) {
			   	//console.log(weather);
			   	let htmlData = '<ul>';
			     	htmlData +='<li class="text-c"><h4>Date : Today</h4></li>';
			     	htmlData +='<li class="text-c wet-c">'+weather.weather['0'].description+'</li>';
					htmlData +='<li class="text-c"><img src="http://openweathermap.org/img/w/'+weather.weather['0'].icon+'.png"></li>';
					
					htmlData +='<li>Temperature '+units+': '+weather.main.temp+'</li>';
					htmlData +='<li>Humidity %: '+weather.main.humidity+'</li>';
					htmlData +='<li> Max temp. : '+weather.main.temp_max+'</li>';
					htmlData +='<li>Min temp. : '+weather.main.temp_min+'</li>';

					

			    
			     	htmlData +='</ul>';
			     	document.getElementById('display').innerHTML = htmlData;
			   })
				.catch(function(error) {  
				console.log('Fetch Error :-S'+error);  
				});
			}
    	}else{
    		alert('Invalid City or Country.Please try again!!!')
    	}
      
    })
	.catch(function(error) {  
	console.log('Fetch Error :-S'+error);  
	});


	
	return false;
});
