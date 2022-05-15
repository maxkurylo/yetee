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



