const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

//create a User using POST "/api/auth/createUser"
router.post('/createUser', [
    //Setting validator for not allowing false log in and security
    body('name', 'Name must have minimum 2 character').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must have minimum 4 character').isLength({ min: 4 }),
], async (req, res) => {
    //Storing result after validation
    const errors = validationResult(req);
    //if error array is not empty that means there must be unvalid value
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Checking weather a user with a email is exists or not
    try {
        //If there is no user with given email then user will be null
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists" })
        }
        //Creating user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.send("Log in successfully")
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some unknown error accured")
    }
})
module.exports = router;