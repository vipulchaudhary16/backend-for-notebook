const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

//create a User using POST "/api/auth/"
router.post('/', [
    //Setting validator for not allowing false log in and security
    body('name', 'Name must have minimum 2 character').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must have minimum 5 character').isLength({ min: 5 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(user => res.json(user))
        .catch(e => {
            console.log(e)
            res.json({ error: 'User already exists with this email' })
        })
})

// res.send("Authantication successful")
module.exports = router;