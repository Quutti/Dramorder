import axios from "axios";

import { ORDER_LIST_FAILED, ORDER_LIST_FETCHING, ORDER_LIST_RECEIVED, PrunedOrder } from "../types";

export const fetchOrderList = () => {
    return (dispatch) => {
        dispatch(fetchingOrderList());
        axios.get("api/orders")
            .then(res => dispatch(receivedOrderList(res.data.payload)))
            .catch(err => dispatch(failureOrderList(err)));
    }
}

const fetchingOrderList = () => {
    return { type: ORDER_LIST_FETCHING }
}

const receivedOrderList = (orders: PrunedOrder[]) => {
    return {
        type: ORDER_LIST_RECEIVED,
        orders
    }
}

const failureOrderList = (error: any) => {
    return {
        type: ORDER_LIST_FAILED,
        error
    }
}