const mysql = require('mysql2');
const dbConfig = require('../../config/db.config.js');

// Create a connection to the database
const connection = mysql.createPool({
	host: dbConfig.HOST,
	user: dbConfig.USER,
	password: dbConfig.PASSWORD,
	database: dbConfig.DB,
	waitForConnections: true,
  	connectionLimit: 15,
  	queueLimit: 30
});

// open the MySQL connection
/*connection.connect((error) => {
	if (error) throw error;
	console.log('Successfully connected to the database.');
});*/

module.exports = connection;
