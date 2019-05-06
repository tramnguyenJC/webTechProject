// load all the things we need
var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var database = require('./database.js');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("Ser");
        done(null, user.username);
    });
  
    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        console.log("Deser");
        database.getUser(username, function(row) {
          if (!row) return done(null, false);
          return done(null, row);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(new LocalStrategy({passReqToCallback : true}, function(req, username, password, done) {
        database.getUser(username, function(row) {
          if (!row){
            return done(null, false, req.flash('loginMessage','Invalid username or password.'));
          }
          
          bcrypt.compare(password, row.password, function(err, res) {
            if(res) {
              // Sucessfully return user
              return done(null, row);
            } else {
              return done(null, false, req.flash('loginMessage','Invalid username or password.'));
            } 
          });

        });
    }));

};