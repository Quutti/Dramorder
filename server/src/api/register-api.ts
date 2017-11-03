import { Express, RequestHandler } from "express";

import { Response } from "../types";
import { authMiddleware } from "../auth";
import { checkExistanceMiddleware } from "./middlewares";

import { listOrders, addOrder, orderAuth, orderData, orderUpdate } from "./orders";
import { listLists, addList, listData } from "./lists";
import { addItem, itemData, deleteItem } from "./items";

type EndpointMethod = "post" | "get" | "put" | "delete";

interface Endpoint {
    url: string;
    method: EndpointMethod;
    handler: RequestHandler;
    authRequired?: boolean;
    middlewares?: RequestHandler[];
}

export const registerApi = (app: Express) => {

    const orderEndpoints: Endpoint[] = [{
        url: "/api/orders",
        method: "get",
        handler: listOrders,
        authRequired: false
    }, {
        url: "/api/orders",
        method: "post",
        handler: addOrder,
        authRequired: false
    }, {
        url: "/api/orders/:orderId/auth",
        method: "post",
        handler: orderAuth,
        middlewares: [checkExistanceMiddleware],
        authRequired: false
    }, {
        url: "/api/orders/:orderId",
        method: "get",
        middlewares: [checkExistanceMiddleware],
        handler: orderData
    }, {
        url: "/api/orders/:orderId",
        method: "put",
        middlewares: [checkExistanceMiddleware],
        handler: orderUpdate
    }];

    const listEndpoints: Endpoint[] = [{
        url: "/api/orders/:orderId/lists",
        method: "get",
        middlewares: [checkExistanceMiddleware],
        handler: listLists
    }, {
        url: "/api/orders/:orderId/lists",
        method: "post",
        middlewares: [checkExistanceMiddleware],
        handler: addList
    }, {
        url: "/api/orders/:orderId/lists/:listId",
        method: "get",
        middlewares: [checkExistanceMiddleware],
        handler: listData
    }];

    const itemEndpoints: Endpoint[] = [{
        url: "/api/orders/:orderId/lists/:listId/items",
        method: "post",
        middlewares: [checkExistanceMiddleware],
        handler: addItem
    }, {
        url: "/api/orders/:orderId/lists/:listId/items/:itemId",
        method: "get",
        middlewares: [checkExistanceMiddleware],
        handler: itemData
    }, {
        url: "/api/orders/:orderId/lists/:listId/items/:itemId",
        method: "delete",
        middlewares: [checkExistanceMiddleware],
        handler: deleteItem
    }];

    registerEndpointArray(app, orderEndpoints);
    registerEndpointArray(app, listEndpoints);
    registerEndpointArray(app, itemEndpoints);
}

const registerEndpointArray = (app: Express, endpoints: Endpoint[]) => {
    endpoints.forEach(ep => {
        const { url, handler, method, authRequired } = ep;
        let { middlewares } = ep;

        if (!middlewares) {
            middlewares = [];
        }

        // We want to be really strict here
        if (authRequired !== false) {
            middlewares.unshift(authMiddleware);
        }

        app[method](url, middlewares, handler);

        console.log(`[Register] ${method} ${url}`);
    });
}