
$(document).ready(function(){
  
  console.log("Document Ready");
  
  var bannerDiv = $("#banner");
  var msg = "<h1>Excuse&nbsp;Generator&nbsp;Coming&nbsp;Soon(ish)</h1>";
	
  bannerDiv.html(msg);
	
  if(navigator.geolocation){
    
    console.log("navigator.geolocation available");
    
    navigator.geolocation.getCurrentPosition(function(position){
      
      resolveLocation(position.coords.latitude, position.coords.longitude);
      
      var positionMap = "<img src=\"http://maps.googleapis.com/maps/api/staticmap?center=" +
	                position.coords.latitude + "," + position.coords.longitude + 
	                "&zoom=13 &size=640x400&sensor=false&visual_refresh=false\">";
   
      $("#locationMap").append(positionMap);    
    });
  }
  else{
    $("#location").text("Update your browser!");
  }
});

function resolveLocation(lat, lon){
  
  var positionHtml = "Your&nbsp;location:&nbsp;&nbsp;";
  
  $.ajax({
    type: "POST",
    url: "http://54.204.21.196/excusegenservice/locationResolver/",
    data: {
      lat: lat,
      lon: lon
    },
    success: function(data){
      
      //convert response string to object
      var responseJSON = jQuery.parseJSON(data);
      var addressComponents = [];
      
      if(typeof(responseJSON.results[0].address_components !== "undefined")){
	addressComponents = responseJSON.results[0].address_components;
	console.log("addressComponents set: " + addressComponents.length);
      }
      
      var city = "";
      var state = "";
      var country = "";
      
      for(var i=0; i<addressComponents.length; i++){
	if(addressComponents[i].types[0] == "administrative_area_level_2" 
	   && addressComponents[i].types[1] == "political"){
	  city = addressComponents[i].long_name;
	  continue;
	}
	else if(addressComponents[i].types[0] == "administrative_area_level_1" 
	   && addressComponents[i].types[1] == "political"){
	  state = addressComponents[i].long_name;
	  continue;
	}
	else if(addressComponents[i].types[0] == "country" 
	   && addressComponents[i].types[1] == "political"){
	  country = addressComponents[i].long_name;
	  continue;
	}
      }
      
      $("#location").append(positionHtml + city + ",&nbsp;" + state + ",&nbsp;" + country);
    },
    error: function(xhr, textStatus, errorThrown){
      $("#location").append("Could&nbsp;not&nbsp;resolve&nbsp;location:&nbsp;" + textStatus);
    }
    
  });
}