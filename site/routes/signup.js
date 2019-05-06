var express = require('express');
var router = express.Router();
var database = require('../database.js')
var bcrypt = require('bcrypt')

router.post('/', function(req, res){
    // Check if username already taken.
    database.getUser(req.body.username, function(user){
        if(user){
            req.flash('usernameTaken','Username already taken.');
            res.render('index', {errorMessage: req.flash('usernameTaken')});
        }
    });

    if (req.body.password != req.body.confirm_pass && req.body.username){
        req.flash('passwordNotMatch','Password do not match.');
        res.render('index', {errorMessage: req.flash('passwordNotMatch')});
    }else{
        // defaults to no admin access

        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if(err){
                res.send("An error occured with password hashing");
            }else{
                database.createUser(req.body.username, hash, false);
                res.redirect("/index"); //trigger success modal?
            }
          });
    }
});


module.exports = router;
