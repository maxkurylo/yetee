import {Request, Response} from "express";
import { getAuthoritiesByUserId, getAuthoritiesByResourceAndUserId} from "../models/authorities";
import {ErrorBody} from "../typings/error";
import {getAllRoles} from "../models/role";
import {IUserAuthorities} from "../typings/authorities";


export default (req: Request, res: Response, next: any) => {
    const userId = (req.user as any)._id;
    const resourceId = (req as any).resourceId || req.body.resourceId || req.query.resourceId;

    if (!resourceId) {
        return res.status(400).send('No resource specified');
    }

    if (!userId) {
        return res.status(400).send('No user specified');
    }

    Promise.all([
        getAllRoles(),
        getAuthoritiesByResourceAndUserId(resourceId, userId),
    ])
        .then(([roles, auths]) => {
            if (!auths.length) {
                return res.status(403).send('No authorities for resource');
            }
            const userAuths: IUserAuthorities[] = auths.map(a => {
                const role = roles.find(r => r.name === a.role);
                return {
                    ...a,
                    permissions: role?.permissions,
                }
            });
            (req as any).authorities = userAuths;
            next();
        })
        .catch((err) => {
            const errorBody: ErrorBody = {
                message: 'Failed to get user permissions',
                details: err
            };
            return res.status(500).json(errorBody);
        })
}
