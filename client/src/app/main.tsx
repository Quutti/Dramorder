import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";

import combinedReducers from "./reducers/_combined";

const store = redux.createStore(combinedReducers, redux.applyMiddleware(thunkMiddleware));

ReactDOM.render((
    <Provider store={store}>
        <div>Test</div>
    </Provider>
), document.getElementById("app"))