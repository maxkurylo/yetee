import {Request, Response} from "express";

const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

export default function (req: Request, res: Response, next: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token === SERVICE_TOKEN) {
        next();
    } else {
        res.status(401).send('Incorrect authorization!');
    }
}