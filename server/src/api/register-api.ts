import { Express, RequestHandler } from "express";

import { Response } from "../types";
import { authMiddleware } from "../auth";

import { listOrders, addOrder, orderAuth, orderData } from "./orders";

type EndpointMethod = "post" | "get";

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
        authRequired: false
    }, {
        url: "/api/orders/:orderId",
        method: "get",
        handler: orderData
    }];

    registerEndpointArray(app, orderEndpoints);
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