const express = require('express');
const model = require('../models/user.model');
var app = express.Router();

app.get('/', (req, res) => {
	return res.json({ message: 'This is user controller.' });
});

app.post('/register', async (req, res) => {
	model.registerUser(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

app.post('/authenticate', async (req, res) => {
	model.authenticateUser(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

app.post('/PostUserState', async (req, res) => {
	model.postUserState(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

app.get('/GetUserState/:id', (req, res) => {
	console.log(req.params);
	model.getUserState(req.params.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.send(data);
	});
});

app.get('/SendVerification/', async (req, res) => {
	await model.sendVerificationEmail(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

module.exports = app;
