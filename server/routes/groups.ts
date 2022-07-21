import { Router, Request, Response } from 'express';
import {addGroup, getGroupsByIds, removeGroupById} from '../models/group';
import {
    addUserAuthorities,
    getAuthoritiesByResourceIds,
    removeAllAuthoritiesForResource,
    removeResourceAuthoritiesForUser
} from '../models/authorities';
import jwtMiddleware from '../middlewares/jwt-middleware';
import permissionsMiddleware from '../middlewares/permissions-middleware';
import {ErrorBody} from "../typings/error";
import {IGroup} from "../typings/group";
import {IResourceAuthorities, IUserAuthorities} from "../typings/authorities";
import config from "../config";
import hasPermission from '../helpers/has-permission';

const router = Router();

const GROUP_MEMBER_ROLE = config.groupMemberRole;


/**
 * Get all groups according to user authorities
 * @returns:
 *      groups: IGroup[]
 */
router.get('/my-groups', jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    const userAuths: IUserAuthorities[] = (req as any).authorities;
    const groupIds = new Set<string>();
    userAuths.forEach(a => a.resourceId && groupIds.add(a.resourceId));

    // we get all user groups and all authorities for that groups
    // It is necessary to give client groups together with their participants
    Promise.all([
        getGroupsByIds(groupIds,{ name: 1, avatarUrl: 1 }),
        getAuthoritiesByResourceIds(groupIds)
    ])
        .then(([groups, auths]) => {
            const participantsMap: any = {}
            auths.forEach(a => {
                if (a.resourceId) {
                    if (!participantsMap[a.resourceId]) {
                        participantsMap[a.resourceId] = new Set<string>();
                    }
                    participantsMap.add(a.userId);
                }
            });
            const jsonGroups: IGroup[] = groups.map(g => {
                const jg: IGroup = g.toJSON();
                jg.participants = participantsMap[g.id] || [];
                return jg;
            });
            res.status(200).json(jsonGroups);
        })
        .catch(err => {
            const errorBody: ErrorBody = {
                message: 'Failed to get groups',
                details: err
            };
            res.status(500).json(errorBody);
        });
});


/**
 * Create new group
 * @params:
 *     name: string
 *     avatarUrl: string
 *     participants: string[] - ids of users
 * @returns
 *     group: IGroup
 */
router.post('/create-group', jwtMiddleware, (req: Request, res: Response) => {
    const { name, avatarUrl, participants } = req.body;
    if (!participants || participants.length < 1) {
        const body: ErrorBody = { message: 'Missing group participants' };
        return res.status(400).json(body);
    }

    const newGroup: IGroup = {
        name,
        avatarUrl,
    };

    addGroup(newGroup)
        .then(group => {
            const newAuths: IResourceAuthorities[] = participants.map((uId: string) => {
                return {
                    resourceId: group.id,
                    userId: uId,
                    role: GROUP_MEMBER_ROLE,
                }
            })
            addUserAuthorities(newAuths)
                .then(() => {
                    const jsonGroup: IGroup = group.toJSON();
                    jsonGroup.participants = participants;
                    res.status(200).json(jsonGroup)
                })
                .catch(err => {
                    const errorBody: ErrorBody = {
                        message: 'Failed to add authorities to group',
                        details: err
                    };
                    res.status(500).json(errorBody);
                });
        })
        .catch(err => {
            const errorBody: ErrorBody = {
                message: 'Failed to create group',
                details: err
            };
            res.status(500).json(errorBody);
        });
});


/**
 * Remove group and all authorities related to it
 * @params
 *     resourceId: string
 * @returns void
 */
router.delete('/remove-group', jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    const { resourceId } = req.body;
    Promise.all([
        removeGroupById(resourceId),
        removeAllAuthoritiesForResource(resourceId)
    ])
        .then(() => res.status(200).send())
        .catch(err => {
            const errorBody: ErrorBody = {
                message: 'Failed to remove group',
                details: err
            };
            res.status(500).json(errorBody);
        });
});


/**
 * @params:
 *     resourceId: string
 *     userId: string
 *     role: string
 * @returns void
 */
router.post("/add-group-member", jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    const { resourceId, userId, role } = req.body;
    const userAuthorities = (req as any).authorities;

    if (!resourceId || !userId || !role) {
        const errorBody: ErrorBody = { message: 'resourceId, userId or role is missing' };
        return res.status(400).send(errorBody);
    }

    if (!hasPermission(userAuthorities, resourceId, 'EDIT_MEMBERS')) {
        const errorBody: ErrorBody = { message: 'No permissions to delete user from group' };
        return res.status(403).send(errorBody);
    }

    const auths: IResourceAuthorities[] = [
        {
            resourceId,
            userId,
            role,
        }
    ]
    addUserAuthorities(auths)
        .then(() => res.status(200).send())
        .catch(err => {
            const errorBody: ErrorBody = {
                message: 'Failed to add user to group',
                details: err
            };
            res.status(500).json(errorBody);
        });
});


/**
 * @params:
 *     resourceId: string
 *     userId: string
 * @returns void
 */
router.delete("/remove-group-member", jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    const { resourceId, userId } = req.body;
    const auths = (req as any).authorities;

    if (!resourceId || !userId) {
        const errorBody: ErrorBody = { message: 'resourceId or userId is missing' };
        return res.status(400).send(errorBody);
    }

    if (!hasPermission(auths, resourceId, 'EDIT_MEMBERS')) {
        const errorBody: ErrorBody = { message: 'No permissions to delete user from group' };
        return res.status(403).send(errorBody);
    }

    removeResourceAuthoritiesForUser(resourceId, userId)
        .then(() => res.status(200).send())
        .catch(err => {
            const errorBody: ErrorBody = {
                message: 'Failed to remove user from group',
                details: err
            };
            res.status(500).json(errorBody);
        });
});

export default router;