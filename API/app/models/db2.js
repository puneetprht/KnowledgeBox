const mysql = require('mysql');
const dbConfig = require('../../config/db.config.js');

// Create a connection to the database
const connection2 = mysql.createConnection({
	host: dbConfig.HOST,
	user: dbConfig.USER,
	password: dbConfig.PASSWORD
	//database: dbConfig.DB
});

// open the MySQL connection
connection2.connect((error) => {
	if (error) throw error;
	console.log('Successfully connected to the database.');
});

module.exports = connection2;
