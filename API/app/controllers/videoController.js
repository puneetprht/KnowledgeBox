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
		else res.status(200).send(data);
	});
});

app.get('/getSubject', (req, res) => {
	console.log("Video Category :", req.query.id)
	model.getSubject(req.query.id, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send(data);
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
