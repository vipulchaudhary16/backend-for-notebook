const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser")
const JWT_SECRET = process.env.JWT_SECRET;

//1 : create a User using POST "/api/auth/createUser"
router.post(
    "/createUser",
    [
        //Setting validator for not allowing false log in and security
        body("name", "Name must have minimum 2 character").isLength({ min: 2 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password must have minimum 4 character").isLength({
            min: 4,
        }),
    ],
    async (req, res) => {
        let success = true;
        //Storing result after validation
        const errors = validationResult(req);
        //if error array is not empty that means there must be unvalid value
        if (!errors.isEmpty()) {
            success = false;
            return res.status(400).json({ success, errors: errors.array() });
        }

        //Checking weather a user with a email is exists or not
        try {
            //If there is no user with given email then user will be null
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                success = false;
                return res
                    .status(400)
                    .json({ success, error: "A user with this email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);

            //Creating user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePassword,
            });

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success, authToken });

            // res.send("Log in successfully")
        } catch (error) {
            console.log(error);
            res.status(500).json("Some unknown error accured");
        }
    }
);

//2 : Authenticate a User using POST "/api/auth/login"
router.post(
    "/login",
    [
        body("email", " Enter a valid email").isEmail(),
        body("password", " Password cant be blank").exists(),
    ],
    async (req, res) => {
        let success = true;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            success = false;
            return res.status(400).json({ success, errors: error.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res
                    .status(400)
                    .json({ success, error: "Please enter a valid login credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res
                    .status(400)
                    .json({ success, error: "Please enter a valid login credentials" });
            }

            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success, authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
);

//3: Get logged in user details
router.post(
    "/getUser",
    fetchUser,
    async (req, res) => {
        try {
            let userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
);

module.exports = router;
