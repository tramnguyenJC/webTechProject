var express = require('express');
var router = express.Router();
var database = require('../database.js')
var bcrypt = require('bcrypt')


router.post('/', function(req, res){
    if (!req.body.username)
        res.send("Missing username input")
    if (!req.body.password)
        res.send("Missing password input")
    if (!req.body.confirm_pass)
        res.send("Missing confirmed password input")

    // Check if username already taken.
    database.getUser(req.body.username, function(user){
        if(user){
            res.send("Username already taken")
        }
    });

    if (req.body.password != req.body.confirm_pass && req.body.username){
        res.send("Passwords do not match")
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
