//Main javascript with all the fancy stuffs

var times;
var latitude;
var longitude;

//Request location before doing anything
window.onload = function(){
	get_location();
};

function processNumber(){

};

function get_location() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
};

function successFunction(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
 //   codeLatLng(lat, lng);
    // Get sunset time
    times = SunCalc.getTimes(new Date(), latitude, longitude);
    // Log in the console
    console.log("Sunset: "+times.sunset);
	document.getElementById("container").style.display = "block"; //Display HTML content
}

function errorFunction(){
    alert("Sorry, you can't use this website, please enable location services");
}

