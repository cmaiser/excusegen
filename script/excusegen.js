
$(document).ready(function(){
  
  var bannerDiv = $("#banner");
  var msg = "<h1>Excuse&nbsp;Generator&nbsp;Coming&nbsp;Soon(ish)</h1>";
	
  bannerDiv.html(msg);
	
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
	  
      var positionHtml = "Your&nbsp;location:&nbsp;&nbsp;Latitude&nbsp;=&nbsp;" + position.coords.latitude + 
			 "&#176;&nbsp;&nbsp;&nbsp;Longitude&nbsp;=&nbsp;" + position.coords.longitude + 
		         "&#176;";
      var positionMap = "<img src=\"http://maps.googleapis.com/maps/api/staticmap?center=" +
	                position.coords.latitude + "," + position.coords.longitude + 
	                "&zoom=13 &size=640x400&sensor=false&visual_refresh=false\">";
      $("#location").append(positionHtml);
      $("#locationMap").append(positionMap);    
    });
  }
  else{
    $("#location").text("Update your browser!");
  }
  tryThis();
});

function tryThis(){
  alert("jquery called this");
}