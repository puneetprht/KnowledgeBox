const express = require('express');
const model = require('../models/user.model');
var app = express.Router();

app.get('/', (req, res) => {
	return res.json({ message: 'This is user controller.' });
});

app.get('GetUserState', (req, res) => {
	console.log(req);
	model.getUserState(req.params, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user state.'
			});
		else res.send(data);
	});
});

module.exports = app;
