import { Router, Request, Response } from 'express';
import jwtMiddleware from '../passports/jwt-middleware'
import {ErrorBody} from "../typings/error";
import { getAllUsers } from "../models/user";

const router = Router();

router.get('/get-all-users', jwtMiddleware, (req: Request, res: Response) => {
    const projection = {
        email: 1,
        name: 1,
        avatar: 1,
    };
    getAllUsers(projection)
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to get users',
                details: err
            };
            return res.status(500).json(body);
        });
});

export default router;