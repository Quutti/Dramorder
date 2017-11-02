import { RequestHandler } from "express";
import * as DB from "easy-mysql-with-promise";
import * as auth from "../auth";
import * as helpers from "../helpers";

import { Response } from "../types";



export interface Order {
    id?: number;
    name: string;
    passwordHash: string;
    createdAt: string;
    currencyMultiplier: number;
    closedAt?: string;
    lists?: OrderList[];
    status: string;
}

export interface OrderList {
    id?: number;
    orderId?: number;
    name: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id?: number;
    listId?: number;
    name: string;
    price: number;
    href: string;
}

export const orderAuth: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10) || null;
    if (!orderId) {
        return res.sendStatusJson(404);
    }

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
    const orderId = parseInt(req.params.orderId, 10) || null;
    if (!orderId) {
        return res.sendStatusJson(404);
    }

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
                return order;
            }

            return getOrderLists(order.id)
                .then(lists => {
                    order.lists = lists;
                    return order;
                })
                .catch(err => Promise.reject(err));
        })
        .catch(err => Promise.reject(err));
}

const getOrderLists = (orderId: number): Promise<OrderList[]> => {
    const listsSql = `SELECT * FROM lists WHERE orderId = ?`;
    const itemsSql = `
        SELECT *
        FROM items
        WHERE listId IN (
            SELECT id
            FROM lists
            WHERE orderId = ?
        )
    `;

    return Promise.all([DB.query(listsSql, [orderId]), DB.query(itemsSql, [orderId])])
        .then(res => {
            const lists: OrderList[] = res[0];
            const items: OrderItem[] = res[1];
            const listIdMap: number[] = [];

            lists.forEach((list) => {
                delete list.orderId;
                list.items = [];
                listIdMap.push(list.id);
            });

            items.forEach((item) => {
                const index = listIdMap.indexOf(item.listId);
                if (index > -1) {
                    lists[index].items.push(item);
                    delete item.listId;
                }
            });

            return lists;
        });

}