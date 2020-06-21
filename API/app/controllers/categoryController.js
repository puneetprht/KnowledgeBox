const express = require('express')
var app = express.Router()


app.get('/', (req, res) => {
	return res.json({ message: 'This is Category controller.' });
});

module.exports = app