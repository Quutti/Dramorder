import * as lists from "./lists";
import { RequestHandler } from "express";
import * as DB from "easy-mysql-with-promise";
import * as helpers from "../helpers";
import { Response } from "../types";

export interface OrderItem {
    id?: number;
    listId?: number;
    name: string;
    price: number;
    quantity: number;
    href: string;
    added: string;
}

export const itemData: RequestHandler = (req, res: Response) => {
    const itemId = parseInt(req.params.itemId, 10);
    DB.query("SELECT * FROM items WHERE id = ?", [itemId])
        .then(items => {
            const item = items[0];
            item
                ? res.sendStatusJson(200, { payload: sanitazeOrderItem(item) })
                : res.sendStatusJson(404);
        })
        .catch(err => helpers.handleError(err, res));
}

export const addItem: RequestHandler = (req, res: Response) => {
    const listId = parseInt(req.params.listId, 10);

    let { name, price, quantity, href } = req.body;

    if (typeof name !== "string") {
        return res.sendStatusJson(400, { message: "Name should be a string", property: "name" });
    }

    if (typeof href !== "string") {
        return res.sendStatusJson(400, { message: "Href should be a string", property: "href" });
    }

    if (typeof price !== "number") {
        return res.sendStatusJson(400, { message: "Price should be a number", property: "price" });
    }

    if (typeof quantity === "undefined") {
        quantity = 1;
    } else if (typeof quantity !== "number") {
        return res.sendStatusJson(400, { message: "Quantity should be a number", property: "quantity" });
    }

    const item: Partial<OrderItem> = {
        listId,
        name,
        href,
        price,
        quantity,
        added: helpers.dateToJsonDate(new Date())
    }

    DB.query("INSERT INTO items SET ?", [item])
        .then(() => res.sendStatusJson(201))
        .catch(err => helpers.handleError(err, res));
}

export const deleteItem: RequestHandler = (req, res: Response) => {
    const itemId = parseInt(req.params.itemId, 10);
    DB.query("DELETE FROM items WHERE id = ?", [itemId])
        .then(() => res.sendStatusJson(200))
        .catch(err => helpers.handleError(err, res));
}

export const populateListsWithItems = (lists: lists.OrderList[]) => {
    const listIds = helpers.safeIntergerArray(lists.map(l => l.id));
    return DB.query(`SELECT * FROM items WHERE listId IN (${listIds.join(", ")})`, [])
        .then((items: OrderItem[]) => {
            items.forEach(item => {
                const index = listIds.indexOf(item.listId);
                if (index > -1) {
                    const list = lists[index];

                    // Be safe
                    if (!list.items) {
                        list.items = [];
                    }

                    list.items.push(sanitazeOrderItem(item));
                }
            });

            return lists;
        });
}

const getItemsOfList = (listId: number): Promise<OrderItem[]> => {
    return DB.query(`SELECT * FROM items WHERE listId = ?`, [listId])
        .then(res => res.map((item) => sanitazeOrderItem(item)))
}

const sanitazeOrderItem = (item: OrderItem): OrderItem => {
    const i = { ...item };
    delete i.listId;
    i.added = helpers.dateToJsonDate(item.added as any);
    return i;
}