const express = require('express');
var app = express.Router();
const sql = require('./db2.js');
const query = require('../service/dbService.js');

const temp = function(temp) {};

app.get('/', async (req, res) => {
	//return res.json({ message: 'This is temp controller.' });
	temp.registerUser((err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

temp.registerUser = async (result) => {
	try{
		let res = await query.executeQuery('select * from user');
		result(null, res);
	}	catch(err){
		result({message: "things are fucked up."}, null);
	}
	return;	
}

module.exports = app;
