var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon_DB"
  });

  connection.connect(function(err){
    if (err) throw err;
    console.log("CONNECTED AS ID" + connection.threadId);
    runSearch();
});

  function printTable() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err; 
        console.table(res);
        runSearch();
    })
};

function numberValidation(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

function runSearch() {
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Welcome to bamazon, What would you like to do?",
      choices: [
      "See the Inventory",
      "Buy Products",
      "exit"
    ]
    })
    .then(function(answer) {
        switch (answer.action) {
        case "See the Inventory":
        printTable();
          break;
  
        case "Buy Products":
          checkID();
          break;

        case "exit":
          connection.end();
          break;
        }
      });
};

function checkID(){
    inquirer.prompt([
		{
			type: 'input',
			name: 'id',
            message: 'Please enter the Item ID which you would like to purchase.',
            validate: numberValidation,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
            message: 'How many do you need?',
            validate: numberValidation,
			filter: Number
		}
    ]).then(function(input) {
        var query = "SELECT * FROM products WHERE ?";
        var item = input.id;
        var quantity = input.quantity;
        connection.query(query, {id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				printTable();

			} else {
				var productData = data[0];

				if (quantity <= productData.stock_quantity) {
					console.log('Congratulations, the product you requested is in stock! Placing order!');

					// Update Query 
					var updateQuery = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE id = ' + item;

					// Update the inventory
					connection.query(updateQuery, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					printTable();
				}
			}
		})
	})
};




