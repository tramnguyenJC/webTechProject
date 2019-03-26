var express = require('express');
var router = express.Router();
var database = require('../database.js')

router.get('/', function(req, res, next) {
    
    var posts = [
    {title: "Post 1", name: "Danny"},
    {title: "Post 2", name: "Alex"},
    {title: "Post 3", name: "Matt"},
    {title: "Post 4", name: "Manny"}
    ];
    
  database.getAllProducts(function(products){
    
    res.render('product', {products: products, length: Object.keys(products).length, posts: posts })
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