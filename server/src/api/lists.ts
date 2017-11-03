import { RequestHandler } from "express";
import * as DB from "easy-mysql-with-promise";
import * as helpers from "../helpers";
import { Response } from "../types";
import * as items from "./items";

export interface OrderList {
    id?: number;
    orderId?: number;
    name: string;
    added: string;
    items?: items.OrderItem[];
}

export const addList: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const { name } = req.body;

    if (typeof name !== "string") {
        return res.sendStatusJson(400, { message: "Name should be a string", property: "name" });
    }

    const list: Partial<OrderList> = {
        orderId,
        name,
        added: helpers.dateToJsonDate(new Date())
    }

    DB.query("INSERT INTO lists SET ?", [list])
        .then(() => res.sendStatusJson(201))
        .catch((err) => helpers.handleError(err, res));
}

export const listLists: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    getOrderLists(orderId)
        .then((lists => res.sendStatusJson(200, { payload: lists })))
        .catch(err => helpers.handleError(err, res));
}

export const listData: RequestHandler = (req, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const listId = parseInt(req.params.listId, 10);

    // Really wrong way to get data of single list but like they say,
    // premature optimization is the root of all evil
    getOrderLists(orderId)
        .then((lists => {
            let list = null;
            for (let l of lists) {
                if (l.id === listId) {
                    list = l;
                    break;
                }
            }

            if (list) {
                res.sendStatusJson(200, { payload: list })
            } else {
                res.sendStatusJson(404);
            }
        }))
        .catch(err => helpers.handleError(err, res));
}

export const getOrderLists = (orderId: number): Promise<OrderList[]> => {
    const listsSql = `SELECT * FROM lists WHERE orderId = ?`;

    return DB.query(listsSql, [orderId])
        .then((res: OrderList[]) => {
            const lists = res.map((list: OrderList) => sanitazeOrderList(list));
            return items.populateListsWithItems(lists)
        });
}

const sanitazeOrderList = (list: OrderList): OrderList => {
    const l = { ...list };
    delete l.orderId;
    l.items = [];
    l.added = helpers.dateToJsonDate(list.added as any);
    return l;
}