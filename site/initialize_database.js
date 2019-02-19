const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('store.db');

db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE Products (id, name, category, price, quantity, imgUrl)");

  // insert 3 rows of data:
  db.run("INSERT INTO Products values (1, 'beef', 'dryproducts', 1, 20, 'beeframen.jpeg')");
  console.log('successfully created the Products table in store.db');

  // print them out to confirm their contents:
  db.each("SELECT id, name, category FROM Products", (err, row) => {
      console.log(row.id + ": " + row.name + ' - ' + row.category);
  });
});

db.close();
