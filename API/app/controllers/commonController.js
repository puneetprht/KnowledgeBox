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
	model.getCategoryList((err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
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
