"use strict";
require('dotenv').config()
var bcrypt = require('bcrypt')
var bodyParser = require('body-parser');    
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var database = require('./database.js')
var express = require('express');
var flash = require('connect-flash');
var http = require('http');
var logger = require('morgan');
var path = require('path');

// Routers
var contactRouter = require('./routes/contact');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var signUpRouter = require('./routes/signup');     


// User authentication dependencies
var session = require('express-session')
var authentication = require('./authentication');
var passport = require('passport');

var app = express();

// For POST Methods
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// User Authentication
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //might need be used anyways
authentication(passport);

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/contact', contactRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer(app).listen(app.get('port'), 'localhost',
  function(){
    console.log("Express server listening on port " + app.get('port'));
});

database.createDatabase();
bcrypt.hash(process.env.ADMIN_PASS, 10, function(err, hash) {
    if(err){
        console.log("An error occured with password hashing");
    } else {
        var user1 = {
			"username": process.env.ADMIN_USERNAME,
			"password": hash,
			"isAdmin": true
		};
		// database.createUser(user1["username"], user1["password"], user1["isAdmin"]);
    }
});
