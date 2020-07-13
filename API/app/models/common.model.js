const sql = require('./db.js');

const Common = function(common) {};

Common.getDropdownData = (id, stateid, result) => {
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
				//console.log(res);
				result(null, res);
				return;
			}

			result(null, [ { value: 0, label: 'No categories' } ]);
		}
	);
};

Common.getAllSubjectForUser = (userId, stateId, result) => {
	sql.query(
		`select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, 
		count(stp.hmy) as count, c.hmy as category from  subject s 
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
				//console.log(res);
				result(null, res);
				return;
			}
			result(null, null);
		}
	);
};

Common.getSubjectList = (Categoryid, result) => {
	sql.query(
		`select s.hmy as id,subjectname as subject,count(st.hmy) as count, s.fcategory as category
		from subtopic st 
		right outer join subject s on st.fsubject = s.hmy
		where s.fcategory = ${Categoryid} group by s.hmy `,
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
		}
	);
};

Common.addSubject = (body, result) => {
	sql.query(
		`insert into  subject (subjectname, fcategory, fstate) 
		values ('${body.subjectName}',${body.categoryId},${body.stateId})`,
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

Common.deleteSubject = (body, result) => {
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
		}
	);
};

Common.addSubTopic = (body, result) => {
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

Common.deleteSubTopic = (body, result) => {
	console.log(body);
	sql.query(
		`delete from subtopic
		where hmy = ${body.id}`,
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

Common.getCategoryList = (id, result) => {
	sql.query(
		`select c.hmy as id, categoryname as name from
    category c inner join 
    state st on c.fstate = st.hmy where st.hmy = ${id}`,
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

			//result(null, [ { value: 0, label: 'No categories' } ]);
		}
	);
};

Common.postCategoryForUser = (category, result) => {
	sql.query(
		`delete from categoryxref where fstate = ${category.stateId} and fuser = ${category.userId}`,
		(err, res) => {
			category.selectedTopic.forEach(async (topic) => {
				sql.query(
					`select hmy from categoryXref where fcategory = ${topic} and fstate =${category.stateId} and fuser = ${category.userId}  LIMIT 1`,
					(err, res) => {
						if (!res[0]) {
							sql.query(
								`insert into categoryxref (fcategory,fstate,fuser) 
			values(${topic},${category.stateId},${category.userId})`,
								(err, res) => {
									if (err) {
										console.log('error: ', err);
										result(err, null);
										return;
									}
								}
							);
						}
					}
				);
			});
			result(null, null);
			return;
		}
	);
};

const fetchCategoryXref = async (categoryId, stateId, userId) => {
	await sql.query(
		`select hmy from categoryXref where fcategory = ${categoryId} and fstate =${stateId} and fuser = ${userId}  LIMIT 1`,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				return 0;
			} else {
				res = JSON.parse(JSON.stringify(res));
				console.log(res);
				if (res[0]) {
					console.log(res[0].hmy);
					return parseInt(res[0].hmy);
				} else {
					return false;
				}
			}
		}
	);
};

Common.postCategory = (body, result) => {
	if (body.id) {
		sql.query(`update category set categoryName = '${body.categoryName}' where hmy = ${body.id}`, (err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			result(null, null);
			return;
		});
	} else {
		sql.query(
			`insert into category (categoryName,fstate) values ('${body.categoryName}', ${body.stateId})`,
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
	}
};

Common.deleteCategory = (body, result) => {
	console.log(body);
	sql.query(
		`delete from category
		where hmy = ${body.id}`,
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

module.exports = Common;
