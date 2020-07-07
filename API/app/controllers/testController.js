const express = require('express');
//const model = require('../models/test.model');
var app = express.Router();

app.get('/', (req, res) => {
	return res.json({ message: 'This is Test controller.' });
});

module.exports = app;
