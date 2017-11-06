export interface RootState {
    activeOrder: ActiveOrderState;
    orderList: OrderListState;
}

export const ORDER_LIST_FETCHING = "ORDER_LIST_FETCHING";
export const ORDER_LIST_RECEIVED = "ORDER_LIST_RECEIVED";
export const ORDER_LIST_FAILED = "ORDER_LIST_FAILED";

export interface OrderListState {
    isFetching: boolean;
    orders: PrunedOrder[];
}

export interface PrunedOrder {
    id?: number;
    name: string;
    createdAt: string;
}

export const ACTIVE_ORDER_FETCHING = "ACTIVE_ORDER_FETCHING";
export const ACTIVE_ORDER_RECEIVED = "ACTIVE_ORDER_RECEIVED";
export const ACTIVE_ORDER_FAILED = "ACTIVE_ORDER_FAILED";

export interface ActiveOrderState {
    isFetching: boolean;
    order: Order;
}

export interface Order extends PrunedOrder {
    currencyMultiplier: number;
    status: string;
    lists: OrderList[];
}

export interface OrderList {
    id?: number;
    name: string;
    added?: string;
    items: OrderItem[]
}

export interface OrderItem {
    id?: number;
    name: string;
    href: string;
    price: number;
    quantity: number;
    added?: string;
}