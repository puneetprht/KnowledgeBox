const express = require('express');
var app = express.Router();
const sql = require('./db2.js');

const temp = function(temp) {};

app.get('/', async (req, res) => {
	temp.registerUser((err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

temp.registerUser = (result) => {
    return (null, "Hey");
}

module.exports = app;
