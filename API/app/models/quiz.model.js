const sql = require('./db.js');

const Quiz = function(quiz) {};

Quiz.getDropdownData = (id, stateid, result) => {
	//console.log('UserId is:' + id);
	sql.query(
		`select c.hmy as value, categoryname as label  from subject s 
    inner join category c on c.hmy = s.fcategory inner join 
    state st on c.fstate = st.hmy inner join categoryxref cx on c.hmy = cx.fcategory 
    and cx.fuser = ${id} and st.hmy = ${stateid} group by c.hmy`,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				res.push({ value: -1, label: 'All' });
				console.log(res);
				result(null, res);
				return;
			}

			result(null, [ { value: 0, label: 'No categories' } ]);
		}
	);
};

Quiz.getAllSubjectForUser = (userId, stateId, result) => {
	sql.query(
		`select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, 
		count(stp.hmy) as count from  subject s 
		left outer join subtopic stp on stp.fsubject = s.hmy 
		inner join category c on c.hmy = s.fcategory inner join 
    	state st on c.fstate = st.hmy inner join categoryxref cx on c.hmy = cx.fcategory 
    	and cx.fuser = ${userId} and st.hmy = ${stateId} group by s.hmy`,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				console.log(res);
				result(null, res);
				return;
			}
			result(null, null);
		}
	);
};

Quiz.getSubjectList = (Categoryid, result) => {
	sql.query(
		`select s.hmy as id,subjectname as subject,count(st.hmy) as count from subtopic st 
		right outer join subject s on st.fsubject = s.hmy
		where s.fcategory = ${Categoryid} group by st.fsubject `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}

			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				console.log(res);
				result(null, res);
				return;
			}

			result(null, null);
		}
	);
};

Quiz.getSubTopicList = (id, result) => {
	//console.log('SubjectId: ', id);
	sql.query(
		`select st.hmy as id,subtopic value,count(st.hmy) as count from quiz q
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

module.exports = Quiz;
