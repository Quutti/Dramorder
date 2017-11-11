import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import thunkMiddleware from "redux-thunk";

import { Routes } from "./routes";
import combinedReducers from "./reducers/_combined";
import { fetchOrderList } from "./actions/order-list";

import "./styles/globals/main.global.css";

const store = redux.createStore(combinedReducers, redux.applyMiddleware(thunkMiddleware));

// Fetch pruned order list always when app starts
store.dispatch(fetchOrderList());

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <div className="page-wrapper">
                <Routes />
            </div>
        </BrowserRouter>
    </Provider>
), document.getElementById("app"))