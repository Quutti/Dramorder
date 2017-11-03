import * as objectAssign from "object-assign";
import * as Redux from "redux";

import { ORDER_LIST_FAILED, ORDER_LIST_FETCHING, ORDER_LIST_RECEIVED, OrderListState } from "../types";

const initialState: OrderListState = {
    isFetching: false,
    orders: []
}

const orderList: Redux.Reducer<OrderListState> = (state = initialState, action: any) => {

    switch (action.type) {
        case ORDER_LIST_FETCHING:
            return objectAssign({}, state, { isFetching: true });

        case ORDER_LIST_RECEIVED:
            return objectAssign({}, state, {
                isFetching: false,
                orders: action.orders
            });

        case ORDER_LIST_FAILED:
            return objectAssign({}, state, { error: action.error });

        default:
            return state;
    }

}

export default orderList;