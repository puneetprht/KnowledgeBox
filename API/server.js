const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

//parse requests of content-type: applcation/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
	res.json({ message: 'This is Express people.' });
});

// set port, listen for requests
app.listen(port, () => {
	console.log('Server is running on port ' + port + '.');
});
