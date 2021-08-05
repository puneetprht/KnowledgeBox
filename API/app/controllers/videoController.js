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
	let user = null;
	let admin = req.query.isAdmin || false;
	for (const category of JSON.parse(req.query.selectedCategory)) {
		selectedCategory.push(category.id);
	}
	if(req.query.user){
		user = JSON.parse(req.query.user);
	}
	model.getAllSubjects(selectedCategory, user, admin, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send(data);
	});
});

app.get('/getSubject', (req, res) => {
	let user = null;
	if(req.query.user){
		user = JSON.parse(req.query.user);
	}
	model.getSubject(req.query.id, user, (err, data) => {
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
	let user = null;
	if(req.query.user){
		user = JSON.parse(req.query.user);
	}
	model.getSubTopicList(req.query.id, user, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.send(data);
	});
});

app.get('/getVideoList', (req, res) => {
	let user = null;
	if(req.query.user){
		user = JSON.parse(req.query.user);
	}
	model.getVideoList(req.query.id, user, (err, data) => {
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

app.post('/saveAttachment', (req, res) => {
	console.log("Item Body:", req.body);
	model.saveAttachment(req.body, (err, data) => {
		console.log('Error:', err);
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send(data);
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

app.post('/postPaymentStatus', (req, res) => {
	model.postPaymentStatus(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send(data);
	});
});

/*app.get('/test', (req, res) => {
	model.test(req.body, (err, data) => {
		if (err)
			res.status(500).send({
				message: err.message || 'Error processing request..'
			});
		else res.status(200).send(data);
	});
});*/

module.exports = app;
