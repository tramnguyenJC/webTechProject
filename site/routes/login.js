var express = require('express');
var router = express.Router();
var passport = require('passport')

router.get('/', function(req, res) {
    res.render('index', {errorMessage : req.flash('loginMessage')});
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome!'
}));

module.exports = router;
