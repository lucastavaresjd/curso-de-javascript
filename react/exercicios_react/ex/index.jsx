import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import CountReducer from './countReducer'
import Count from './count'


const reducers = combineReducers({
    count: CountReducer
})


ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <Count />
    </Provider>
    , document.getElementById('app'))


