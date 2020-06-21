const express = require('express')
const user = require('./userController')
const state = require('./stateController')
const category = require('./categoryController')
const quiz = require('./quizController')
var router = express.Router()


router.use('/user',user)
router.use('/state',state)
router.use('/category',category)
router.use('/quiz',quiz)


router.get('/', (req, res) => {
	return res.json({ message: "You've reached the endpoint of KnowledgeBox api." });
});

module.exports = router