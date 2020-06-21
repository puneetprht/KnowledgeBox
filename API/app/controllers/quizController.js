const express = require('express')
const model = require('../models/quiz.model')
var app = express.Router()


app.get('/', (req, res) => {
	return res.json({ message: 'This is Quiz controller.' });
});

app.get('/getList',(req, res) =>{ model.getCategoryListForUser(1, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  })
});

module.exports = app