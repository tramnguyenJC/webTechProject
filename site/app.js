"use strict";
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var path = require('path');
var database = require('./database.js')
var session = require("express-session")

var contactRouter = require('./routes/contact');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var databaseManagerRouter = require('./routes/databaseManager');
var loginRouter = require('./routes/login');

var app = express();


// User Authentication
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

// User authentication
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: "Invalid username or password" })
);



const bodyParser = require('body-parser');
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


app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/contact', contactRouter);
app.use('/editdatabase', databaseManagerRouter);
app.use('/login', loginRouter)

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

http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});

// Temporarily add data to database. After implementing feature for admin 
// to add products on the website, get rid of this.
var product = {
	"id": 1,
	"name": "Nissin Top Ramen Beef Flavor",
	"category": "noodles",
	"price": 1.0,
	"quantity": 20,
	"imgUrl": "/images/beeframen.jpeg"
};
var product2 = {
	"id": 2,
	"name": "Yakult Probiotic Drink 80mlx5",
	"category": "drinks",
	"price": 3.0,
	"quantity": 20,
	"imgUrl": "/images/drinksProducts/Yakult_Probiotic_Drink_80mlx5.jpg"
};
var product3 = {
	"id": 3,
	"name": "Chocopie Box of 12",
	"category": "snacks",
	"price": 4.0,
	"quantity": 20,
	"imgUrl": "/images/snacksProducts/chocopie.jpeg"
};

var user1 = {
	"username": "ds",
	"password": "Chocopie",
};
database.createDatabase();

database.insertUser(user1);
//database.insertProduct(product);
//database.insertProduct(product2);
//database.insertProduct(product3);
module.exports = app;