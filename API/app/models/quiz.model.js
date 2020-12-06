const sql = require('./db.js');

const Quiz = function(quiz) {};

const toSqlString = (string) => {
	if (string) return `'${string.toString()}'`;
	else return null;
};

Quiz.getAllSubjects = (categories, result) => {
	console.log('categories:', categories);
	sql.query(
		`select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, 
		count(stp.hmy) as count, c.hmy as category from  subject s 
		left outer join subtopic stp on stp.fsubject = s.hmy
		inner join category c on c.hmy = s.fcategory where c.hmy in (${categories}) 	and s.objectType = 1 group by s.hmy`,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				//console.log(res);
				result(null, res);
				return;
			}
			result(null, null);
			return;
		}
	);
};

Quiz.getSubject = (Categoryid, result) => {
	sql.query(
		`select s.hmy as id,subjectname as subject,count(stp.hmy) as count, s.fcategory as category
		from subtopic stp 
		right outer join subject s on stp.fsubject = s.hmy 
		where s.fcategory = ${Categoryid} and s.objectType = 1 group by s.hmy `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}

			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				//console.log(res);
				result(null, res);
				return;
			}

			result(null, null);
			return;
		}
	);
};

Quiz.addSubject = (body, result) => {
	sql.query(
		`insert into  subject (subjectname, fcategory, objectType) 
		values ('${body.subjectName}',${body.categoryId}, 1 )`,
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

Quiz.deleteSubject = (body, result) => {
	sql.query(
		`delete from subject
		where hmy = ${body.id}`,
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
		`select q.hmy as id,quizname as value, q.duration as time from quiz q
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
		`select qd.hmy as id,question , option1, option2, option3, option4, explaination,correctOption, isMultiple,questionLang, 
		optionLang1, optionLang2, optionLang3, optionLang4, explainationLang,
		videoUrl, videoUrlId from quizdetail qd
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
					element.optionsLang = [];
					element.count = count++;
					for (let i = 1; i <= 4; i++) {
						element.options.push({
							id: i,
							value: element['option' + i],
							isSelected: false
						});
						element.optionsLang.push({
							id: i,
							value: element['optionLang' + i],
							isSelected: false
						});
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
	if (quiz.quizId) {
		sql.query(
			`update quiz SET quizname = '${quiz.quizName}', duration = ${quiz.quizTime} where hmy = ${quiz.quizId}`,
			(err, data) => {
				if (err) {
					console.log('error2: ', err);
					result(err, null);
					return;
				}
				console.log(data.insertId);
				console.log(quiz.questions);

				quiz.questions.forEach((question) => {
					if (question.id) {
						sql.query(
							`update quizdetail set question = '${question.question.toString()}',option1 = '${question.option1.toString()}',
						option2='${question.option2.toString()}',
							option3 = '${question.option3.toString()}',option4 = '${question.option4.toString()}'
							,correctoption = '${question.correctOption.toString()}',isMultiple = ${question.isMultiple} 
							,questionLang=${toSqlString(question.questionLang)},
							optionLang1=${toSqlString(question.optionLang1)},optionLang2=${toSqlString(question.optionLang2)},
							optionLang3=${toSqlString(question.optionLang3)}, optionLang4=${toSqlString(question.optionLang4)},
							videoUrl=${toSqlString(question.videoUrl)},
							videoUrlId=${toSqlString(question.videoUrlId)}, explaination=${toSqlString(
								question.explaination
							)}, explainationLang=${toSqlString(
								question.explainationLang
							)} where hmy = ${question.id}`,
							(err, res) => {
								if (err) {
									console.log('error: ', err);
									result(err, null);
									return;
								}
							}
						);
					} else {
						sql.query(
							`insert into quizdetail (fquiz,fsubtopic,fsubject,fcategory,question,option1,option2,
								option3,option4,correctoption,isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4,
								videoUrl, videoUrlId, explaination, explainationLang) values 
								(${data.insertId}, ${quiz.subTopicId}, ${quiz.subjectId}, ${quiz.categoryId},
									'${question.question.toString()}','${question.option1.toString()}','${question.option2.toString()}',
									'${question.option3.toString()}','${question.option4.toString()}',
									'${question.correctOption.toString()}',${question.isMultiple},'${question.questionLang}',
									'${question.optionLang1}','${question.optionLang2}','${question.optionLang3}','${question.optionLang4}',
									'${question.videoUrl}','${question.videoUrlId}','${question.explaination}','${question.explainationLang}')`,
							(err, res) => {
								if (err) {
									console.log('error: ', err);
									result(err, null);
									return;
								}
							}
						);
					}
				});
				result(null, null);
				return;
			}
		);
	} else {
		sql.query(
			`insert into quiz (quizname,fsubtopic,fsubject,fcategory,duration ) values 
		('${quiz.quizName}', ${quiz.subTopicId}, ${quiz.subjectId}, ${quiz.categoryId}, ${quiz.quizTime})`,
			(err, data) => {
				if (err) {
					console.log('error1 : ', err);
					result(err, null);
					return;
				}
				console.log(data.insertId);
				console.log(quiz.questions);
				
				quiz.questions.forEach((question) => {
					sql.query(
						`insert into quizdetail (fquiz,fsubtopic,fsubject,fcategory,question,option1,option2,
						option3,option4,correctoption,isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4,
						videoUrl, videoUrlId, explaination, explainationLang) values 
						(${data.insertId}, ${quiz.subTopicId}, ${quiz.subjectId}, ${quiz.categoryId},
							'${question.question.toString()}','${question.option1.toString()}','${question.option2.toString()}',
							'${question.option3.toString()}','${question.option4.toString()}',
							'${question.correctOption.toString()}',${question.isMultiple},'${question.questionLang}',
							'${question.optionLang1}','${question.optionLang2}','${question.optionLang3}','${question.optionLang4}',
							'${question.videoUrl}','${question.videoUrlId}','${question.explaination}','${question.explainationLang}')`,
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
	}
};

module.exports = Quiz;
