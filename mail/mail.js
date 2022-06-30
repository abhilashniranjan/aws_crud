require('dotenv').config()
var nodemailer = require('nodemailer');
function sendEmail(to,otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abhilashmn9741@gmail.com',
            pass: 'ajuvjhwuijooubkn'
        }
    });
   
    var str = "your otp = ";
    var a =otp;
    str+=a;
    str += "\notp valid till 2min"
    var mailOptions = {
        from: 'abhilashmn9741@gmail.com',
        to: to,
        subject: 'Reset Password FoodZone!!',
        text: str,
        html:require('./otpEmailView')({otp:otp})
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


module.exports = sendEmail