import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import { sendStatusJsonMiddleware } from "send-status-json";

import * as helpers from "./helpers";
import { registerApi } from "./api/register-api";
import { Response } from "./types";

export class WebServer {

    private _app: express.Express;
    private _port: number;

    constructor(app: express.Express, port: number) {
        this._app = app;
        this._port = port;
    }

    public start() {
        this._init();
        this._app.listen(this._port, () => {
            console.log(`WebServer is listening port ${this._port}`);
        });
    }

    private _init() {

        const INDEX = (process.env.DEVELOPMENT_MODE)
            ? path.join(__dirname, '..', '..', 'client', 'dist', 'index.html')
            : path.join(__dirname, '..', 'public', 'index.html');

        const ASSETS = (process.env.DEVELOPMENT_MODE)
            ? path.join(__dirname, '..', '..', 'client', 'dist', 'assets')
            : path.join(__dirname, '..', 'public');

        // Register middlewares
        this._app.use(sendStatusJsonMiddleware());
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(cookieParser());

        this._app.use((req, res, next) => {
            if (req.originalUrl.indexOf('/api/') !== -1) {
                next();
                return;
            }

            res.sendFile(INDEX);
        });

        this._app.use("/assets", express.static(ASSETS));

        registerApi(this._app);

        // Handler 404 not found
        this._app.use((req, res: Response) => {
            console.log(`[404] ${req.method} ${req.path}`);
            return res.sendStatusJson(404);
        });

        // Handle 500 errors
        this._app.use((err, req, res, next) => {
            helpers.handleError(err, res);
        });
    }

}