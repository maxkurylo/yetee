import { Router, Request, Response } from 'express';
import jwtMiddleware from '../passports/jwt-middleware'
import {ErrorBody} from "../typings/error";
import { getAllRoles } from "../models/role";
import { getAuthoritiesByUserId } from "../models/authorities";
import {IUserAuthorities} from "../typings/authorities";

const router = Router();

router.get('/my-authorities', jwtMiddleware, (req: Request, res: Response) => {
    const userId = (req.user as any)._id;
    Promise.all([
        getAllRoles(),
        getAuthoritiesByUserId(userId)
    ])
        .then(([roles, authorities]) => {
            const userAuths: IUserAuthorities[] = authorities.map(a => {
                const role = roles.find(r => r.name === a.role);
                return {
                    ...a,
                    permissions: role?.permissions
                }
            });
            res.send(userAuths);
        })
        .catch(err => {
            const errorBody: ErrorBody = {
                message: 'Failed to get user permissions',
                details: err
            };
            res.status(500).json(errorBody);
        })
});

export default router;