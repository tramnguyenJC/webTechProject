require('dotenv').config()
var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index#contact');
});

router.post('/', function(req, res, next) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    service: process.env.NODEMAILER_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      // Look at this thread to generate an app password to be used
      // for nodemailer. The password and username environment variables are 
      // save in the .env file (excluded from Git repo via .gitignore).
      // https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer
      pass: process.env.NODEMAILER_PASS
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: process.env.NODEMAILER_USER,
    subject: 'ENQUIRY: ' + req.body.subject,
    text: `${req.body.name} (${req.body.email}) sends an enquiry: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      req.flash('sendMailError', error);
      res.render('index', {errorMessage: req.flash('sendMailError')});
    }
    else {
      res.redirect('/index#contact');
    }
  });
});

module.exports = router;
