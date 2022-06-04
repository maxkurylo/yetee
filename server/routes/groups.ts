import { Router, Request, Response } from 'express';
import {addGroup, getAllGroups, removeGroupById} from '../models/group';
import jwtMiddleware from '../passports/jwt-middleware'
import {ErrorBody} from "../typings/error";
import {IGroup} from "../typings/group";

const router = Router();

router.get('/get-all-groups', jwtMiddleware, (req: Request, res: Response) => {
    getAllGroups({name: 1, avatar: 1})
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
    const { name, avatar, participants } = req.body;
    if (!participants || participants.length < 1) {
        const body: ErrorBody = { message: 'Missing group participants' };
        return res.status(400).json(body);
    }

    const newGroup: IGroup = {
        name,
        avatar,
    };

    addGroup(newGroup)
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


router.put("/add-group-member", jwtMiddleware, (req: Request, res: Response) => {
    res.status(200).send();
});


router.put("/remove-group-member", jwtMiddleware, (req: Request, res: Response) => {
    res.status(200).send();
});

export default router;