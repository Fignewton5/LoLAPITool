/*
 *	REDUCERS
 */
 //write reducer that takes receive success action and updates application state
 
 var initialState = {
	isFetching: false,
	searchUsed: false,
	summoner: {},
	matchList: [],
	champMastery: {}
};
 
function leagueReducer(state = initialState, action){
	//process the action and change state accordingly
	switch(action.type){
		case "REQUEST_SUMMONER_INFO":
			console.log("Request initiated");
			return Object.assign({}, state, {
				isFetching: true
			});
			break;
		case "RECEIVE_SUMMONER_INFO_SUCCESS":
			console.log("Async Success");
			console.log("Summoner Info: ");
			console.log(action.summonerInfo);
			return Object.assign({}, state, {
				isFetching: false,
				summoner: action.summonerInfo.summoner,
				matchList: action.summonerInfo.matchList,
				searchUsed: true
			});
			break;
		case "RECEIVE_SUMMONER_INFO_FAILURE":
			console.log("Async Failure");
			break;
		default:
			console.log("Initial Reducer Call");
			return state;
			break;
	};
}
 
export { leagueReducer };