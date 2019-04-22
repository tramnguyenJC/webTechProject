// load all the things we need
var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('sqlite3');
var database = require('./database.js');


// Used to restrict acess to the admin page.
// console.log("hej3")
// router.get('/', function(req, res, next) {
//   console.log("in her");
//   if (req.isAuthenticated()) {
//       next();
//   } else {
//       res.redirect('/admin');
//   }
// });


// module.exports = router
// module.exports = function(req, res, next) {
//   console.log("in her");
//   if (req.isAuthenticated()) {
//       next();
//   } else {
//       res.redirect('/login');
//   }
// };


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
		done(null, user.id);
    });
  
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("Deser");
        database.db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
          if (!row) return done(null, false);
          return done(null, row);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(new LocalStrategy(function(username, password, done) {
        

        database.db.get('SELECT * FROM Users WHERE username = ?', username, function(err, row) {
          console.log(row);
            if (err){
              console.log("query failed");
              return done(err);
            }
          
            // No user found
            if (!row){
              console.log("1");
              return done(null, false, "Invalid username or password");
            }
          
            // User is found but the password is wrong
            if (!(row.password == password))
              return done(null, false, "Invalid username or password");
          
            // Sucessfully return user
            return done(null, row);
        });
    }));

};