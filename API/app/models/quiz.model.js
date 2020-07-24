const sql = require('./db.js');

const Quiz = function(quiz) {};

Quiz.getSubTopicList = (id, result) => {
	//console.log('SubjectId: ', id);
	sql.query(
		`select st.hmy as id,subtopic value,count(q.hmy) as count from quiz q
		right outer join subtopic st on st.hmy = q.fsubtopic
		where st.fsubject = ${id}  group by st.hmy `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}

			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				result(null, res);
				return;
			}

			result(null, null);
			return;
		}
	);
};

Quiz.getQuizList = (id, result) => {
	sql.query(
		`select q.hmy as id,quizname as value from quiz q
		inner join subtopic st on st.hmy = q.fsubtopic
		where st.hmy = ${id} `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}

			if (res.length) {
				result(null, res);
				return;
			}

			result(null, null);
			return;
		}
	);
};

Quiz.addQuiz = (body, result) => {
	console.log(body);
	sql.query(
		`insert into  subtopic (subtopic, fcategory, fsubject) 
		values ('${body.SubTopicName}',${body.catergoryId},${body.subjectId})`,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			result(null, null);
			return;
		}
	);
};

Quiz.deleteQuiz = (body, result) => {
	console.log(body);
	sql.query(
		`delete from Quiz
		where hmy = ${body.id}`,
		(err, res) => {
			if (err) {
				//console.log('error: ', err);
				result(err, null);
				return;
			}
			result(null, null);
			return;
		}
	);
};

Quiz.getQuizDetail = (id, result) => {
	console.log(id, ' Time: ', new Date());
	sql.query(
		`select qd.hmy as id,question , option1, option2, option3, option4, explaination,correctOption, isMultiple from quizdetail qd
		inner join quiz q on q.hmy = qd.fquiz
		where q.hmy = ${id} `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			let count = 1;
			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				res.forEach((element) => {
					element.options = [];
					element.count = count++;
					for (let i = 1; i <= 4; i++) {
						element.options.push({
							id: i,
							value: element['option' + i],
							isSelected: false
						});
						delete element['option' + i];
					}
					element.answer = element.correctOption.split(',').sort();
					element.selectedAnswer = [];
				});
				console.log(res);
				result(null, res);
				return;
			}

			result(null, null);
			return;
		}
	);
};

Quiz.postQuizAnswers = (quizResult, result) => {
	console.log(quizResult);
	sql.query(
		`insert into quizxref (fquiz,fuser,score) value (${quizResult.quizId},${quizResult.userId},${quizResult.score})`,
		(err, data) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			console.log(data.insertId);

			quizResult.answers.forEach((answer) => {
				sql.query(
					`insert into quizdetailxref (fquizxref,fuser,fquizdetail,schosenoption,isCorrect)
					 value (${data.insertId},${quizResult.userId},${answer.quizDetailId},'${answer.selectedAnswer}',${answer.isCorrect})`,
					(err, res) => {
						if (err) {
							console.log('error: ', err);
							result(err, null);
							return;
						}
					}
				);
			});
			result(null, null);
			return;
		}
	);
};

Quiz.postQuiz = (quiz, result) => {
	console.log(quiz);
	sql.query(
		`insert into quiz (quizname,fsubtopic,fsubject,fcategory,fstate) values 
		('${quiz.quizName}',${quiz.subTopicId} ,${quiz.subjectId} ,${quiz.categoryId} ,${quiz.stateId} )`,
		(err, data) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			console.log(data.insertId);
			console.log(quiz.questions);

			quiz.questions.forEach((question) => {
				sql.query(
					`insert into quizdetail (fquiz,fsubtopic,fsubject,fcategory,fstate,question,option1,option2,
						option3,option4,correctoption,isMultiple) values 
						(${data.insertId},${quiz.subTopicId} ,${quiz.subjectId} ,${quiz.categoryId} ,${quiz.stateId},
							'${question.question.toString()}','${question.option1.toString()}','${question.option2.toString()}',
							'${question.option3.toString()}','${question.option4.toString()}',
							'${question.isCorrect.toString()}',${question.isMultiple})`,
					(err, res) => {
						if (err) {
							console.log('error: ', err);
							result(err, null);
							return;
						}
					}
				);
			});
			result(null, null);
			return;
		}
	);
};

module.exports = Quiz;
