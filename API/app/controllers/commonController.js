const express = require('express');
const model = require('../models/common.model');
var app = express.Router();

/*
app.use((req, res, next) => {
	console.log(req);
	next();
});*/

app.get('/', (req, res) => {
	return res.json({ message: 'This is Common controller.' });
});

app.get('/getDropdown', (req, res) => {
	model.getDropdownData(req.query.userId, req.query.stateId, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getAllSubjectForUser', (req, res) => {
	model.getAllSubjectForUser(req.query.userId, req.query.stateId, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getAllSubjectForNoUser', (req, res) => {
	let selectedCategory = [];
	for (const category of JSON.parse(req.query.selectedCategory)) {
		selectedCategory.push(category.id);
	}
	console.log(selectedCategory);
	model.getAllSubjectForNoUser(selectedCategory, req.query.stateId, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getSubjectList', (req, res) => {
	model.getSubjectList(req.query.id, (err, data) => {
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

app.post('/addSubTopic', (req, res) => {
	model.addSubTopic(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.delete('/deleteSubTopic', (req, res) => {
	model.deleteSubTopic(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.get('/getCategoryList', (req, res) => {
	model.getCategoryList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.post('/postCategoryForUser', (req, res) => {
	model.postCategoryForUser(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.post('/postCategory', (req, res) => {
	model.postCategory(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.delete('/deleteCategory', (req, res) => {
	model.deleteCategory(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

module.exports = app;
