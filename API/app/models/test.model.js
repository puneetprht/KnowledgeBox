const sql = require('./db.js');

const Test = function(test) {};

Test.getSubTopicList = (id, result) => {
	console.log('SubjectId: ', id);
	sql.query(
		`select st.hmy as id,subtopic value,count(t.hmy) as count from test t
		right outer join subtopic st on st.hmy = t.fsubtopic
		where st.fsubject = ${id}  group by st.hmy `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			console.log(res);
			if (res.length) {
				res = JSON.parse(JSON.stringify(res));
				result(null, res);
				return;
			}

			result(null, null);
		}
	);
};

Test.getTestList = (id, result) => {
	sql.query(
		`select t.hmy as id,testname as value from test t
		inner join subtopic st on st.hmy = t.fsubtopic
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

Test.addTest = (body, result) => {
	console.log(body);
	sql.query(
		`insert into test (testname,url,fsubtopic,fsubject,fcategory,fstate)
        value ('First Test', 'https://www.youtube.com/watch?v=8NyP_XzqgGA', 1,1,1,1)`,
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
		}
	);
};

module.exports = Test;
