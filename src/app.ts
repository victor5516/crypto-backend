import express from "express";
import routes from "./routes/routes";

import cors from 'cors';
const app = express();

app.use(express.json());
app.use(function (req:any, res:any, next:any) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});
app.use(cors());
app.use("/api/v1", routes);

export default app;