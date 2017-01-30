//for user with fetch
require('es6-promise').polyfill();
//import fetch from "isomorphic-fetch";

//action creators
function requestSummonerInfo(summonerName){
	return {
		type: "REQUEST_SUMMONER_INFO",
		summonerName
	};
}

function receiveSummonerInfoSuccess(json){
	return {
		type: "RECEIVE_SUMMONER_INFO_SUCCESS",
		summonerInfo: json
	};
}

function receiveSummonerInfoFailure(json){
	return {
		type: "RECEIVE_SUMMONER_INFO_FAILURE",
		response: json
	};
}

//ASYNC action creator
function fetchSummonerInfo(summonerName){
	return function(dispatch){
		//first we want to send out a request summoner info action to update state
		//and tell the application that the results are being fetched
		dispatch(requestSummonerInfo(summonerName));
		
		//now we want to asynchronously fetch results from the LoL API
		//by pinging my NodeJS server that will perform all the API calls
		return fetch("http://www.tonyanziano.com:3002/LoL/summoner/" + summonerName)
			.then(response => {
				//convert body to JSON
				return response.json();
			})
			.then(json => {
				console.log("Received JSON from NodeJS server: ");
				console.log(json);
				
				//dispatch success
				dispatch(receiveSummonerInfoSuccess(json));
				
			})
			.catch(err => {
				console.log("Error receiving Summoner Info from NodeJS server." + err);
				//dispatch failure
				dispatch(receiveSummonerInfoFailure(err));
			})
			
			;
	};
}

export { requestSummonerInfo, receiveSummonerInfoSuccess, receiveSummonerInfoFailure, fetchSummonerInfo };