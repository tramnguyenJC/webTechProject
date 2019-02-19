var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('store.db');

router.get('/', function(req, res, next) {
  res.send('All products goes here');
});


router.get('/:productid', (req, res) => {
  const idToLookup = Number(req.params.productid); // matches ':productid' above
  
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM Products WHERE id=$id',
    // parameters to SQL query:
    {
      $id: idToLookup   
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      product = rows[0];
      if (rows.length != 0) {
        res.render('product', { 
          name: product['name'],
          price: product['price'],
          category: product['category'],
          quantity: product['quantity'],
          imgUrl: product['imgUrl']});
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );
});





module.exports = router;