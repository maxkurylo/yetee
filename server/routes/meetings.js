const express = require("express");
const router = express.Router();
const Group = require('../models/group');
const passport = require("passport");


router.get("/get-my-meetings", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Group.getAllGroups((err, groups) => {
        if (err) return res.status(500).json({ error: err }); // database problem
        res.send(groups);
    });
});

router.post("/schedule", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { name, avatarUrl, participants } = req.body;
    const newGroup = new Group({
        name,
        avatarUrl,
        participants: participants || []
    });
    Group.addGroup(newGroup,(err, companies) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});



module.exports = router;
