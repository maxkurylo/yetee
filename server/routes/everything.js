const express = require("express");
const router = express.Router();
const passport = require("passport");

const config = require('../config/config');

const Company = require('../models/company');
const Group = require('../models/group');
const User = require('../models/user');
const Permission = require('../models/permissions');

/**
 * Here are endpoints related to companies, groups and contacts
*/


/**
 * Companies endpoints
 */
router.get("/get-all-companies", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Company.getAllCompanies((err, groups) => {
        return res.send([{ id: 'test', name: 'Test Company' }]);
        if (err) return res.status(500).json({ error: err }); // database problem
        res.send(groups);
    })
});

router.get("/create-company", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { name } = req.body;
    const newCompany = new Company({
        name,
    });
    Company.addCompany(newCompany,(err, company) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});

router.post("/remove-company", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { id } = req.body;
    Company.removeCompanyById(id,(err, _) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});



/**
 * Groups endpoints
 */

router.get("/get-all-groups", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Group.getAllGroups((err, groups) => {
        if (err) return res.status(500).json({ error: err }); // database problem
        res.send(groups);
    })
});

router.post("/create-group", passport.authenticate('jwt', { session: false }), (req, res, next) => {
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


router.post("/remove-group", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { id } = req.body;
    Group.removeGroupById(id,(err, _) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});


router.put("/alter-group-participants", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { id, participants } = req.body;
    Group.alterParticpants(id, participants, (err, _) => {
        if (err) return res.status(400).json({ error: err });
        res.status(200).send();
    })
});


/**
 * Users endpoints
 */

router.get("/get-all-users", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.getAllUsers((err, users) => {
        if (err) return res.status(500).json({ error: err }); // database problem
        res.send(users);
    })
});

module.exports = router;



