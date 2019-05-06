var express = require('express');
var router = express.Router();
var database = require('../database.js')
const asyncHandler = require('express-async-handler')

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
  	if (req.user.isAdmin) {
	    database.getAllProducts(function(products){
		    if (products != null){ 
		      res.render('admin', {products: products, length: Object.keys(products).length})
		    }
		    else{ 
		      // If there are no products in the database
		      req.flash('noProducts','No products in database.');
		      res.render('index', {errorMessage: req.flash('noProducts')});
		    }	    
		})
	} else {
		req.flash('notAdmin','User is not admin.');
		res.render('index', {errorMessage: req.flash('notAdmin')});
	}
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
	res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }
});

module.exports = router;