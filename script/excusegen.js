
$(document).ready(function(){
  
  //var goddamnit = "{\"results\" : [{ \"address_components\" : [{\"long_name\" : \"3901-3947\", \"short_name\" : \"3901-3947\", \"types\" : [ \"street_number\" ]}]}]}";
  
  var bob;
  
  
  
  console.log("Document Ready");
  
  var bannerDiv = $("#banner");
  var msg = "<h1>Excuse&nbsp;Generator&nbsp;Coming&nbsp;Soon(ish)</h1>";
	
  bannerDiv.html(msg);
	
  if(navigator.geolocation){
    
    console.log("navigator.geolocation available");
    
    navigator.geolocation.getCurrentPosition(function(position){
      
      var location = resolveLocation(position.coords.latitude, position.coords.longitude);
	  
      var positionHtml = "Your&nbsp;location:&nbsp;&nbsp;location";
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
    url: "http://54.204.21.196/excusegenservice/locationResolver/",
    data: {
      lat: lat,
      lon: lon
    },
    success: function(data){
      var responseJSON = jQuery.parseJSON(data);
      
      var city = responseJSON.results[0].address_components[4].long_name;
      console.log(city);
      var state = responseJSON.results[0].address_components[5].long_name;
      console.log(state);
      var country = responseJSON.results[0].address_components[6].long_name;
      console.log(country);
      
      //return city + ", " + state + ", " + country;
    },
    error: function(xhr, textStatus, errorThrown){
      alert("Error connecting to server!");
    }
    
  });
}