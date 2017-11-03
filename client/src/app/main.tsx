import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";

import combinedReducers from "./reducers/_combined";
import { fetchOrderList } from "./actions/order-list";

const store = redux.createStore(combinedReducers, redux.applyMiddleware(thunkMiddleware));

// Fetch pruned order list always when app starts
store.dispatch(fetchOrderList());

ReactDOM.render((
    <Provider store={store}>
        <div>Test</div>
    </Provider>
), document.getElementById("app"))