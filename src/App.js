import React, { Component } from 'react';
import './App.css';

//react-redux container elements
import { connect } from "react-redux";

//action creators
import { requestSummonerInfo, receiveSummonerInfoSuccess, receiveSummonerInfoFailure, fetchSummonerInfo } from "./actions"

//LoL API static file stuff
const PATCH_NUM = "7.2.1";
const ICON_URL = "http://ddragon.leagueoflegends.com/cdn/" + PATCH_NUM + "/img/profileicon/";
const CHAMP_SQUARE_URL = "http://ddragon.leagueoflegends.com/cdn/" + PATCH_NUM + "/img/champion/";

//test data
var testMatchList = [
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2252782032,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1469764106024,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2239714063,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1468361223540,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2238474467,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1468219650687,
      "lane": "BOTTOM",
      "role": "DUO"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2237238149,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1468113224021,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2237243805,
      "champion": 201,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1468110676420,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2225246896,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466902030317,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2222987381,
      "champion": 81,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466652897349,
      "lane": "BOTTOM",
      "role": "DUO_CARRY"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2220697267,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466455328643,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2220629964,
      "champion": 201,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466441719582,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2218039512,
      "champion": 201,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466188640345,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2218046233,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466186193069,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    },
    {
      "region": "NA",
      "platformId": "NA1",
      "matchId": 2217390191,
      "champion": 412,
      "queue": "TEAM_BUILDER_DRAFT_RANKED_5x5",
      "season": "SEASON2016",
      "timestamp": 1466125403544,
      "lane": "BOTTOM",
      "role": "DUO_SUPPORT"
    }
];

var testSummoner = {
	"id":8803,
	"name":"FreshLikeThresh",
	"profileIconId":1211,
	"revisionDate":1469766762000,
	"summonerLevel":30
};

class App extends Component {
  render() {
    return (
      <div className="App">
		<h1 className="HeaderBar">League API Tool</h1>
		<LeagueMasterInfo />
		<script src="./jquery-3.1.1.min.js"/>
      </div>
    );
  }
}

//container for application data
class LeagueContainer extends Component {

	render(){
		console.log("League Container Props:");
		console.log(this.props);
		if(this.props.searchUsed){
			return (
				<div className="LeagueContainer">
					<h1 className="SummonerInfoHeader">Summoner Search</h1>
					<SearchBar searchFunction={this.props.searchForSummoner} />
					<SummonerContainer summoner={this.props.summoner} isFetching={this.props.isFetching} />
					<h1 className="MatchHistoryHeader">Match History</h1>
					<MatchGridContainer matchList={this.props.matchList} isFetching={this.props.isFetching} />
				</div>
			);
		} else {
			return(
				<div className="LeagueContainer">
					<h1 className="SummonerInfoHeader">Summoner Search</h1>
					<SearchBar searchFunction={this.props.searchForSummoner} />
				</div>
			);
		}
	}
}


/*
 *	Here we connect our League Container that will be the outside container
 * component that passes props to all of our other components
 */
 
//we want the application state to be sent as props to children
const mapStateToProps = (state) => {
	return {
		summoner: state.summoner,
		matchList: state.matchList,
		champMastery: state.champMastery,
		searchUsed: state.searchUsed,
		isFetching: state.isFetching
	};
};

//we want the search bar to be able to dispatch a search action
const mapDispatchToProps = (dispatch) => {
	return {
		searchForSummoner: (summonerName) => {
			dispatch(fetchSummonerInfo(summonerName));
		}
	}
};

const LeagueMasterInfo = connect(
	mapStateToProps,
	mapDispatchToProps
)(LeagueContainer);


//text input
class SearchBar extends Component {
	
	constructor(props){
		super(props);
		
		this.searchForSummoner = this.searchForSummoner.bind(this);
	}
	
	//sends an AJAX call to the node server to get result from Riot
	searchForSummoner(){
		//grab summoner name
		var sumName = document.querySelector("#summonerName").value;
		console.log("Searching for summoner: " + sumName);
		//send a request to node server to fetch from API
		console.log("Search Sum");
		this.props.searchFunction(sumName);
	}

	render(){
		console.log("SEARCH BAR PROPS: ");
		console.log(this.props);
		return(
			<div className="SearchBar">
				<input id="summonerName" type="text" placeholder="Summoner Name..."/>
				<button onClick={this.searchForSummoner}> Search </button>
			</div>
		);
	}
}

//holds summoner info
class SummonerContainer extends Component {
	render(){
		if(this.props.isFetching){
			return(
				<div className="SummonerContainer">
					<LoadingAsset />
				</div>
			);
		} else {
			return(
				<div className="SummonerContainer">
					<SummonerCell summoner={this.props.summoner} />
				</div>
			);
		}
	}
}

//actual summoner info representation
class SummonerCell extends Component {
	constructor(props){
		super(props);
		
		console.log(props);
	}

	render(){
		return(
			<div className="SummonerCell">
				<h1>{this.props.summoner.name}</h1>
				<div className="img-center">
					<img src={ICON_URL + this.props.summoner.profileIconId + ".png"}  height="100" width="100" alt="Profile Icon" />
				</div>
				<h2>Level: {this.props.summoner.summonerLevel}</h2>
				<h2>Revision Date: {this.props.summoner.revisionDate}</h2>
			</div>
		);
	}
}

//holds match info
class MatchGridContainer extends Component {
	render(){
		//iterate through matches and create a div for each one
		var matches = [];
		this.props.matchList.forEach((match) => {
			matches.push(
				<MatchCellContainer match={match} />
			);
		});
		console.log(matches);
	
		if(this.props.isFetching){
			return(
				<div className="MatchGridContainer">
					<LoadingAsset />
				</div>
			);
		} else {
			return(
				<div className="MatchGridContainer">
					{matches}
				</div>
			);
		}
	}
}

class MatchCellContainer extends Component {
	render(){
		return(
			<div className="MatchCellContainer">
				<MatchCell match={this.props.match} />
				<MatchCellBackside />
			</div>
		);
	}
}

//holds representation of match
class MatchCell extends Component {
	render(){
		return(
			<div className="MatchCell">
				<h1>Date: { this.props.match.timestamp }</h1>
				<div>
					<img src={ CHAMP_SQUARE_URL + this.props.match.championName + ".png"} alt="Champion Icon" />
				</div>
				<h2>Season: {this.props.match.season}</h2>
				<h2>Lane: {this.props.match.lane}</h2>
			</div>
		);
	}
}

//backside of MatchCell
class MatchCellBackside extends Component {
	render(){
		return(
			<div className="MatchCellBackside">
				<h1>Backside</h1>
			</div>
		);
	}
}

//displayed when something is loading
class LoadingAsset extends Component {
	render(){
		return(
			<div className="LoadingAsset" >
				<h1>Loading...</h1>
			</div>
		);
	}
}

export default App;
