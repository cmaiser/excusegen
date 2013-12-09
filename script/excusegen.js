
var locationString = "";
var tweetData = [];
var trafficData = [];

$(document).ready(function(){
  
  console.log("Document Ready");
  
  $("#location").html("<span><img src=\"img/globe.gif\" style=\"vertical-align:middle\">&nbsp;&nbsp;Resolving location...</span>");
  $("#loading").hide()
  $("#returnMessage").hide()
  $("#extraContentContainer").hide();
	
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
    //url: "http://127.0.0.1:8000/locationResolver/",
    data: {
      lat: lat,
      lon: lon
    },
    success: function(data){
      
      //convert response string to object
      var responseJSON = jQuery.parseJSON(data);
      
      var city = responseJSON["city"];
      var state = responseJSON["state"];;
      var country = responseJSON["country"];;
      
      //only global until I figure out jquery scope (c'mon, it's just javascript!)
      locationString = city + ",&nbsp;" + state + ",&nbsp;" + country;
      
      $("#location").find("span").fadeOut(function(){
	$(this).html("Your&nbsp;location:&nbsp;&nbsp;" + locationString).fadeIn(1000,  getExcuses(lat, lon));
      });
    },
    error: function(xhr, textStatus, errorThrown){
      
      $("#location").find("span").fadeOut(function(){
	$(this).html("Could&nbsp;not&nbsp;resolve&nbsp;location:&nbsp;" + textStatus).fadeIn(1000);
      });
      
    }
  });
  
}


function getExcuses(lat, lon){
  $("#loading").fadeIn(1000);
  
  $.ajax({
    type: "POST",
    url: "http://54.204.21.196/excusegenservice/generateExcuses/",
    data: {
      lat: lat,
      lon: lon
    },
    success: function(data){
      
            
       //convert response string to object
	var responseJSON = jQuery.parseJSON(data);
	tweetData = responseJSON.tweetResults.tweets;
	trafficData = responseJSON.trafficResults.incidents;
      
	$("#loading").hide();
	$("#returnMessage").html(responseJSON["returnMessage"]).fadeIn(1000);
	
	if(tweetData.length > 0){
	  $("#returnMessage").append("<input type=\"button\" id=\"showTweets\" class=\"hideContent\" value=\"Tweets\"/>");
	  
	  $("#showTweets").click(function(){
	    onShowTweetsClicked();
	  });
	  
	} 
	
	if(trafficData.length > 0){
	  $("#returnMessage").append("<br /><input type=\"button\" id=\"showTraffic\" class=\"hideContent\" value=\"Traffic Incidents\"/>");
	  
	  $("#showTraffic").click(function(){
	    onShowTrafficClicked();
	  });
	  
	}


//       $("#location").find("span").fadeOut(function(){
// 	$(this).html("Your&nbsp;location:&nbsp;&nbsp;" + locationString).fadeIn(1000,  getExcuses(lat, lon));
//       });
    },
    error: function(xhr, textStatus, errorThrown){
      
//       $("#location").find("span").fadeOut(function(){
// 	$(this).html("Could&nbsp;not&nbsp;resolve&nbsp;location:&nbsp;" + textStatus).fadeIn(1000);
//       });
      
    }
  });
}

function onShowTweetsClicked(){

  var tweets = "";
  
  for(var i=0; i<tweetData.length; i++){
    
    var localDate = new Date(tweetData[i].date);
    
    var tweetClass = "extraContent";
    
    if(i%2 == 0){
      tweetClass += "1";
    }
    else{
      tweetClass += "2";
    }
    
    tweets += "<div class=\"" + tweetClass + "\">" +
		      "<span class=\"extraContentHead\">" + tweetData[i].user + "&nbsp;&nbsp;" + localDate + "</span><br />" + 
		      "<span class=\"extraContentBody\">" + tweetData[i].text + "</span><br />" +
                    "</div>"
  }

  
  $("#returnMessage").hide();
  $("#extraContent").html(tweets);
  $("#extraContentContainer").show("slide", {direction: "up"}, 500);
  
  $("#hideContent").click(function(){
    onHideContentClicked();
  });

}

function onShowTrafficClicked(){

  var trafficIncidents = "";
  
  for(var i=0; i<trafficData.length; i++){
    
    var trafficClass = "extraContent";

    if(i%2 == 0){
      trafficClass += "1";
    }
    else{
      trafficClass += "2";
    }
    
    trafficIncidents += "<div class=\"" + trafficClass + "\">" +
                      "<img src=\"" + trafficData[i].iconURL + "\" class=\"trafficImage\" />" +
		      "<span class=\"extraContentBody\">" + trafficData[i].fullDesc + "</span><br />" +
                    "</div>"
  }

  
  $("#returnMessage").hide();
  $("#extraContent").html(trafficIncidents);
  $("#extraContentContainer").show("slide", {direction: "up"}, 500);
  
  $("#hideContent").click(function(){
    onHideContentClicked();
  });
}

function onHideContentClicked(){
  $("#extraContentContainer").hide("slide", {direction: "up"}, 500, function(){$("#returnMessage").show();});
}








