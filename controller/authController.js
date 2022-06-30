var User = require('../models/user')
var Otp = require('../models/otp')
const jwt = require('jsonwebtoken')
var sendEmail = require('../mail/mail')
var bcrypt = require('bcrypt')
//sendEmail
exports.getCheck = (req, res, next) => {
    res.json({ msg: "All ok" })
}


exports.register = async (req, res) => {
    var user = new User({
        username: req.body.username,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
    
        age: req.body.age,
        password: User.hashPassword(req.body.p1),
    });
    User.find({ email: req.body.email }, (err, users) => {

        if (err) {
            console.log("error in finding email ");
            res.json({ msg: "some error!" });
        }
        if (users.length != 0) {
            console.log("already user with this email");
            res.json({ msg: "already user exist with this email!" });
        }
        else {
            user.save((error, registeredUser) => {
                if (error) {
                    console.log("some error");
                    res.json({ msg: "some error!" });
                }
                else {
                    console.log("successfully user registered!");
                    res.status(200).json({ message: "successfully user registered!" })
                }
            })
        }
    })
}


exports.logIn = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log(err)
            res.json({ msg: "Somthing went wrong" });
        }
        else {
            if (!user) {
                res.json({ msg: 'Invalid Email!!' })
            }
            else {
                bcrypt.compare(req.body.p, user.password).then(match => {
                    if (match) {
                        console.log("login sucesssss");
                        let payload = { subject: user._id, email: user.email }
                        let token = jwt.sign(payload, process.env.SECRETKEY, {
                            expiresIn: "24h"
                        })
                        res.status(200).json({ token: token, role: user.role, blocked: user.blocked })
                    }
                    else {
                        console.log("incoreect passss");
                        res.json({ msg: 'Incorrect password!!' })
                    }
                }).catch(err => {
                    console.log("somthing wrong");
                    res.json({ msg: 'Somthing went wrong' })
                })
            }
        }
    })
}
function getEmail(email) {
    Otp.find({ email: email }, (err, otps) => {

        if (err) {
            console.log("err in finding email ");
        }
        if (otps.length != 0) {
            console.log("yes in delete");
            Otp.deleteOne({ email: email }, (err) => {
                if (err)
                    console.log("err in delete");
            }
            )
        }
    })
}

exports.Reset = (req, res) => {
    User.find({ email: req.body.email }, async (err, users) => {

        if (err) {
            console.log("err in finding email ");
            res.json({ msg: "some error!" });
        }
        if (users.length == 0) {
            console.log("user does not exist with this email at forgot password!!");
            res.json({ msg: "user does not exist with this email" });
        }
        else {
            Otp.findOne({ email: req.body.email }, async (err, otp) => {
                if (err) {
                    console.log("err in finding email ");
                    res.json({ msg: "some error!" });
                }
                if (otp) {
                    console.log(otp.otp);
                    sendEmail(req.body.email, otp.otp);
                    setTimeout(async function () {
                        console.log("timeout (2min)");
                        var y = await getEmail(req.body.email)
                    }, 2 * 60000);
                    res.status(201).json({ message: "all ok otp has been send" });
                }
                else {
                    var email = req.body.email
                    var x = await getEmail(req.body.email)
                    setTimeout(async function () {
                        console.log("timeout (2min)");
                        var y = await getEmail(email)
                    }, 2 * 60000);
                    var a = Math.floor(1000 + Math.random() * 9000);
                    var otp = new Otp({
                        otp: a,
                        email: req.body.email
                    });
                    // console.log("otp =", otp);
                    try {
                        doc = otp.save();
                        sendEmail(otp.email, otp.otp);
                        res.status(201).json({ message: "all ok otp has been send" });
                    }
                    catch (err) {
                        res.json({ msg: "some error!" });
                    }
                }
            })

        }
    })
}


exports.resestPasswordDone = (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err)
            res.json({ msg: "Somthing went wrong" });
        }
        else {
            if (!user) {
                res.json({ msg: 'User does not exist with this email!!' })
            }
            else {
                Otp.findOne({ email: req.body.email }, async (err, otps) => {

                    if (err) {
                        res.json({ msg: "Somthing went wrong" });
                    }
                    if (!otps) {
                        res.json({ msg: "Otp has been expired!" });
                    }
                    else {
                        var otp = otps.otp;
                        if (otp != req.body.otp) {
                            res.json({ msg: "Invalid Otp!!!" });
                        }
                        else {
                            var p = User.hashPassword(req.body.p1)
                            var x = await getEmail(req.body.email)
                            User.updateOne({ email: req.body.email },
                                { password: p }, function (err, user) {
                                    console.log(1);
                                    if (err) {
                                        console.log(err)
                                        res.json({ msg: "Somthing went wrong" });
                                    }
                                    else {
                                        res.json({ message: "password updated!!" });
                                    }
                                });
                        }
                    }
                })


            }
        }
    })
}


exports.changePassword = (req, res) => {
    User.findOne({ email: req.email }, (err, user) => {
        if (err) {
            res.json({ msg: "Somthing went wrong" });
        }
        else {
            if (!user) {
                res.json({ msg: "Somthing went wrong" });
            }
            else {
                bcrypt.compare(req.body.op, user.password).then(match => {
                    if (match) {
                        console.log("correct old password");
                        // console.log(req.body.p1);
                        var p = User.hashPassword(req.body.p1)
                        User.updateOne({ email: req.email },
                            { password: p }, function (err, user) {
                                if (err) {
                                    res.json({ msg: "Somthing went wrong" });
                                }
                                else {
                                    console.log("password changed!");
                                    res.status(200).json({ msg: "changed password" })
                                }
                            })
                    }
                    else {
                        console.log("incoreect passss");
                        res.json({ msg: 'Incorrect old password!!' })
                    }
                }).catch(err => {
                    res.json({ msg: 'Somthing went wrong' })
                })
            }
        }
    })
}





  ////////////////// STEP 1 link send email   
  
  exports.sendForgotMail = async (req, res) => {
    const { email } = req.body;
    try {
      // mail sending through nodemailer
      const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false,
        port: 587,
        tls: {
          ciphers: "SSLv3",
        },
        auth: {
          user: process.env.THE_EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const options = {
        from: process.env.THE_EMAIL,
        to: email,
        subject: "ABHILASH DEVELOPER",
        text: "MEAN STACK PROJECT RESET PASSWORD LINK SENDING EMAIL",
        html: `To reset your password <a href='${process.env.REDIRECT_DOMINIE}/forgotPassword'>Click Here</a><br/>Thankyou!`,
      };
  
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sent: " + info.response);
      });
  
      // Mail sent ends
      res.status(201).json({ email });
    } catch (error) {
      console.log(error);
      res.status(400).send("Can't Send Mail");
    }
  };
  






/////////////////step 2 redirecpage data send
exports.updatePassword = async (req, res) => {
    const email = req.params.email;
  
    try {
      const existingUser = await Users.findOne({ email });
      // console.log(req.body);
      if (!existingUser) {
        return res
          .status(400)
          .json(`User Does Not Exist With this email: ${email}`);
      }
  
      const updatePassword = req.body;
      const salt = await bcrypt.genSalt(12);
      const encryptPassword = {
        password: await bcrypt.hash(updatePassword.password, salt),
      };
      // console.log(encryptPassword);
  
      await Users.findOneAndUpdate({ email: email }, encryptPassword, {
        new: true,
      });
      res.json(encryptPassword);
    } catch (error) {
      console.log(error);
      res.status(400).send("Some thing went wrong in updating password");
    }
  };
  







//>>>>>>>>>>WELL COME MAIL   ////

/*

  app.post("/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
      console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
      res.send(info);
    });
  });
  
  async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: details.email,
        pass: details.password
      }
    });
  
    let mailOptions = {
      from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
      to: user.email, // list of receivers
      subject: "Wellcome to Fun Of Heuristic 👻", // Subject line
      html: `<h1>Hi ${user.name}</h1><br>
      <h4>Thanks for joining us</h4>`
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
  
    callback(info);
  }


  */