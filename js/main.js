//Main javascript with all the fancy stuffs

var times;
var latitude;
var longitude;

$(document).ready(function() {
		get_location();
});


function get_location() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
};

function successFunction(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
	//codeLatLng(lat, lng);
    // Get sunset time
    times = SunCalc.getTimes(new Date(), latitude, longitude);
    //Log in the console
    console.log("Sunset: "+times.sunset);
	document.getElementById("container").style.display = "block"; //Display HTML content

}


function errorFunction(){
    alert("Sorry, you can't use this website, please enable location services");
}

function processNumber(){
	console.log("Hello :" + times.sunset);
};

$("#btn").click(function(event){
  event.preventDefault(); 
  $.ajax({
    url : "api/SMS.php",
    type: "POST",
    data : {number:"07708248867",message:"hello"},
    success: function(data)
    {
        $("#result").text("Your sms will be send!");
		alert("Text sent");
    },
    error: function (data)
    {
              $("#result").text("Sorry, something wrong happened...");
			  alert("error?");
    }
  });
});  


function validateForm()
{

    var z = document.forms["phoneNumber"]["num"].value;
    if(!z.match(/^\d+/))
        {
        alert("Please only enter numeric characters.(Allowed input:0-9)")
        }
}