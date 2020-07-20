const sql = require('./db.js');

const Test = function(test) {};

Test.getSubTopicList = (id, result) => {
	//console.log('SubjectId: ', id);
	sql.query(
		`select st.hmy as id,subtopic value,count(q.hmy) as count from test q
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

Test.getTestList = (id, result) => {
	sql.query(
		`select q.hmy as id,testname as value from test q
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

Test.addTest = (body, result) => {
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

Test.deleteTest = (body, result) => {
	console.log(body);
	sql.query(
		`delete from Test
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

Test.getTestDetail = (id, result) => {
	console.log(id, ' Time: ', new Date());
	sql.query(
		`select qd.hmy as id,question , option1, option2, option3, option4, explaination,correctOption, isMultiple from testdetail qd
		inner join test q on q.hmy = qd.ftest
		where q.hmy = ${id} `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			let count = 0;
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

Test.postTestAnswers = (testResult, result) => {
	console.log(testResult);
	sql.query(
		`insert into testxref (ftest,fuser,score) value (${testResult.testId},${testResult.userId},${testResult.score})`,
		(err, data) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			console.log(data.insertId);

			testResult.answers.forEach((answer) => {
				sql.query(
					`insert into testdetailxref (ftestxref,fuser,ftestdetail,schosenoption,isCorrect)
					 value (${data.insertId},${testResult.userId},${answer.testDetailId},'${answer.selectedAnswer}',${answer.isCorrect})`,
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

Test.postTest = (test, result) => {
	console.log(test);
	sql.query(
		`insert into test (testname,fsubtopic,fsubject,fcategory,fstate) values 
		('${test.testName}',${test.subTopicId} ,${test.subjectId} ,${test.categoryId} ,${test.stateId} )`,
		(err, data) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			console.log(data.insertId);
			console.log(test.questions);

			test.questions.forEach((question) => {
				sql.query(
					`insert into testdetail (ftest,fsubtopic,fsubject,fcategory,fstate,question,option1,option2,
						option3,option4,correctoption,isMultiple) values 
						(${data.insertId},${test.subTopicId} ,${test.subjectId} ,${test.categoryId} ,${test.stateId},
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

module.exports = Test;
