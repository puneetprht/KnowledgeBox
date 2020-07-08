const express = require('express');
const model = require('../models/test.model');
var app = express.Router();
/*
app.use((req, res, next) => {
	console.log(req);
	next();
});
*/
app.get('/', (req, res) => {
	return res.json({ message: 'This is Test controller.' });
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

app.get('/getTestList', (req, res) => {
	model.getTestList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.post('/addTest', (req, res) => {
	model.addTest(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
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

module.exports = app;
