
var locationString = "";
var tweetData = [];

$(document).ready(function(){
  
  console.log("Document Ready");
  
  $("#location").html("<span><img src=\"img/globe.gif\" style=\"vertical-align:middle\">&nbsp;&nbsp;Resolving location...</span>");
  $("#loading").hide()
  $("#returnMessage").hide()
  $("#tweetContainer").hide();
	
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
	tweetData = responseJSON["tweets"];
      
	$("#loading").hide();
	$("#returnMessage").html(responseJSON["returnMessage"]).fadeIn(1000);
	
	if(tweetData.length > 0){
	  $("#returnMessage").append("<input type=\"button\" id=\"showTweets\" value=\"View Tweets\"/>");
	  
	  $("#showTweets").click(function(){
	    onShowTweetsClicked();
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
    
    var tweetClass = "tweet";
    
    if(i%2 == 0){
      tweetClass += "1";
    }
    else{
      tweetClass += "2";
    }
    
    tweets += "<div class=\"" + tweetClass + "\">" +
		      "<span class=\"tweetHead\">" + tweetData[i].user + "&nbsp;&nbsp;" + localDate + "</span><br />" + 
		      "<span class=\"tweetBody\">" + tweetData[i].text + "</span><br />" +
                    "</div>"
  }

  
  $("#returnMessage").hide();
  $("#tweetContent").html(tweets);
  $("#tweetContainer").show("slide", {direction: "up"}, 500);
  
  $("#hideTweets").click(function(){
    onHideTweetsClicked();
  });

}

function onHideTweetsClicked(){
  $("#tweetContainer").hide("slide", {direction: "down"}, 500);
  $("#returnMessage").show();
}








