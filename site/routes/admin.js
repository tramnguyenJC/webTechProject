var express = require('express');
var router = express.Router();
var database = require('../database.js')
const asyncHandler = require('express-async-handler')

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.send('User is not authenticated');
  }
});

router.get('/', function(req, res, next) {    
  database.getAllProducts(function(products){
    
    if (products != null){ 
      res.render('admin', {products: products, length: Object.keys(products).length})
    }
    else{ 
      // If there are no products in the database
      res.send("No products in database");
    }
    
  })               
});


module.exports = router;