
var locationString = "";
var tweetData = [];
var trafficData = [];
var weatherData = [];
var holidayData = [];

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
	$(this).html("Your&nbsp;location:&nbsp;&nbsp;" + locationString).fadeIn(1000,  getExcuses(lat, lon, city, state));
      });
    },
    error: function(xhr, textStatus, errorThrown){
      
      $("#location").find("span").fadeOut(function(){
	$(this).html("Could&nbsp;not&nbsp;resolve&nbsp;location:&nbsp;" + textStatus).fadeIn(1000);
      });
      
    }
  });
  
}


function getExcuses(lat, lon, city, state){
  $("#loading").fadeIn(1000);
  
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getYear() + 1900;
  
  $.ajax({
    type: "POST",
    url: "http://54.204.21.196/excusegenservice/generateExcuses/",
    data: {
      lat: lat,
      lon: lon,
      cityName: city,
      stateShortName: state,
      day: day,
      month: month,
      year: year
    },
    success: function(data){
      
            
       //convert response string to object
	var responseJSON = jQuery.parseJSON(data);
	tweetData = responseJSON.tweetResults.tweets;
	trafficData = responseJSON.trafficResults.incidents;
	weatherData = responseJSON.weatherAlerts.alerts;
	holidayData = responseJSON.holidays.holidays
      
	$("#loading").hide();
	$("#returnMessage").html("").fadeIn(1000);
	
	//Tweet button
	$("#returnMessage").append("<input type=\"button\" id=\"showTweets\" class=\"excuseButton\" value=\"Tweets&nbsp;(" + tweetData.length + ")\"/><br />");
	  
	$("#showTweets").click(function(){
	  onShowTweetsClicked();
	});
	
	//Traffic button
	$("#returnMessage").append("<br /><input type=\"button\" id=\"showTraffic\" class=\"excuseButton\" value=\"Traffic&nbsp;(" + trafficData.length + ")\"/><br />");
	  
	$("#showTraffic").click(function(){
	  onShowTrafficClicked();
	});
	
	//Weather button
	$("#returnMessage").append("<br /><input type=\"button\" id=\"showWeather\" class=\"excuseButton\" value=\"Weather&nbsp;(" + weatherData.length + ")\"/><br />");
	  
	$("#showWeather").click(function(){
	  onShowWeatherClicked();
	});
	
	//Holiday button
	$("#returnMessage").append("<br /><input type=\"button\" id=\"showHolidays\" class=\"excuseButton\" value=\"Holidays&nbsp;(" + holidayData.length + ")\"/><br />");
	  
	$("#showHolidays").click(function(){
	  onShowHolidaysClicked();
	});
	
	//Refresh button
	$("#returnMessage").append("<br /><input type=\"button\" id=\"refreshData\" class=\"excuseButton\" value=\"Refresh Data\"/><br /><br />");
	
	$("#refreshData").click(function(){

	  $("#returnMessage").hide()
	  $("#extraContentContainer").hide();
	  getExcuses(lat, lon, city, state);
	});
	
	$("#returnMessage").append(responseJSON.elapsedTime)
    },
    error: function(xhr, textStatus, errorThrown){

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
		      "<span class=\"extraContentHead\">" + tweetData[i].user + "&nbsp;&nbsp;-&nbsp;&nbsp;" + localDate + "</span><br />" + 
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

function onShowWeatherClicked(){

  var weatherAlerts = "";
  
  for(var i=0; i<weatherData.length; i++){
    
    var weatherClass = "extraContent";

    if(i%2 == 0){
      weatherClass += "1";
    }
    else{
      weatherClass += "2";
    }
    
    weatherAlerts += "<div class=\"" + weatherClass + "\">" +
		     "<span class=\"extraContentHead\">" + weatherData[i].description + "&nbsp;&nbsp;-&nbsp;&nbsp;" + weatherData[i].date + "</span><br />" +
		     "<span class=\"extraContentBody\">" + weatherData[i].message + "</span><br />" +
                     "</div>"
  }
  
  if(weatherAlerts == ""){
    weatherAlerts = "<div class=\"extraContent2\">" +
		    "<span class=\"extraContentBody\">There are no weather alerts for your area!  Lucky you!</span><br />" +
		    "</div>"
  }

  
  $("#returnMessage").hide();
  $("#extraContent").html(weatherAlerts);
  $("#extraContentContainer").show("slide", {direction: "up"}, 500);
  
  $("#hideContent").click(function(){
    onHideContentClicked();
  });
}

function onShowHolidaysClicked(){

  var holidays = "";
  
  for(var i=0; i<holidayData.length; i++){
    
    var holidayClass = "extraContent";

    if(i%2 == 0){
      holidayClass += "1";
    }
    else{
      holidayClass += "2";
    }
    
    holidays += "<div class=\"" + holidayClass + "\">" +
		     "<span class=\"extraContentBody\">" + holidayData[i].name + "</span><br />" +
                     "</div>"
  }
  
  if(holidays == ""){
    holidays = "<div class=\"extraContent2\">" +
		    "<span class=\"extraContentBody\">Today is not a holiday!  Sorry!</span><br />" +
		    "</div>"
  }

  
  $("#returnMessage").hide();
  $("#extraContent").html(holidays);
  $("#extraContentContainer").show("slide", {direction: "up"}, 500);
  
  $("#hideContent").click(function(){
    onHideContentClicked();
  });
}

function onHideContentClicked(){
  $("#extraContentContainer").hide("slide", {direction: "up"}, 500, function(){$("#returnMessage").show();});
}








