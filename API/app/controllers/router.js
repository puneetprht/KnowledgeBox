const express = require('express');
const user = require('./userController');
const home = require('./homeController');
const common = require('./commonController');
const quiz = require('./quizController');
const video = require('./videoController');
const test = require('./testController');
const temp = require('../models/temp');
var router = express.Router();

router.use('/user', user);
router.use('/home', home);
router.use('/common', common);
router.use('/quiz', quiz);
router.use('/video', video);
router.use('/test', test);
router.use('/temp', temp);

router.get('/', (req, res) => {
	return res.json({ message: "You've reached the endpoint of KnowledgeBox api." });
});

module.exports = router;
