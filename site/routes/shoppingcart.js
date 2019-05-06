var express = require('express');
var router = express.Router();
var database = require('../database.js')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

//////////////////////////////////////////////////////////////////////////////////////////
// Retrieve all products
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    database.getAllProductsInShoppingCart(req.user.username, function(products) {
      var totalPrices = 0;
      products.forEach(function(product) {
        totalPrices += product['purchasedQuantity'] * product['price'];
      });
      var discountPercent = 0;
      if (req.query.coupon != undefined)  {
        if (req.query.coupon == process.env.COUPON_CODE) {
          discountPercent = 10;
        }
      }
      res.render('shoppingcart', {products: products, totalPrices : totalPrices, discountPercent: discountPercent});
    });
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }            
});


//////////////////////////////////////////////////////////////////////////////////////////
// SHOPPING CART STUFFS
router.get('/addtocart/:productid', (req, res) => {
  const productid = Number(req.params.productid); // matches ':productid' above
  if (req.isAuthenticated()) {
    database.getProductById(productid, function(product) {
      // If the retrieved product is not null (the product Id exists).
      if (product) {
        database.addProductToCart(productid, req.user.username);
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('back');
      } else {
        req.flash('noProduct','No product with id ' + productid + ' exists in database.');
        res.render('index', {errorMessage: req.flash('noProduct')});
      }
    });
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
  res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }
});

// ADD ONE ITEM TO CART 
router.get('/addone/:productid', (req, res) => {
  const productid = Number(req.params.productid); // matches ':productid' above
  if (req.isAuthenticated()) {
    database.getProductById(productid, function(product) {
      // If the retrieved product is not null (the product Id exists).
      if (product) {
        database.addProductToCart(productid, req.user.username);
        res.redirect('/shoppingcart');
      } else {
        req.flash('noProduct','No product with id ' + productid + ' exists in database.');
        res.render('index', {errorMessage: req.flash('noProduct')});
      }
    });
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
  res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }
});


// REMOVE ONE ITEM FROM CART 
router.get('/removeone/:productid', (req, res) => {
  const productid = Number(req.params.productid); // matches ':productid' above
  if (req.isAuthenticated()) {
    database.getProductById(productid, function(product) {
      // If the retrieved product is not null (the product Id exists).
      if (product) {
        database.removeOneFromCart(productid, req.user.username);
        res.redirect('/shoppingcart');
      } else {
        req.flash('noProduct','No product with id ' + productid + ' exists in database.');
        res.render('index', {errorMessage: req.flash('noProduct')});
      }
    });
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
  res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }
});

router.get('/removeall/:productid', (req, res) => {
  const productid = Number(req.params.productid); // matches ':productid' above
  if (req.isAuthenticated()) {
    database.getProductById(productid, function(product) {
      // If the retrieved product is not null (the product Id exists).
      if (product) {
        database.removeAllFromCart(productid, req.user.username);
        res.redirect('/shoppingcart');
      } else {
        req.flash('noProduct','No product with id ' + productid + ' exists in database.');
        res.render('index', {errorMessage: req.flash('noProduct')});
      }
    });
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
  res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }
});

// router.post('/applyDiscount', function(req, res, next) {
//   if (req.body.coupon == process.env.COUPON_CODE) {
//     res.redirect('/shoppingcart');
//   } else {
//     database.getAllProductsInShoppingCart(req.user.username, function(products) {
//       var totalPrices = 0;
//       products.forEach(function(product) {
//         totalPrices += product['purchasedQuantity'] * product['price'];
//       });
//       res.render('shoppingcart', {products: products, totalPrices : totalPrices});
//     });
//     req.flash('invalidCouponCode','Coupon code is not valid.');
//     res.render('shoppingcart', {errorMessage: req.flash('invalidCouponCode')});
//   }  
// });

module.exports = router;