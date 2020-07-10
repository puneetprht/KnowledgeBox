const express = require('express');
const model = require('../models/user.model');
var app = express.Router();

app.get('/', (req, res) => {
	return res.json({ message: 'This is user controller.' });
});

app.post('/signup', async (req, res) => {
	model.getUserState(req.params.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user state.'
			});
		else res.send(data);
	});
});

app.get('/GetUserState/:id', (req, res) => {
	console.log(req.params);
	model.getUserState(req.params.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user state.'
			});
		else res.send(data);
	});
});

module.exports = app;
