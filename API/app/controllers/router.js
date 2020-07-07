const express = require('express');
const user = require('./userController');
const state = require('./stateController');
const quiz = require('./quizController');
const video = require('./testController');
const test = require('./videoController');
var router = express.Router();

router.use('/user', user);
router.use('/state', state);
router.use('/quiz', quiz);
router.use('/video', video);
router.use('/test', test);

router.get('/', (req, res) => {
	return res.json({ message: "You've reached the endpoint of KnowledgeBox api." });
});

module.exports = router;
