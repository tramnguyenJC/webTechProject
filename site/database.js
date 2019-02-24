"use strict";

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');

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

exports.getAllProducts = function(callback) {
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      'SELECT * FROM Products',
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows.length != 0) {
          callback(rows);
        } else {
          callback(null);
        }
      }
    );
  });

}

