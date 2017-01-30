/*
 * NodeJS + ExpressJS server that will 
 * act as a hub for API calls from the 
 * ReactJS view to the Riot API server.
 */

const express = require("express");
const request = require("request-promise");
const bodyParser = require("body-parser");
const cors = require("cors");

//init app
const app = express();

//allow CORS
app.use(cors());

//globals from config
const RIOT_API_KEY = "5bebedb8-e13a-49bb-8731-238f74c1f76d";

//parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
  
//parse application/json 
app.use(bodyParser.json())

app.get("/lol/summoner/:summoner_name", function(req, res){
	console.log("Received request at '/lol/summoner/{name}' endpoint.\nFor summoner: " + req.params.summoner_name);

	//convert summoner name to lower case for later user when accessing inner property of result
	var sumName= req.params.summoner_name.toLowerCase();
	
	//for use later inside async calls
	var summonerObj, matchList, champList = {}, response;

	//GET SUMMONER
	var url = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + req.params.summoner_name + "?api_key=" + RIOT_API_KEY;
	var options = {
		uri: url,
		headers: {
			"User-Agent": "Tony's Riot API Fetcher"
		},
		json: true
	};
	//process response
	request(options)
	.then(function(result){
		console.log("Success getting summoner: \n" + JSON.stringify(result[sumName]));
		//store reference
		summonerObj = result[sumName];
		//res.json(result[sumName]);
	})
	.catch(function(err){
		 console.log("Error getting summoner: \n" + err);
		 res.json({ error: "Error getting summoner info." });
	})
	
	//GET MATCHLIST
	.then(function(nothing){
		url = "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + summonerObj.id + "?beginIndex=0&endIndex=25&api_key=" + RIOT_API_KEY;
		options = {
			uri: url,
			headers: {
				"User-Agent": "Tony's Riot API Fetcher"
			},
			json: true
		};
		//send request and get promise
		return request(options);
	})
	//process second call
	.then(function(result){
		//store reference
		matchList = result.matches;
	})
	.catch(function(err){
		console.log("Error getting match list: \n" + err);
		res.json({ error: "Error getting match list." });
	})
	
	//GET CHAMPION LIST
	.then(function(nothing){
		url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=" + RIOT_API_KEY;
		options = {
			uri: url,
			headers: {
				"User-Agent": "Tony's Riot API Fetcher"
			},
			json: true
		};
		//send request and get promise
		return request(options);
	})
	//process third call
	.then(function(result){
		console.log("Success getting champion list.");
		//iterate through each champion in the list
		var len = 0;
		for( var champ in result.data ){
			if(result.data.hasOwnProperty(champ)){
				champList[result.data[champ].id] = result.data[champ].name;
			}
		}
		//go through each of the matches in the match list and 
		//grab their name from the champ list to create a URL to their picture
		for(i = 0; i < matchList.length; i++){
			matchList[i].championName = champList[matchList[i].champion];
			//convert date as well
			var tmpDate = new Date(parseInt(matchList[i].timestamp)).toDateString();
			matchList[i].timestamp = tmpDate;
		}
		//construct response and said
		response = {
			summoner: summonerObj,
			matchList: matchList
		};
		res.json(response);
	})
	.catch(function(err){
		console.log("Error getting champion list: \n" + err);
		res.json({ error: "Error getting champion list." });
	});
});

app.listen(3002, function(){
	console.log("League of Legends API app listening on port 3002...\n");
});
