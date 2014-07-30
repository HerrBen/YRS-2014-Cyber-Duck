//Main javascript with all the fancy stuffs

var times;
var latitude;
var longitude;
var clock = $('.clock').FlipClock({});

//event hooks
//process location only when document is ready to be manipulated
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
$('.numberField').keyup(function () {
    if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
       this.value = this.value.replace(/[^0-9\.]/g, '');
    }
});

/*Functions*/
//Check if geolocation is present, then jump to respective function
function get_location() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
}

//If geolocating is successful proceed to calculate sunset times and set the clock
function successFunction(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
	//codeLatLng(lat, lng);
	setTimes(); //Get and set clock and sunset times
	document.getElementById("container").style.display = "block"; //Unhide HTML content

}

function setTimes(){
    times = SunCalc.getTimes(new Date(), latitude, longitude).sunset; //calculate sunset time based on longitude and latitude
	$(".sunsetLabel").replaceWith('<p class="sunsetLabel centerClass">The sun sets at ' + (times.getHours() - 12) +':'+times.getMinutes() + 'pm </p>');	//Set time text
	clock.setTime(-600);
}


function errorFunction(){
    $("#container").html('"<div class="enableLocation centerClass">Oh no! It looks like you have location services disabled. Please enable it and try again.  </div>"'); //Displays message to user about geolocating
	document.getElementById("container").style.display = "block"; //Display HTML content
}

function processNumber(){
	console.log("Hello :" + times.sunset);
}

function changeToConfirmation(){
	$(".numberForm").html("Done");
}
