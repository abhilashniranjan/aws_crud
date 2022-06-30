var User = require('../models/user')

var mongoose = require('mongoose')



exports.myProfile = (req, res) => {
    User.findOne({ _id: req.userId }, (error, user) => {
        if (error) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
        else {
            res.status(200).json({ user: user, msg: "all ok from myprofile" })
        }
    }).select("-password").select("-blocked").select("-role")
}


exports.editProfile = (req, res) => {
    let emailchange;
    if (req.email == req.body.email) {
        emailchange = "no"
    }
    else {
        emailchange = "yes"
    }
    User.updateOne({ _id: req.userId }, {
        username: req.body.username,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
    
        age: req.body.age,
    }, function (err, user) {
        if (err) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
        else {
            console.log("edited profile");
            res.status(201).json({ msg: "edited profile", emailchange: emailchange });
        }
    })
}

