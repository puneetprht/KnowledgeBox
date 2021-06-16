const sql = require('./db.js');

const Common = function(common) {};

/*Common.use((req, res, next) => {
	console.log('we are trying to make a middleware lets hope it works.');
	next();
});*/
/*
Common.getDropdownData = (id, stateid, result) => {
	console.log('Dropdown data: UserId: ', id, ' StateId: ', stateid);
	sql.query(
		`select c.hmy as value, categoryname as label  from subject s 
    right outer join category c on c.hmy = s.fcategory inner join 
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
			return;
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
			return;
		}
	);
};

Common.getAllSubjectForNoUser = (categories, stateId, result) => {
	console.log('categories:', categories);
	sql.query(
		`select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, 
		count(stp.hmy) as count, c.hmy as category from  subject s 
		left outer join subtopic stp on stp.fsubject = s.hmy 
		inner join category c on c.hmy = s.fcategory inner join 
    	state st on c.fstate = st.hmy where c.hmy in (${categories}) and st.hmy = ${stateId} group by s.hmy`,
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
			return;
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
			return;
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
			return;
		}
	);
};
*/

Common.addSubTopic = (body, result) => {
	//console.log(body);
	if(body.subtopicId){
		sql.query(
			`update subtopic set subtopic= '${body.SubTopicName}' where hmy = ${body.subtopicId}`,
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
	}else{
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
	}
};

Common.deleteSubTopic = (body, result) => {
	//console.log(body);
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
			return;
		}
	);
};

Common.getCategoryList = (result) => {
	console.log("Fetching Category(s).")
	sql.query(
		`select ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS number,c.hmy as id, categoryname as name from
    category c`,
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
			return;
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
			`insert into category (categoryName) values ('${body.categoryName}')`,
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
	//console.log(body);
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

Common.updateSubject = (body, result) => {
	if (body.id) {
		sql.query(`update subject set subjectName = '${body.value}' where hmy = ${body.id}`, (err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			result(null, null);
			return;
		});
	}
};

Common.updateObject = (body, result) => {
	if (body.id) {
		sql.query(`update ${body.table} set ${body.table}Name = '${body.value}' where hmy = ${body.id}`, (err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			result(null, null);
			return;
		});
	}
};

module.exports = Common;
