import axios from "axios";

import {
    ACTIVE_ORDER_FAILED,
    ACTIVE_ORDER_FETCHING,
    ACTIVE_ORDER_RECEIVED,
    ACTIVE_ORDER_ADD_ITEM,
    ACTIVE_ORDER_ADD_LIST,
    Order,
    OrderItem
} from "../types";

export const fetchActiveOrder = (orderId: number) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.get(`api/orders/${orderId}`)
            .then(res => dispatch(receivedActiveOrder(res.data.payload)))
            .catch(err => dispatch(failureActiveOrder(err)));
    }
}

export const loginActiveOrder = (orderId: number, password: string) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.post(`api/orders/${orderId}/auth`, { password })
            .then(res => dispatch(fetchActiveOrder(orderId)))
            .catch(err => dispatch(failureActiveOrder(err)));
    }
}

export const addItemActiveOrder = (orderId: number, listId: number, newItem: OrderItem) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.post(`api/orders/${orderId}/lists/${listId}/items`, newItem)
            .then(res => dispatch(fetchActiveOrder(orderId)))
            .catch(err => dispatch(failureActiveOrder(err)));
    }
}

const fetchingActiveOrder = () => {
    return { type: ACTIVE_ORDER_FETCHING }
}

const receivedActiveOrder = (order: Order) => {
    return {
        type: ACTIVE_ORDER_RECEIVED,
        order
    }
}

const failureActiveOrder = (error: any) => {
    return {
        type: ACTIVE_ORDER_FAILED,
        error
    }
}