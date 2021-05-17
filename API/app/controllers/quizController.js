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

app.get('/getAllSubjects', (req, res) => {
	let selectedCategory = [];
	let admin = req.query.isAdmin || false;
	for (const category of JSON.parse(req.query.selectedCategory)) {
		selectedCategory.push(category.id);
	}
	model.getAllSubjects(selectedCategory, admin, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getSubject', (req, res) => {
	model.getSubject(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.post('/addSubject', (req, res) => {
	model.addSubject(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.delete('/deleteSubject', (req, res) => {
	//console.log(req);
	model.deleteSubject(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
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
/*
app.post('/addQuiz', (req, res) => {
	model.addQuiz(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});
*/
app.delete('/deleteQuiz', (req, res) => {
	model.deleteQuiz(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postQuizAnswers', (req, res) => {
	model.postQuizAnswers(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postQuiz', (req, res) => {
	model.postQuiz(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postIsActive', (req, res) => {
	model.postIsActive(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postIsPaid', (req, res) => {
	model.postIsPaid(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postAmount', (req, res) => {
	model.postAmount(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

module.exports = app;
