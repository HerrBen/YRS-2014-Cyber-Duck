//Main javascript with all the fancy stuffs

var sunsetTime;
var sunriseTime;
var latitude;
var longitude;
var clock = $(".clock").FlipClock({});
var state; //Night, lower, low, day
var geocoder = new google.maps.Geocoder();
var latlng;
var message;
var numberForm = $(".numberForm").html();

/*Event Hooks*/
//Begin only when document is ready to be manipulated
$(document).ready(function() {
	get_location(); 
	$(".chosen-select").chosen();
	$(".btn-about").on("click" ,function(e){ //About page button handler
        var wh = $("body").height();
        e.preventDefault();
        $(this).toggleClass("close");
        $("#about").slideToggle("fast", function(){
            var ah = $("#about").height();
            $("html, body").animate({scrollTop: wh + ah}, 500);
        });
    });
	$(".btn-times").on("click" ,function(e){ //About page button handler
        var wh = $("body").height();
        e.preventDefault();
        $(this).toggleClass("close");
        $("#times").slideToggle("fast", function(){
            var ah = $("#times").height();
            $("html, body").animate({scrollTop: wh + ah}, 500);
        });
    });	
	$(".chosen-select").chosen().val(["60", "30", "15", "0"]);
});


//When submit phone number button is pressed, post to SMS.php and transform into relevant message
$(".submitBtn").click(onSubmitClick);

//Validate phone number by checking characters
$(".numberField").keypress(function(event) {
    var code = (event.keyCode ? event.keyCode : event.which);
    if (!(
            (code >= 48 && code <= 57) //numbers
            || (code == 32) || (code == 43) || (code == 45) //space and  + and -
        )
        || (code == 46 && $(this).val().indexOf('.') != -1)
       )
        event.preventDefault();
});

/*Functions*/
//Check if geolocation is present, then start processing
function get_location() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
}

//If geolocating is successful proceed to calculate sunset and set the clock
function successFunction(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
	getLocation(latitude, longitude);	//Grab location and set it
	getSetTimes(); //Get and set clocks, sunset and sunrise times
	$("#container").show();
	$(".overlay").fadeOut('fast');
}

//Gets the location based on longitude and latitude from google maps 
function getLocation(lat, lng) {
    latlng = new google.maps.LatLng(lat, lng);	//map api stuff
    geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
		console.log(results)
		if (results[1]) {
			$(".location").html('<span class="climacon compass compassIcon" style="color:#D0D0D0"></span><span style="color:#D0D0D0" class="locationLabel centerClass">' + results[4].formatted_address + '</span>') //returns town and country and shoves it into correct place
		}
		else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  }

//Get and set appropriate sunset times, set clocks, set image and state
function getSetTimes(){
	var currentTime = new Date();
	var nextDay = new Date().setDate(currentTime.getDate() + 1);
	var previousDay = new Date().setDate(currentTime.getDate() - 1);
	var countdown;
    sunsetTime = SunCalc.getTimes(currentTime, latitude, longitude).sunset;	//calculate sunset time based on longitude and latitude
	sunriseTime = SunCalc.getTimes(currentTime, latitude, longitude).sunrise;	//calculate sunrise time based on longitude and latitude
	console.log("Sunset: " + sunsetTime);
	console.log("Sunrise: " + sunriseTime);
	console.log("Current Day: " +currentTime);
	console.log("Next Day:" +nextDay);
	if (currentTime.getTime() > sunsetTime.getTime()){	//If sunset has already happened 
			countdown = ((currentTime.getTime() - sunsetTime.getTime())/1000); //set countdown for flipclock and countdown
			sunsetTime = SunCalc.getTimes(nextDay, latitude, longitude).sunset;	//calculate TOMMORROW'S sunset time based on longitude and latitude
			state = "night";
			$("span.climacon").replaceWith('<span class="climacon icon horizon sun moon"></span>');	//Set moon image
			$("#container p.untilSunsetLabel").html("after sunset...");	//after sunset message
			setFlipClock(countdown, false);
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm tomorrow</p>");	//Set time text
		}
	else if ((currentTime.getTime() < sunriseTime.getTime()) && (currentTime.getTime() < sunsetTime.getTime())){//rogue state after 12:00am
			sunsetTime = SunCalc.getTimes(previousDay, latitude, longitude).sunset;	//calculate YESTERDAY'S sunset time based on longitude and latitude
			countdown = ((currentTime.getTime() - sunsetTime.getTime())/1000); //set countdown for flipclock and countdown
			state = "roguenight";
			$("span.climacon").replaceWith('<span class="climacon icon horizon sun moon"></span>');	//Set moon image
			$("#container p.untilSunsetLabel").html("after sunset...");	//after sunset message
			setFlipClock(countdown, false);
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm tomorrow</p>");	//Set time text
	}
	else if (currentTime.getHours() > (sunsetTime.getHours() - 1)){	//Assuming any time below 1 hour is lower
			state ="lower"
			$("span.climacon").replaceWith('<span class="climacon icon horizon sun lower"></span>');	//Set lower image
			$("#container p.untilSunsetLabel").html("until sunset...");	
			countdown = ((sunsetTime.getTime() - currentTime.getTime())/1000); //set countdown for flipclock and countdown
			setFlipClock(countdown, true);
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm today</p>");	//Set time text

	}
	else if (currentTime.getHours() > (sunsetTime.getHours() - 4)){	//Assuming any time below 4 hour is low
			state ="low"
			$("span.climacon").replaceWith('<span class="climacon icon horizon sun low"></span>');	//Set low image
			$("#container p.untilSunsetLabel").html("until sunset...");
			countdown = ((sunsetTime.getTime() - currentTime.getTime())/1000); //set countdown for flipclock and countdown
			setFlipClock(countdown, true);
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm today</p>");	//Set time text
	}
	else if (currentTime.getTime() > sunriseTime.getTime()) { //any other time above sunrise is day
			state = "day";
			$("span.climacon").replaceWith('<span class="climacon icon horizon sun sunlight"></span>');	//Set day image
			$("#container p.untilSunsetLabel").html("until sunset...");
			countdown = ((sunsetTime.getTime() - currentTime.getTime())/1000); //set time until sunset for flipclock and countdown
			setFlipClock(countdown, true);
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm today</p>");	//Set time text
	}
	console.log(state);
	console.log("Sunset in : " + countdown + " seconds");
	console.log("Sunset: " + sunsetTime);
}

//Sets the flipclock's current time and whether it counts up or down
function setFlipClock(time, countdown){
	clock.countdown = countdown;
	clock.setTime(time);
}

//If geolcating is rejected
function errorFunction(){ 
    $("#container").html('"<div class="enableLocation centerClass">Oh no! It looks like you have location services disabled. Please enable them and try again.  </div>"'); //Displays message to user about geolocating
	$("#container").show();
}

function processNumber(){
	console.log("Hello :" + sunsetTime.sunset);
}

function changeToConfirmation(){
	$(".numberForm").html('<p class="untilSunsetLabel centerClass">Your message will be sent!</p><form action="" class="centerClass form"><input type="submit" value="Send another" class="submitBtn centerClass anotherButton">');
	$(".submitBtn").click(onSendAgainClick);
}

//Event handler for submit button click
function onSubmitClick(event) {
	var recipientNumber = $(".numberField").val();

	var countryCode = countryForE164Number(recipientNumber);
	var isNumberValid = isValidNumber(recipientNumber, countryCode);
	event.preventDefault();

	console.log(recipientNumber + " was valid: " + isNumberValid + countryCode);

	if (isNumberValid == true) {
	//$(".chosen-select").chosen().val('34')[0];
	alert($(".chosen-select").chosen().val()[0]);
			for (i = 0; i < $(".chosen-select").chosen().val().length; i++) { 
		text += cars[i] + "<br>";
}
		
			var JSONtimes = JSON.stringify($(".chosen-select").chosen().val());
			
			
			var Message = JSON.stringify(["60 minutes before dark","30 minutes before dark","15 minutes before dark","Sunset has arrived, it is no longer 'before dark'"]);
		   var formData = {number: recipientNumber, message: Message, data: JSONtimes};
		   
		   $(".numberForm").fadeTo("slow", 3000, changeToConfirmation());
		  $.ajax({
		    url : "api/SMS.php",
		    type: "POST",
		    data : formData,
		    success: function(data)
		    {
				console.log("Text Sent to " + recipientNumber);
				console.log("Return: " + data);
				$(".numberForm").fadeTo("slow", 3000, changeToConfirmation());
				
		    },
		    error: function (data)
		    {
		      $(".numberForm").text("Sorry, something wrong happened...");
			  console.log("text was not sent");
		    }
		  }); 
	} else {
		console.log("Number was not valid.");
	}

  console.log($(".chosen-select").chosen().val());
}

//change event handler for button to this
function onSendAgainClick(event){
	event.preventDefault();
	$(".numberForm").html(numberForm);
}

function zeroCorrect(n){
	return n > 9 ? '' + n: '0' + n;
}
