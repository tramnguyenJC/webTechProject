"use strict";
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');

// Create the database.
exports.createDatabase = function() {
  db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE IF NOT EXISTS Products (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "name VARCHAR(255) NOT NULL, " +
    "category VARCHAR(255), " +
    "price DOUBLE(10, 2), " +
    "quantity INT, " +
    "imgUrl TEXT)");

  console.log('successfully created the Products table in data.db');
  });
}

////////////////////////////////////////////////////////////////////////////////
// PRODUCTS METHODS

// Insert product into the database
// @param product: dict object that contains information about the product.
exports.insertProduct = function(product) {
  db.serialize(() => {
    var command = "INSERT INTO Products (id, name, category, price, quantity," +
      "imgUrl) VALUES (";
    command = command + product["id"] + ",\'" + product["name"] + "\'"  +
              ",\'" + product["category"] + "\'," + product["price"] + "," +
              product["quantity"] + ",\'" + product["imgUrl"] + "\')";
    db.run(command);
  });
}

// Retrieve product in database by product id
// @param productId: given productId
// @param callback: matching product to be returned
exports.getProductById = function(productId, callback) {
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      'SELECT * FROM Products WHERE id=$id',
      {
        $id: Number(productId)  
      },
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows.length != 0) {
          callback(rows[0]);
        } else {
          callback(null);
        }
      }
    );
  });
}

// Retrieve product in database by product name
// @param productName: given product name
// @param callback: matching product to be returned
exports.getProductByName = function(productName, callback) {
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      'SELECT * FROM Products WHERE name=$name',
      {
        $name: Number(productName)  
      },
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows.length != 0) {
          callback(rows[0]);
        } else {
          callback(null);
        }
      }
    );
  });
}
