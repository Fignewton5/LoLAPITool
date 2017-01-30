import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

//react-redux stuff
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

//allows async actions
import thunkMiddleware from "redux-thunk";

//reducer
import { leagueReducer } from "./reducers";

//store declaration
const store = createStore(leagueReducer, applyMiddleware(thunkMiddleware) );

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
