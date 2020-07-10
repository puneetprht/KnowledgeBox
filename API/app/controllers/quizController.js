const express = require('express');
const model = require('../models/quiz.model');
var app = express.Router();

/*
app.use((req, res, next) => {
	console.log(req);
	next();
});
*/

app.get('/', (req, res) => {
	return res.json({ message: 'This is Quiz controller.' });
});

app.get('/getSubTopicList', (req, res) => {
	model.getSubTopicList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getQuizList', (req, res) => {
	model.getQuizList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getQuizDetail', (req, res) => {
	//console.log(req);
	model.getQuizDetail(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.post('/addQuiz', (req, res) => {
	model.addQuiz(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.delete('/deleteQuiz', (req, res) => {
	model.deleteQuiz(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

module.exports = app;
