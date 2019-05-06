var express = require('express');
var router = express.Router();
var database = require('../database.js')
const asyncHandler = require('express-async-handler')


router.get('/', function(req, res, next) {    
  database.getAllProducts(function(products){
    
    if (products != null){ 
      res.render('admin', {products: products, length: Object.keys(products).length})
    }
    else{ // If there are no products in the database
      res.redirect('/index');
    }
    
  })               
});

// router.get('/:productid', (req, res) => {
//   const productId = Number(req.params.productid); // matches ':productid' above
  
//   database.getProductById(productId, function(product) {
//     // If the retrieved product is not null (the product Id exists).
//     if (product) {
//       res.render('products', {product: product})
//     } else {
//       res.send("No product with id " + productId + " exists.");
//     }
//   });
// });


module.exports = router;