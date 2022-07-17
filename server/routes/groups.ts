import { Router, Request, Response } from 'express';
import {addGroup, getAllGroups, removeGroupById} from '../models/group';
import {addUserAuthorities} from '../models/authorities';
import jwtMiddleware from '../middlewares/jwt-middleware';
import permissionsMiddleware from '../middlewares/permissions-middleware';
import {ErrorBody} from "../typings/error";
import {IGroup} from "../typings/group";
import {IResourceAuthorities} from "../typings/authorities";

const router = Router();

const GROUP_MEMBER_ROLE = 'GROUP_MEMBER_ROLE';

router.get('/get-all-groups', jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    getAllGroups({name: 1, avatarUrl: 1})
        .then(groups => {
            if (!groups) {
                const body: ErrorBody = { message: 'Groups not found' };
                return res.status(404).json(body);
            }
            const jsons = groups.map(gr => gr.toJSON());
            res.status(200).json(jsons);
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to get groups',
                details: err
            };
            return res.status(500).json(body);
        });
});


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
                .then(() => res.status(200).json(group))
                .catch(err => {
                    const body: ErrorBody = {
                        message: 'Failed to add authorities to group',
                        details: err
                    };
                    return res.status(500).json(body);
                })
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to create group',
                details: err
            };
            return res.status(500).json(body);
        });
});


router.post('/remove-group', jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    const { id } = req.body;
    removeGroupById(id)
        .then(() => {
            res.status(200).send();
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to remove group',
                details: err
            };
            return res.status(500).json(body);
        });
});


router.put("/add-group-member", jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    res.status(200).send();
});


router.put("/remove-group-member", jwtMiddleware, permissionsMiddleware, (req: Request, res: Response) => {
    res.status(200).send();
});

export default router;