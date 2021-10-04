const express = require('express')
const router = express.Router()
const User = require('../models/User')

//create a User using POST "/api/auth/"
router.post('/' , (req , res)=>{
    // console.log(req.body)
    const user = User(req.body)
    user.save();
    // res.send(req.body)
    res.send("Authantication successful")
})

module.exports = router;