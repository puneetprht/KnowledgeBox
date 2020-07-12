const express = require('express');
const model = require('../models/video.model');
var app = express.Router();
/*
app.use((req, res, next) => {
	console.log(req);
	next();
});
*/
app.get('/', (req, res) => {
	return res.json({ message: 'This is Video controller.' });
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

app.get('/getVideoList', (req, res) => {
	model.getVideoList(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.post('/postVideo', (req, res) => {
	model.postVideo(req.body, (err, data) => {
		console.log('Error:', err);
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

app.delete('/deleteVideo', (req, res) => {
	model.deleteVideo(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send();
	});
});

module.exports = app;
