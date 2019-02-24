var express = require('express');
var router = express.Router();
var database = require('../database.js')

router.get('/', function(req, res, next) {

  database.getAllProducts(function(products){
     var product2 = {
	"id": 2,
	"name": "beef ramen2",
	"category": "dry products",
	"price": 1,
	"quantity": 20,
	"imgUrl": "/images/beeframen.jpeg"
     };
    res.render('product', {products: product2})
  })                   
});

router.get('/:productid', (req, res) => {
  const productId = Number(req.params.productid); // matches ':productid' above
  
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    if (product) {
      res.render('product', { 
      name: product['name'],
      price: product['price'],
      category: product['category'],
      quantity: product['quantity'],
      imgUrl: product['imgUrl']});
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });
});

module.exports = router;