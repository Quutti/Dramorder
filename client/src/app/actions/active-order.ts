import axios from "axios";

import {
    ACTIVE_ORDER_FAILED,
    ACTIVE_ORDER_FETCHING,
    ACTIVE_ORDER_RECEIVED,
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

export const deleteItemActiveOrder = (orderId: number, listId: number, itemId: number) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.delete(`api/orders/${orderId}/lists/${listId}/items/${itemId}`)
            .then(res => dispatch(fetchActiveOrder(orderId)))
            .catch(err => dispatch(failureActiveOrder(err)));
    }
}

export const addListActiveOrder = (orderId: number, listName: string) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.post(`api/orders/${orderId}/lists`, { name: listName })
            .then(res => dispatch(fetchActiveOrder(orderId)))
            .catch(err => dispatch(failureActiveOrder(err)));
    }
}

export const deleteListActiveOrder = (orderId: number, listId: number) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.delete(`api/orders/${orderId}/lists/${listId}`)
            .then(res => dispatch(fetchActiveOrder(orderId)))
            .catch(err => dispatch(failureActiveOrder(err)));
    }
}

export const updateListActiveOrder = (orderId: number, listId: number, newName: string) => {
    return (dispatch) => {
        dispatch(fetchingActiveOrder());
        axios.put(`api/orders/${orderId}/lists/${listId}`, { name: newName })
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