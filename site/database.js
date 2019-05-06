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
    // Create Users table
    // db.run("DROP TABLE Users");
    db.run("CREATE TABLE IF NOT EXISTS Users (" +
      "username VARCHAR(255) PRIMARY KEY NOT NULL, " +
      "password VARCHAR(255) NOT NULL, " +
      "isAdmin BOOLEAN)");

    db.run("CREATE TABLE IF NOT EXISTS ShoppingCart (" +
      "username VARCHAR(255) NOT NULL, " +
      "productid INTEGER NOT NULL, " +
      "quantity INTEGER NOT NULL, " + 
      "FOREIGN KEY(productid) REFERENCES Products(id), " +
      "FOREIGN KEY(username) REFERENCES Users(username), " + 
      "PRIMARY KEY (username, productid) )");  

    console.log('successfully created the tables in data.db');
  });
}

////////////////////////////////////////////////////////////////////////////////
// USSERS METHODS

// Create a new user
exports.createUser = function(username, password, admin = false) {
  console.log(username)
  db.serialize(() => {
    var command = "INSERT INTO Users (username, password, isAdmin) ";
    command += "VALUES (?, ?, ?) ";
    db.run(command, [username, password, admin], function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Added user: " + username);
        }
    });
  });
}

// Retrieve in database by username
// @param userName: given username
// @param callback: matching user to be returned
exports.getUser = function(username, callback) {
  var command = 'SELECT * FROM users WHERE username = ? ';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [username],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows[0]);
        } else {
          callback(null);
        }
      }
    );
  });
}

////////////////////////////////////////////////////////////////////////////////
// PRODUCTS METHODS

exports.addProduct = function(name, category, price, quantity, imageURL) {
  var command = "INSERT INTO Products (name, category, price, quantity, imgUrl) ";
  command += "VALUES (? , ? , ? , ? , ? ) ";
  db.serialize(() => {
    db.run(command, [name, category, price, quantity, imageURL], function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Added Product of name " + name);
      }
    });
  });
}

////////////////////////////////////////////////////////////////////////////////
// SHOPPING CART METHODS

exports.addProductToCart = function(productid, username) {
  var command = 'SELECT * FROM ShoppingCart WHERE username = ? and productid = ? ;';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [username, Number(productid)],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows && rows.length != 0) {
          var newcommand = 'UPDATE ShoppingCart SET quantity = ? where username = ? and productid = ? ';
          var newQuantity = Number(rows[0]['quantity']) + 1;
          db.run(
            newcommand, [newQuantity, username, Number(productid)],
            function(error) { 
              if (error) {
                console.log(error);
              }
            }
          ); /// end of db.run
        } else {
          // No previous purchase of the same item from the same user.
          var command = "INSERT INTO ShoppingCart (username, productid, quantity) VALUES (? , ? , ? ) ";
          var quantity = 1;
          db.run(command, [username, productid, quantity], function(error) {
            if (error) {
              console.log(error);
            } else {
              console.log("User " + username + " added product " + productid + " to cart.");
            }
          }); // end of db.run(command)
        }
    }); // end of db.all
  }); // end of db.serialize()
}

exports.removeOneFromCart = function(productid, username) {
  var command = 'SELECT * FROM ShoppingCart WHERE username = ? and productid = ? ;';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [username, Number(productid)],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows && rows.length != 0) {
          var newcommand = 'UPDATE ShoppingCart SET quantity = ? where username = ? and productid = ? ';
          var newQuantity = Number(rows[0]['quantity']) - 1;
          if (newQuantity > 0) {
            db.run(newcommand, [newQuantity, username, Number(productid)], function(error) { 
              if (error) {
                console.log(error);
              }
            }); /// end of db.run
          } // end of if
          else {
            newcommand = 'DELETE from ShoppingCart where username = ? and productid = ? ';
            db.run(newcommand, [username, Number(productid)], function(error) { 
              if (error) {
                console.log(error);
              }
            }); /// end of db.run
          }
        }
    }); // end of db.all
  }); // end of db.serialize()
}

exports.removeAllFromCart = function(productid, username) {
  var command = 'SELECT * FROM ShoppingCart WHERE username = ? and productid = ? ;';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [username, Number(productid)],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows && rows.length != 0) {
          var newcommand = 'DELETE from ShoppingCart where username = ? and productid = ? ';
          db.run(
            newcommand, [username, Number(productid)],
            function(error) { 
              if (error) {
                console.log(error);
              }
            }
          ); /// end of db.run
        }
    }); // end of db.all
  }); // end of db.serialize()
}

exports.getAllProductsInShoppingCart = function(username, callback) {
  db.serialize(() => {
    var command = 'SELECT Products.id, Products.name, Products.category, Products.price, '
    + 'Products.imgUrl, ShoppingCart.quantity as purchasedQuantity '
    + 'FROM Products inner join ShoppingCart on Products.id = ShoppingCart.productid '
    + ' where ShoppingCart.username = ? ';
    db.all(
      command, [username],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows);
        } else {
          callback(null);
        }
      }
    );
  });
}


exports.getNumProductsInCart = function(user, callback) {
  var username = user['username'];
  db.serialize(() => {
    var command = 'SELECT SUM(quantity) from ShoppingCart where username = ? ';
    db.all(
      command, [username],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows[0]['SUM(quantity)']);
        } else {
          callback(null);
        }
      }
    );
  });
}

// Retrieve product in database by product id
// @param productId: given productId
// @param callback: matching product to be returned
exports.getProductById = function(productId, callback) {
  var command = 'SELECT * FROM Products WHERE id = ? ';

  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [Number(productId)],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows[0]);
        } else {
          callback(null);
        }
      }
    );
  });
}

// Retrieve product in database by product id
// @param category: given category
// @param callback: matching product to be returned
exports.getProductsByCategory = function(category, callback) {
  var command = 'SELECT * FROM Products WHERE category = ? ';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [category],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows);
        } else {
          callback(null);
        }
      }
    );
  });
}

exports.getProductsByName = function(name, callback) {
  var command = 'SELECT * FROM Products WHERE name LIKE ? ';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      command, [name],
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows);
        } else {
          callback(null);
        }
      }
    );
  });
}

// Retrieve all products in database
exports.getAllProducts = function(callback) {
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
      'SELECT * FROM Products',
      // callback function to run when the query finishes:
      (err, rows) => {
        if (rows) {
          callback(rows);
        } else {
          callback(null);
        }
      }
    );
  });
}

exports.editProductById = function(productId, name, category, price, quantity, imageURL) {
  var command = 'UPDATE Products SET name = ?, category = ?, price = ?, quantity = ?, imgUrl = ? where id = ? ';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.run(
      command, [name, category, Number(price), Number(quantity), imageURL, Number(productId)],
      // callback function to run when the query finishes:
      function(error) { 
        if (error) {
          console.log(error);
        } else {
          console.log("Updated Product of id " + productId + ".");
        }
      }
    );
  });
}

exports.deleteProductById = function(productId) {
  var command = 'DELETE from Products where id = ? ';
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    console.log(command);
    db.run(
      command, Number(productId),
      // callback function to run when the query finishes:
      function(error) { 
        if (error) {
          console.log(error);
        } else {
          console.log("Deleted Product of id " + productId + ".");
        }
      }
    );
  });
}

exports.decreaseQuantityById = function(productId) {
   var command = 'UPDATE Products SET quantity = quantity - 1 WHERE id = ? '
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    console.log(command);
    db.run(
      command, Number(productId),
      // callback function to run when the query finishes:
      function(error) { 
        if (error) {
          console.log(error);
        } else {
          console.log("Deleted Product of id " + productId + ".");
        }
      }
    );
  });
}

exports.increaseQuantityById = function(productId) {
   var command = 'UPDATE Products SET quantity = quantity + 1 WHERE id = ? '
  db.serialize(() => {
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    console.log(command);
    db.run(
      command, Number(productId),
      // callback function to run when the query finishes:
      function(error) { 
        if (error) {
          console.log(error);
        } else {
          console.log("Deleted Product of id " + productId + ".");
        }
      }
    );
  });
}

