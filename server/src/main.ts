import * as express from 'express';
import * as dotenv from 'dotenv';
import * as mysql from 'easy-mysql-with-promise';

import { WebServer } from './server';

dotenv.config();

mysql.init({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    connectionLimit: parseInt(process.env.MYSQL_CONN_LIMIT, 10) || 50
});

const port = parseInt(process.env.SERVER_PORT, 10) || 8080;
const app = express();
const server = new WebServer(app, port);

server.start();