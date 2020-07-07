const express = require('express');
const model = require('../models/quiz.model');
var app = express.Router();

/*app.use((req, res, next) => {
	console.log(req);
	next();
});*/

app.get('/', (req, res) => {
	return res.json({ message: 'This is Quiz controller.' });
});

app.get('/getDropdown', (req, res) => {
	model.getDropdownData(req.query.userId, req.query.stateId, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Customer.'
			});
		else res.send(data);
	});
});

app.get('/getAllSubjectForUser', (req, res) => {
	model.getAllSubjectForUser(req.query.userId, req.query.stateId, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Customer.'
			});
		else res.send(data);
	});
});

app.get('/getSubjectList', (req, res) => {
	model.getSubjectList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Customer.'
			});
		else res.send(data);
	});
});

app.get('/getSubTopicList', (req, res) => {
	model.getSubTopicList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Customer.'
			});
		else res.send(data);
	});
});

app.get('/getQuizList', (req, res) => {
	model.getQuizList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Customer.'
			});
		else res.send(data);
	});
});

module.exports = app;
