const express = require('./node_modules/express');
const bodyParser = require('./node_modules/body-parser');
const router = require('./app/controllers/router');
const port = 3000;

const app = express();

//parse requests of content-type: applcation/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//convert single quotes for sql insertion.
app.use((req, res, next) => {
	if (req.body) {
		//console.log(req.body);
		req.body = JSON.parse(JSON.stringify(req.body).replace("'", "''"));
		//console.log(req.body);
	}
	next();
});

//redirecting all the route to a common router.
app.use('', router);

// set port, listen for requests
app.listen(port, () => {
	console.log('Server is running on port ' + port + '.');
});
