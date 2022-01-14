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

app.get('/GetUser/:id', (req, res) => {
	//console.log(req.params);
	model.getUserDetail(req.params.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.send(data);
	});
});

app.get('/GetUserList/:limit/:offset', (req, res) => {
	//console.log(req.params);
	model.getUserList(req.params.limit, req.params.offset, req.query.search, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.send(data);
	});
});

app.delete('/deleteUser', (req, res) => {
	//console.log(req);
	model.deleteUser(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/updateUser', async (req, res) => {
	//console.log(req);
	model.updateUser(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

app.post('/payUser', async (req, res) => {
	model.payUser(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

app.get('/refreshUser', async (req, res) => {
	await model.getUser(req.query.id, (err, data) => {
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
	//console.log(req.params);
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

app.get('/coupon', async (req, res) => {
	await model.verifyCoupon(req.query.code, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});

app.get('/referral', async (req, res) => {
	await model.verifyReferral(req.query.code, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while fetching user.'
			});
		else res.status(200).send(data);
	});
});
module.exports = app;
