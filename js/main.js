//Main javascript with all the fancy stuffs
var sunsetTime;
var sunriseTime;
var latitude;
var longitude;
var clock = $(".clock").FlipClock({});
var state; //Night, roguenight, lower, low, day
var geocoder = new google.maps.Geocoder();
var latlng;
var message;
var numberForm;

/*Event Hooks*/
//Begin only when document is ready to be manipulated
$(document).ready(function() {
	get_location(); 
	$(".btn-about").on("click" ,function(e){ //About page button handler
        var wh = $("body").height();
        e.preventDefault();
        $(this).toggleClass("close");
        $("#about").slideToggle("fast", function(){
            var ah = $("#about").height();
            $("html, body").animate({scrollTop: wh + ah}, 500);
        });
    });
});	



//When arrow clicked show chosen dropdown
$(".btnTimes-open").click(onTimesClick);
$(".btnTimes-close").click(onTimesClick);

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
			sunsetTime = SunCalc.getTimes(currentTime, latitude, longitude).sunset;	//recalculate TODAY'S sunset time based on longitude and latitude
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm tomorrow</p>");	//Set time text
	}
	else if (currentTime.getHours() > (sunsetTime.getHours() - 1)){	//Assuming any time below 1 hour is lower
			state ="lower"
			$("span.climacon").replaceWith('<span class="climacon icon horizon sun lower"></span>');	//Set lower image
			$("#container p.untilSunsetLabel").html("until sunset...");	
			countdown = ((sunsetTime.getTime() - currentTime.getTime())/1000); //set countdown for flipclock and countdown
			setFlipClock(countdown, true);
			$(".sunsetLabel").html('<p class="sunsetLabel">The sun sets at '  + (sunsetTime.getHours() - 12) +":"+zeroCorrect(sunsetTime.getMinutes()) + "pm today</p>");	//Set time text
			setChosenOptions(currentTime, sunsetTime);
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
	numberForm = $(".numberForm").html();
	$(".chosen-select").chosen();
	$(".chosen-select").chosen().val(["60", "30", "15", "0"]);
	$(".chosen-select").trigger("chosen:updated");
	console.log('State: ' + state);
	console.log("Sunset in: " + countdown + " seconds");
	console.log("Sunset: " + sunsetTime);
}

//Sets available options in chosen dropbox
function setChosenOptions(currentTime, sunsetTime){
	if (currentTime > addMinutes(sunsetTime, -60)){
		$(".times").replaceWith('<div class="times" id="times"><select data-placeholder="Select times" name="times[]" multiple style="width: 350px" class="chosen-select"><option value="30">30 minutes</option><option value="15">15 minutes</option><option value="0">At sunset</option></select></div>');
	}
	else if (currentTime > addMinutes(sunsetTime, -30)){
		$(".times").replaceWith('<div class="times" id="times"><select data-placeholder="Select times" name="times[]" multiple style="width: 350px" class="chosen-select"><option value="15">15 minutes</option><option value="0">At sunset</option></select></div>');
	}
	else if (currentTime > addMinutes(sunsetTime, -15)){
		$(".times").replaceWith('<div class="times" id="times"><select data-placeholder="Select times" name="times[]" multiple style="width: 350px" class="chosen-select"><option value="0">At sunset</option></select></div>');
	}
}

//Nifty function credits SO
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
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

//When the submit button is clicked
function changeToConfirmation() {
	$(".numberForm").html('<p class="untilSunsetLabel centerClass">You have been signed up for alerts!</p><form action="" class="centerClass form"><input type="submit" value="Send another" class="submitBtn centerClass anotherButton">');
	$(".submitBtn").click(onSendAgainClick);
}

//Generates message based on time
function giveMessage(timeBefore){
	if (timeBefore > 0){
		return 'There are ' + timeBefore + ' minutes before dark.\n\n(You have received this message because your phone number was entered at http://beforedark.co)';
	}
	else{
		return 'The sun has set and it is no longer before dark.\n\n(You have received this message because your phone number was entered at http://beforedark.co)';
	}
}

//Event handler for submit button click
function onSubmitClick(event) {
	event.preventDefault();
	if ($(".numberField").val().length > 7){
		var recipientNumber = $(".numberField").val();
		var currentTime = new Date();
		var numberOptions = ($(".chosen-select").chosen().val().length);
		var i;
		var alerts = [];
		var d = new Date();

		for (i in $(".chosen-select").chosen().val()) {
			alerts[alerts.length] = {Number: recipientNumber, Message : giveMessage($(".chosen-select").chosen().val()[i]), Time: new Date(sunsetTime.getTime() - $(".chosen-select").chosen().val()[i] * 60000), TimeOffset: d.getTimezoneOffset()};
		}	
			$(".numberForm").fadeTo("slow", 3000, changeToConfirmation());
			$.ajax({
				url : "api/SMS.php",
				type: "POST",
				data : {Alerts: JSON.stringify(alerts)},
				success: function(data)
				{
					console.log("Text Sent to " + recipientNumber);
					console.log("Return: " + data);
					$(".numberForm").fadeTo("slow", 3000, changeToConfirmation('success'));		
				},
				error: function (data)
				{
				$(".numberForm").text("Sorry, something wrong happened...");
				console.log("text was not sent");
				// $(".numberForm").fadeTo("slow", 3000, changeToConfirmation('error'));
				}
			}); 
	console.log($(".chosen-select").chosen().val());
  }
  else{
	alert("Please enter a valid phone number!");
  }
}

//change event handler for button to this
function onSendAgainClick(event){
	event.preventDefault();
	$(".numberForm").html(numberForm);
	$(".chosen-select").chosen();
	$(".chosen-select").chosen().val(["60", "30", "15", "0"]);
	$(".chosen-select").trigger("chosen:updated");
	$(".btnTimes-open").click(onTimesClick);
	$(".btnTimes-close").click(onTimesClick);
	$(".submitBtn").click(onSubmitClick);

}

//Quick fix for stopping removal of trailing 0
function zeroCorrect(n){
	return n > 9 ? '' + n: '0' + n;
}

function onTimesClick(event){ //times button handler
	var wh = $("body").height();
	event.preventDefault();
	$(".btn-times").toggleClass("close");
	$("#times").slideToggle("fast", function(){
	var ah = $("#times").height();
	$("html, body").animate({scrollTop: wh + ah}, 500);
	});
}
