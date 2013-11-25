
$(document).ready(function(){
  
  console.log("Document Ready");
  
  $("#location").html("<span>Resolving location...</span>");
	
  if(navigator.geolocation){
    
    console.log("navigator.geolocation available");
    
    navigator.geolocation.getCurrentPosition(function(position){
      
      resolveLocation(position.coords.latitude, position.coords.longitude);
      //getMap(position.coords.latitude, position.coords.longitude);
     
    });
  }
  else{
    $("#location").html("Update&nbsp;your&nbsp;browser!");
  }
});

function resolveLocation(lat, lon){
  
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
      
      $("#location").find("span").fadeOut(function(){
	$(this).html("Your&nbsp;location:&nbsp;&nbsp;" + city + ",&nbsp;" + state + ",&nbsp;" + country).fadeIn(1000);
      });

    },
    error: function(xhr, textStatus, errorThrown){
      
      $("#location").find("span").fadeOut(function(){
	$(this).html("Could&nbsp;not&nbsp;resolve&nbsp;location:&nbsp;" + textStatus).fadeIn(1000);
      });
      
    }
  });
  
}

/*
function getMap(lat, lon){
  var positionMap = "<img id=\"map\" src=\"http://maps.googleapis.com/maps/api/staticmap?center=" +
	                lat + "," + lon + 
	                "&zoom=13 &size=640x400&sensor=false&visual_refresh=false\">";
   
  $("#locationMap").append(positionMap);
}
*/