import { RequestHandler } from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import { Response } from "./types";

export const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7 * 4;

export const authMiddleware: RequestHandler = (req, res: Response, next) => {
    const { cookies } = req;
    const orderId = parseInt(req.params.orderId, 10) || null;

    if (orderId) {
        const expectedCookieName = `order-${orderId}-jwt`;
        if (expectedCookieName in cookies) {
            return verifyJWT(cookies[expectedCookieName])
                .then(data => next())
                .catch(err => res.sendStatusJson(401));
        }
    }

    res.sendStatusJson(401);
}

export const createPasswordHash = (pass: string) => {
    const key = process.env.PASSWORD_SYSTEM_KEY;
    const hmac = crypto.createHmac("sha512", key);
    hmac.update(pass);

    // Return as promise, so it is async ready for the future
    return Promise.resolve(hmac.digest("hex"));
}

export const checkPasswordHash = (pass: string, passwordHash: string) => {
    return createPasswordHash(pass)
        .then(hash => hash === passwordHash);
}

export const signJWT = (payload: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log(payload);
        jwt.sign(payload, process.env.PASSWORD_SYSTEM_KEY, { expiresIn: COOKIE_MAX_AGE / 1000 }, (err, hash: string) => {
            if (err) {
                return reject(err);
            }

            return resolve(hash);
        });
    });
}

export const verifyJWT = (hash: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        jwt.verify(hash, process.env.PASSWORD_SYSTEM_KEY, (err, obj) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
}
