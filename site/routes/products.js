var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('store.db');

router.get('/', function(req, res, next) {
  res.send('All products goes here');
  //const nameToLookup = req.params.userid; // matches ':userid' above

});

router.get('/:productid', (req, res) => {
  const idToLookup = req.params.productid; // matches ':productid' above
  
  console.log(idToLookup);
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM Products WHERE id=$id',
    // parameters to SQL query:
    {
      $id: idToLookup
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      console.log(rows);
      if (rows.length != 0) {
          console.log('h');
        res.send(rows[0]);
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );
});

module.exports = router;