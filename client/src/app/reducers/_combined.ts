import { combineReducers } from "redux";

import orderList from "./order-list";
import activeOrder from "./active-order";

export default combineReducers({
    orderList,
    activeOrder
});