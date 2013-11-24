
$(document).ready(function(){
  
  console.log("Document Ready");
  
  var bannerDiv = $("#banner");
  var msg = "<h1>Excuse&nbsp;Generator&nbsp;Coming&nbsp;Soon(ish)</h1>";
	
  bannerDiv.html(msg);
	
  if(navigator.geolocation){
    
    console.log("navigator.geolocation available");
    
    navigator.geolocation.getCurrentPosition(function(position){
      
      resolveLocation(position.coords.latitude, position.coords.longitude);
	  
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
});

function resolveLocation(lat, lon){
  
  console.log("resolveLocation");
  
  $.ajax({
    type: "POST",
    url: "http://54.204.21.196/excusegenservice/locationResolver",
    data: {
      lat: lat,
      lon: lon
    },
    success: function(data){
      alert(data);
    },
    error: function(xhr, textStatus, errorThrown){
      alert("Error connecting to server!");
    }
    
  });
}