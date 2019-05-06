var express = require('express');
var router = express.Router();
var passport = require('passport')

router.post('/', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/',
    failureFlash: 'Invalid username or password.',
    successFlash: 'Welcome!'
}));

module.exports = router;
