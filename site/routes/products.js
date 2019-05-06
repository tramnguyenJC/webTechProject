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
    var fileName = req.body.name + "_" + file.originalname;
    cb(null, fileName.replace(/ /g, "_"))
  }
})
var upload = multer({ storage: storage })

//////////////////////////////////////////////////////////////////////////////////////////
// Retrieve all products
router.get('/', function(req, res, next) {
  database.getAllProducts(function(products){  
    res.render('products', {products: products, selectedCategory:"all"})
  })               
});

//////////////////////////////////////////////////////////////////////////////////////////
// Retrieve products that are in a specific category
router.get('/category/:category', (req, res) => {
  database.getProductsByCategory(req.params.category, function(products) {
    // If the retrieved product is not null (the product Id exists).
    if (products) {
      res.render('products', {products: products, selectedCategory:req.params.category})
    } else {
      req.flash('noCategory','No product with category ' + req.params.category + " exists.");
      res.render('index', {errorMessage: req.flash('noCategory')});
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
// Retrieve products that are in a specific category, but sorted.
router.get('/category/:category/sortby/:preference', (req, res) => {
  if (req.params.category.localeCompare('all') == 0) {
    database.getAllProducts(function(products){ 
      sortProducts(products, req.params.preference);
      res.render('products', {products: products, selectedCategory:"all"})
    })  
  } else {
    database.getProductsByCategory(req.params.category, function(products) {
      if (products) {
        sortProducts(products, req.params.preference);
        res.render('products', {products: products, selectedCategory:req.params.category})
      } else {
        req.flash('noCategory','No product with category ' + req.params.category + " exists.");
        res.render('index', {errorMessage: req.flash('noCategory')});
      }
    });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////
// helper method to sort by preference
function sortProducts(products, preference) {  
  switch(preference) {
    case 'alphabetical':
      products.sort(function(a,b) {
        return (a["name"] > b["name"]) ? 1 : ((b["name"]> a["name"]) ? -1 : 0);
      });
      break;
    case 'price':
      products.sort(function(a,b) {
        return (a["price"] > b["price"]) ? 1 : ((b["price"]> a["price"]) ? -1 : 0);
      });
      break;
    case 'quantity':
      products.sort(function(a,b) {
        return (a["quantity"] > b["quantity"]) ? 1 : ((b["quantity"]> a["quantity"]) ? -1 : 0);
      });
      break;
    default:
      console.log("Option sort by " + preference + " is not available currently.");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
// Search for products
router.post('/search', function(req, res, next) {
  var name = '%' + req.body.name + '%';
  database.getProductsByName(name, function(products) {
    if (products) {
      res.render('products', {products: products, selectedCategory:'all'})
    } else {
      req.flash('noMatchedResult',"No matched result for " + req.body.name + " exists.");
      res.render('index', {errorMessage: req.flash('noMatchedResult')});
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// MODIFY ACTIONS (ADMIN PRIVILEGES)

//////////////////////////////////////////////////////////////////////////////////////////
// Add new product
router.get('/add', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.render('addproduct');
    } else {
      req.flash('notAdmin','User is not admin.');
      res.render('index', {errorMessage: req.flash('notAdmin')});
    }
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }     
});

router.post('/add',  upload.single('image'), (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      var imageURL = "";
      if (req.file) {
        imageURL =  "/images/" + req.body.category + "/" + req.file.originalname;
      }
      database.addProduct(req.body.name, req.body.category, req.body.price, 
        req.body.quantity, imageURL);
      res.redirect('/admin');
    } else {
      req.flash('notAdmin','User is not admin.');
      res.render('index', {errorMessage: req.flash('notAdmin')});
    }
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }   
});

router.get('/edit/:productid', function(req, res, next) {  
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      const productid = Number(req.params.productid); // matches ':productid' above
      database.getProductById(productid, function(product) {
        // If the retrieved product is not null (the product Id exists).
        if (product) {
          res.render('editproduct', {product: product})
        } else {
          req.flash('noProduct','No product with id ' + productid + ' exists in database.');
          res.render('index', {errorMessage: req.flash('noProduct')});
        }
      });       
    } else {
      req.flash('notAdmin','User is not admin.');
      res.render('index', {errorMessage: req.flash('notAdmin')});
    }
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }          
});

router.post('/edit/:productid', upload.single('image'), function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      const productid = Number(req.params.productid); // matches ':productid' above

      database.getProductById(productid, function(product) {
        // If the retrieved product is not null (the product Id exists).
        if (product) {
          var imageURL = product['imgUrl'];
          if (req.file) {
            var fileName = req.body.name + "_" + req.file.originalname;
            imageURL =  "/images/" + product['category'] + "/" + fileName.replace(/ /g, "_");
          }
          database.editProductById(productid, req.body.name, req.body.category, 
            req.body.price, req.body.quantity, imageURL);
          res.redirect('/admin');
        } else {
          req.flash('noProduct','No product with id ' + productid + ' exists in database.');
          res.render('index', {errorMessage: req.flash('noProduct')});
        }
      });     
    } else {
      req.flash('notAdmin','User is not admin.');
      res.render('index', {errorMessage: req.flash('notAdmin')});
    }
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }       
});

router.get('/delete/:productid', function(req, res, next) {   
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      const productid = Number(req.params.productid);
      database.getProductById(productid, function(product) {
        // If the retrieved product is not null (the product Id exists).
        if (product) {
          database.deleteProductById(productid);
          res.redirect('/admin');
        } else {
          req.flash('noProduct','No product with id ' + productid + ' exists in database.');
          res.render('index', {errorMessage: req.flash('noProduct')});
        }
      });  
    } else {
      req.flash('notAdmin','User is not admin.');
      res.render('index', {errorMessage: req.flash('notAdmin')});
    }
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }    
});

router.get('/increase/:productid', function(req, res, next) {    
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      const productid = Number(req.params.productid);
      database.getProductById(productid, function(product) {
        // If the retrieved product is not null (the product Id exists).
        if (product) {
          database.increaseQuantityById(productid);
          res.redirect('/admin');
        } else {
          req.flash('noProduct','No product with id ' + productid + ' exists in database.');
          res.render('index', {errorMessage: req.flash('noProduct')});
        }
      });    
    } else {
      req.flash('notAdmin','User is not admin.');
      res.render('index', {errorMessage: req.flash('notAdmin')});
    }
  } else {
    req.flash('notAuthenticated','User is not authenticated.');
    res.render('index', {errorMessage: req.flash('notAuthenticated')});
  }            
});

router.get('/decrease/:productid', function(req, res, next) {    
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      const productid = Number(req.params.productid);
      database.getProductById(productid, function(product) {
        // If the retrieved product is not null (the product Id exists).
        if (product) {
          database.decreaseQuantityById(productid);
          res.redirect('/admin');
        } else {
          req.flash('noProduct','No product with id ' + productid + ' exists in database.');
          res.render('index', {errorMessage: req.flash('noProduct')});
        }
      });      
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