import {Request, Response} from "express";
import { getAuthoritiesByUserId, getAuthoritiesByResourceAndUserId} from "../models/authorities";
import {ErrorBody} from "../typings/error";
import {getAllRoles} from "../models/role";
import {IResourceAuthoritiesDocument, IUserAuthorities} from "../typings/authorities";
import {IRoleDocument} from "../typings/role";


/**
 * Get authorities from database.
 *
 * If resourceId is specified as a query parameter or in body it will fetch authorities for
 * resourceId and userId.
 *
 * userId: string - obligatory
 * resourceId: string - optional
 *
 * Adds to express Request parameter authorities: IUserAuthorities[]
 *
 * If userId is not specified respond 400
 */
export default (req: Request, res: Response, next: any) => {
    const userId = (req.user as any).id;
    const resourceId = (req as any).resourceId || req.body.resourceId || req.query.resourceId;

    if (!userId) {
        return res.status(400).send('No user specified');
    }

    const promises: Promise<any>[] = [ getAllRoles() ];
    if (resourceId) {
        promises.push(getAuthoritiesByResourceAndUserId(resourceId, userId));
    } else {
        promises.push(getAuthoritiesByUserId(userId));
    }

    Promise.all(promises)
        .then(([roles, auths]) => {
            const userAuths: IUserAuthorities[] = auths.map((a: IResourceAuthoritiesDocument) => {
                const role = roles.find((r: IRoleDocument) => r.name === a.role);
                return {
                    ...a.toJSON(),
                    permissions: role?.permissions || [],
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
