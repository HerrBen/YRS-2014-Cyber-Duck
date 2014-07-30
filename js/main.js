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

};


function errorFunction(){
    alert("Sorry, you can't use this website, please enable location services");
};

function processNumber(){
	console.log("Hello :" + times.sunset);
};

function changeToConfirmation(){
	$(".numberForm").html("Done");
};

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
})



$('.numberField').keyup(function() {
    var $th = $(this);
    $th.val( $th.val().replace(/[^a-zA-Z0-9]/g, function(str) { alert('You typed " ' + str + ' ".\n\nPlease use only letters and numbers.'); return ''; } ) );
}
