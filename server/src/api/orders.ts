import { RequestHandler } from "express";
import * as DB from "easy-mysql-with-promise";
import * as auth from "../auth";
import * as helpers from "../helpers";
import * as lists from "./lists";
import { Response } from "../types";



export interface Order {
    id?: number;
    name: string;
    passwordHash: string;
    createdAt: string;
    currencyMultiplier: number;
    closedAt?: string;
    lists?: lists.OrderList[];
    status: string;
}

export const orderAuth: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const { password } = req.body;
    if (typeof password !== "string") {
        return res.sendStatusJson(400, { message: "Password must be given", property: "password" })
    }

    getOrder(orderId)
        .then(order => {
            if (!order) {
                return res.sendStatusJson(404);
            }

            auth.checkPasswordHash(password, order.passwordHash)
                .then(ok => {
                    if (ok) {
                        const sanitazed = sanitazeOrder(order);
                        auth.signJWT(sanitazed)
                            .then(hash => {
                                res.cookie(`order-${order.id}-jwt`, hash, {
                                    maxAge: auth.COOKIE_MAX_AGE
                                });
                                return res.sendStatusJson(200, { payload: sanitazed });
                            })
                            .catch(err => helpers.handleError(err, res));
                    } else {
                        return res.sendStatusJson(401);
                    }
                })
                .catch(err => helpers.handleError(err, res));
        })
        .catch(err => helpers.handleError(err, res));
}

export const orderData: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);

    getOrder(orderId)
        .then(order => {
            if (!order) {
                return res.sendStatusJson(404);
            }

            const sanitazed = sanitazeOrder(order);
            res.sendStatusJson(200, { payload: sanitazed });
        });
}

export const listOrders: RequestHandler = (req, res: Response) => {
    DB.query(`SELECT id, name, createdAt FROM orders`, [])
        .then((result: Partial<Order>[]) => res.sendStatusJson(200, { payload: result }));
}

export const addOrder: RequestHandler = (req, res: Response) => {

    let { name, currencyMultiplier, password, status } = req.body;

    if (typeof name !== "string") {
        return res.sendStatusJson(400, { message: "Name should be a string", property: "name" });
    }

    if (typeof password !== "string") {
        return res.sendStatusJson(400, { message: "Password should be a string", property: "password" });
    }

    if (typeof status === "undefined") {
        status = "";
    } else if (typeof status !== "string") {
        return res.sendStatusJson(400, { message: "Status should be a string", property: "status" });
    }

    if (typeof currencyMultiplier === "undefined") {
        currencyMultiplier = 1;
    } else if (typeof currencyMultiplier !== "number") {
        return res.sendStatusJson(400, { message: "Currency multiplier should be a number", property: "currencyMultiplier" });
    }

    auth.createPasswordHash(password)
        .then(passwordHash => {
            const createdAt = helpers.dateToJsonDate(new Date());
            const order: Order = {
                name,
                currencyMultiplier,
                createdAt,
                passwordHash,
                status
            }

            DB.query("INSERT INTO orders SET ?", [order])
                .then(() => res.sendStatusJson(201))
                .catch((err) => helpers.handleError(err, res));
        });
}

export const orderUpdate: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    let { name, currencyMultiplier, status } = req.body;

    if (["undefined", "string"].indexOf(typeof name) === -1) {
        return res.sendStatusJson(400, { message: "Name should be a string", property: "name" });
    }

    if (["undefined", "string"].indexOf(typeof status) === -1) {
        return res.sendStatusJson(400, { message: "Status should be a string", property: "status" });
    }

    if (["undefined", "number"].indexOf(typeof currencyMultiplier) === -1) {
        return res.sendStatusJson(400, { message: "Currency multiplier should be a number", property: "currencyMultiplier" });
    }

    const orderUpdate: Partial<Order> = {}

    if (name !== undefined) {
        orderUpdate.name = name;
    }

    if (status !== undefined) {
        orderUpdate.status = status;
    }

    if (currencyMultiplier !== undefined) {
        orderUpdate.currencyMultiplier = currencyMultiplier;
    }

    DB.query("UPDATE orders SET ? WHERE id = ?", [orderUpdate, orderId])
        .then(() => res.sendStatusJson(200))
        .catch(err => helpers.handleError(err, res));
}

const sanitazeOrder = (order: Order): Partial<Order> => {
    const o = { ...order };
    delete o.passwordHash;
    o.createdAt = helpers.dateToJsonDate(order.createdAt as any);
    return o;
}

const getOrder = (orderId: number): Promise<Order> => {
    return DB.query(`SELECT * FROM orders WHERE id = ?`, [orderId])
        .then(result => {
            const order: Order = result[0] || null;
            if (!order) {
                return null;
            }

            return lists.getOrderLists(order.id)
                .then(lists => {
                    order.lists = lists;
                    return order;
                })
                .catch(err => Promise.reject(err));
        })
        .catch(err => Promise.reject(err));
}