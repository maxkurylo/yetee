import { Router, Request, Response } from 'express';
import Group from '../models/group';
import jwtMiddleware from '../passports/jwt-middleware'

const router = Router();

router.get("/get-all-groups", jwtMiddleware, (req: Request, res: Response) => {
    Group.getAllGroups((err, groups) => {
        if (err) return res.status(500).json({ error: err }); // database problem
        res.send(groups);
    })
});

router.post("/create-group", jwtMiddleware, (req: Request, res: Response) => {
    const { name, avatarUrl, participants, companyId } = req.body;
    if (!participants || participants.length < 1) {
        return res.status(400).send();
    }

    const newGroup = new Group({
        name,
        avatarUrl,
        companyId
    });
    Group.addGroup(newGroup,(err, group) => {
        if (err) return res.status(500).json({ error: err });
        const newPermissions = participants.map(p => {
            return new Permission({
                userId: p,
                resourceId: group._id,
                permissions: p === req.user.id ? config.groupModeratorPermissions : config.groupMemberPermissions,
            });
        });

        Permission.addPermission(newPermission, (err, permission) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).send();
        });

    })
});


router.post("/remove-group", jwtMiddleware, (req: Request, res: Response) => {
    const { id } = req.body;
    Group.removeGroupById(id,(err, _) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});


router.put("/alter-group-participants", jwtMiddleware, (req: Request, res: Response) => {
    const { id, participants } = req.body;
    Group.alterParticpants(id, participants, (err, _) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});

export default router;