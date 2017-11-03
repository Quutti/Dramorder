import { RequestHandler } from "express";
import * as DB from "easy-mysql-with-promise";

import { Response } from "../types";
import * as helpers from "../helpers";

export const checkExistanceMiddleware: RequestHandler = (req, res: Response, next) => {

    const orderId = parseInt(req.params.orderId, 10);
    const listId = parseInt(req.params.listId, 10);
    const itemId = parseInt(req.params.itemId, 10);

    let query: Promise<any>;

    if (orderId && !listId) {
        query = DB.query("SELECT id FROM orders WHERE id = ? ", [orderId]);
    } else if (orderId && listId && !itemId) {
        query = DB.query("SELECT id FROM lists WHERE id = ? AND orderId = ? ", [listId, orderId])
    } else if (orderId && listId && itemId) {
        const sql = `
            SELECT i.id, i.listId
            FROM items AS i
            INNER JOIN lists AS l
            ON i.listId = l.id
            WHERE l.orderId = ? AND i.listId = ? AND i.id = ?
        `;
        query = DB.query(sql, [orderId, listId, itemId]);
    } else {
        res.sendStatusJson(404);
    }

    query
        .then(result => {
            if (result.length === 1) {
                next();
            } else {
                return res.sendStatusJson(404);
            }
        })
        .catch(err => helpers.handleError(err, res));
}