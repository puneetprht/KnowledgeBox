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
		}
	);
};

Quiz.getQuizDetail = (id, result) => {
	console.log(id, ' Time: ', new Date());
	sql.query(
		`select qd.hmy as id,question , option1, option2, option3, option4, explaination from quizdetail qd
		inner join quiz q on q.hmy = qd.fquiz
		where q.hmy = ${id} `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}

			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				res.forEach((element) => {
					element.options = [];
					for (let i = 1; i <= 4; i++) {
						element.options.push({
							id: i,
							value: element['option' + i]
						});
						delete element['option' + i];
					}
				});
				result(null, res);
				return;
			}

			result(null, null);
		}
	);
};

module.exports = Quiz;
