import * as objectAssign from "object-assign";
import * as Redux from "redux";

import { ACTIVE_ORDER_FAILED, ACTIVE_ORDER_FETCHING, ACTIVE_ORDER_RECEIVED, ActiveOrderState } from "../types";

const initialState: ActiveOrderState = {
    isFetching: false,
    order: null
}

const activeOrder: Redux.Reducer<ActiveOrderState> = (state = initialState, action: any) => {

    switch (action.type) {
        case ACTIVE_ORDER_FETCHING:
            return objectAssign({}, state, { isFetching: true });

        case ACTIVE_ORDER_RECEIVED:
            return objectAssign({}, state, {
                isFetching: false,
                order: action.order
            });

        case ACTIVE_ORDER_FAILED:
            return objectAssign({}, initialState, { error: action.error });

        default:
            return state;
    }

}

export default activeOrder;