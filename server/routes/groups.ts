import { Router, Request, Response } from 'express';
import Group from '../models/group';
import jwtMiddleware from '../passports/jwt-middleware'
import {ErrorBody} from "../typings/error";

const router = Router();

router.get('/get-all-groups', jwtMiddleware, (req: Request, res: Response) => {
    Group.getAllGroups()
        .then(groups => {
            if (!groups) {
                const body: ErrorBody = { message: 'Groups not found' };
                return res.status(404).json(body);
            }
            res.status(200).json(groups);
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
    const { name, avatarUrl, participants, companyId } = req.body;
    if (!participants || participants.length < 1) {
        const body: ErrorBody = { message: 'Missing group participants' };
        return res.status(400).json(body);
    }

    const newGroup = new Group({
        name,
        avatarUrl,
        companyId
    });

    Group.addGroup(newGroup)
        .then(group => {
            res.status(200).json(group);
        })
        .catch(err => {
            const body: ErrorBody = {
                message: 'Failed to create group',
                details: err
            };
            return res.status(500).json(body);
        });
});


router.post('/remove-group', jwtMiddleware, (req: Request, res: Response) => {
    const { id } = req.body;
    Group.removeGroupById(id)
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


router.put("/add-group-member", jwtMiddleware, (req: Request, res: Response) => {
    res.status(200).send();
});


router.put("/remove-group-member", jwtMiddleware, (req: Request, res: Response) => {
    res.status(200).send();
});

export default router;