var express = require('express');
var router = express.Router();
var multer  = require('multer')
var database = require('../database.js')
const asyncHandler = require('express-async-handler')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/' + req.body.category + "/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

var categories = ['drinks', 'noodles', 'frozen', 'health', 'snacks', 'spices', 'vegetables'];

router.get('/', function(req, res, next) {    
  database.getAllProducts(function(products){  
    res.render('products', {products: products, length: Object.keys(products).length})
  })               
});

router.get('/add', (req, res) => {
  res.render('addproduct', {categories: categories});
});

router.post('/add',  upload.single('image'), (req, res) => {
  var imageURL = "";
  if (req.file) {
    imageURL =  "/images/" + req.body.category + "/" + req.file.originalname;
  }
  database.addProduct(req.body.name, req.body.category, req.body.price, 
    req.body.quantity, imageURL);
  res.redirect('/admin');
});

router.get('/:productid', (req, res) => {
  const productId = Number(req.params.productid); // matches ':productid' above
  
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    if (product) {
      res.render('products', {product: product})
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });
});

router.get('/edit/:productid', function(req, res, next) {    
  const productId = Number(req.params.productid); // matches ':productid' above
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    console.log(product);
    if (product) {
      res.render('editproduct', {product: product, categories: categories})
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });            
});

router.post('/edit/:productid', upload.single('image'), function(req, res, next) {
  const productId = Number(req.params.productid); // matches ':productid' above
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    if (product) {
      var imageURL = product['imgUrl'];
      if (req.file) {
        imageURL =  "/images/" + product['category'] + "/" + req.file.originalname;
      }
      database.editProductById(productId, req.body.name, req.body.category, 
        req.body.price, req.body.quantity, imageURL);
      res.redirect('/admin');
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });           
});

router.get('/delete/:productid', function(req, res, next) {    
  const productId = Number(req.params.productid);
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    if (product) {
      database.deleteProductById(productId);
      res.redirect('/admin');
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });   
});

router.get('/increase/:productid', function(req, res, next) {    
  const productId = Number(req.params.productid);
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    if (product) {
      database.increaseQuantityById(productId);
      res.redirect('/admin');
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });               
});

router.get('/decrease/:productid', function(req, res, next) {    
  const productId = Number(req.params.productid);
  database.getProductById(productId, function(product) {
    // If the retrieved product is not null (the product Id exists).
    if (product) {
      database.decreaseQuantityById(productId);
      res.redirect('/admin');
    } else {
      res.send("No product with id " + productId + " exists.");
    }
  });              
});


module.exports = router;