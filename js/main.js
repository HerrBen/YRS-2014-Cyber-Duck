//Main javascript with all the fancy stuffs

var sunsetTime;
var sunriseTime;
var latitude;
var longitude;
var clock = $('.clock').FlipClock({});
var state; //Night, lower, low, day

/*Event Hooks*/
//Begin only when document is ready to be manipulated
$(document).ready(function() {
		get_location(); 
});

//When submit phone number button is pressed, post to SMS.php and transform into relevant message
$(".submitBtn").click(function(event){
  event.preventDefault(); 
  $.ajax({
    url : "api/SMS.php",
    type: "POST",
    data : {number:$(".numberField").val() ,message:"hello"},
    success: function(data)
    {
		console.log("Text Sent to " + $(".numberField").val());
		console.log("Return: " + data);
		$(".numberForm").fadeOut(3000, changeToConfirmation());
		
    },
    error: function (data)
    {
              $("#result").text("Sorry, something wrong happened...");
			  console.log("text was not sent");
    }
  });
});

//Validate phone number by checking characters
$('.numberField').keypress(function(event) {
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
	//codeLatLng(lat, lng);
	getSetTimes(); //Get and set clocks, sunset and sunrise times
	document.getElementById("container").style.display = "block"; //Unhide HTML content

}

//Get and set appropriate sunset times, set clocks, set image and state
function getSetTimes(){
	var currentTime = new Date();
	var nextDay = new Date().setDate(currentTime.getDate() + 1);
	var countdown;
    sunsetTime = SunCalc.getTimes(currentTime, latitude, longitude).sunset;	//calculate sunset time based on longitude and latitude
	sunriseTime = SunCalc.getTimes(currentTime, latitude, longitude).sunrise;	//calculate sunrise time based on longitude and latitude
	console.log("Sunset: " + sunsetTime);
	console.log("Sunrise: " + sunriseTime);
	console.log("Current Day: " +currentTime);
	console.log("Next Day:" +nextDay);
	if (currentTime.getTime() > sunsetTime.getTime()){	//If sunset has already happened 
			sunsetTime = SunCalc.getTimes(nextDay, latitude, longitude).sunset;	//calculate TOMMORROW'S sunset time based on longitude and latitude
			state = "night";
			//set moon
		}
	else if (currentTime.getHours() > (sunsetTime.getHours() - 1)){	//Assuming any time below 1 hour is lower
			state ="lower"
			//set lower
	}
	else if (currentTime.getHours() > (sunsetTime.getHours() - 4)){	//Assuming any time below 4 hour is low
			state ="low"
			//set lower
	}
	else if (currentTime.getTime() > sunriseTime.getTime()) { //any other time above sunrise is day
			state = "day";
			//set day
	}
	
	countdown = ((sunsetTime.getTime() - currentTime.getTime())/1000);
	console.log("Sunset in : " + countdown + " seconds");
	console.log("Sunset: " + sunsetTime);
	clock.setTime(countdown);
	$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+sunsetTime.getMinutes() + "pm </p>");	//Set time text
}


function errorFunction(){
    $("#container").html('"<div class="enableLocation centerClass">Oh no! It looks like you have location services disabled. Please enable them and try again.  </div>"'); //Displays message to user about geolocating
	document.getElementById("container").style.display = "block"; //Display HTML content
}

function processNumber(){
	console.log("Hello :" + sunsetTime.sunset);
}

function changeToConfirmation(){
	$(".numberForm").html("Done");
}
