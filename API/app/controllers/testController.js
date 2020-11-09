const express = require('express');
const model = require('../models/test.model');
var app = express.Router();

app.get('/', (req, res) => {
	return res.json({ message: 'This is Test controller.' });
});

//Home List Region.
app.get('/getAllSubjects', (req, res) => {
	let selectedCategory = [];
	for (const category of JSON.parse(req.query.selectedCategory)) {
		selectedCategory.push(category.id);
	}
	console.log(selectedCategory);
	model.getAllSubjects(selectedCategory, (err, data) => {
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

//Subtopic List Region.
app.get('/getSubTopicList', (req, res) => {
	model.getSubTopicList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getTestList', (req, res) => {
	model.getTestList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getTestDetail', (req, res) => {
	//console.log(req);
	model.getTestDetail(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.delete('/deleteTest', (req, res) => {
	model.deleteTest(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postTestAnswers', (req, res) => {
	model.postTestAnswers(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postTest', (req, res) => {
	model.postTest(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

module.exports = app;
