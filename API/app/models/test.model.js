const sql = require('./db.js');

const toSqlString = (string) => {
	if (string) return `'${string.toString()}'`;
	else return null;
};

const Test = function(test) {};

Test.getAllSubjects = (categories, user, admin, result) => {
	let SQL = '';
	SQL += ` select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, subjectname as subjectName, categoryname as categoryName,
	count(stp.hmy) as count, c.hmy as category, IFNULL(s.isPaid, 0) as isPaid, s.amount as amount,
	IFNULL(s.isActive, 0) as isActive `;
	if(user && user.id){
		SQL += ` ,CASE
		WHEN xref.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isBought`
	}
	SQL += ` from  subject s
	left outer join subtopic stp on stp.fsubject = s.hmy
	inner join category c on c.hmy = s.fcategory `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 3 and xref.objPointer = s.hmy and 
				xref.objReference = 'subject' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `
	}
	if(admin){
		SQL += ` where c.hmy in (select hmy from category) and s.objectType = 3 group by s.hmy `;
	}	else{
		SQL += ` where c.hmy in (${categories}) and s.objectType = 3 group by s.hmy `;
	}

	console.log("Query:", SQL);
	sql.query(
		SQL,
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

Test.getSubject = (Categoryid, user, result) => {
	let SQL = '';
	SQL += ` select s.hmy as id,subjectname as subject, subjectname as subjectName, count(stp.hmy) as count, s.fcategory as category,
	IFNULL(s.isPaid, 0) as isPaid, s.amount as amount, IFNULL(s.isActive, 0) as isActive `;
	if(user && user.id){
		SQL += ` ,CASE
		WHEN xref.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isBought`
	}
	SQL += ` from subtopic stp 
	right outer join subject s on stp.fsubject = s.hmy `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 3 and xref.objPointer = s.hmy and 
				xref.objReference = 'subject' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `
	}
	SQL += ` where s.fcategory = ${Categoryid} and s.objectType = 3 group by s.hmy `;

	sql.query(
		SQL,
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

Test.addSubject = (body, result) => {
	sql.query(
		`insert into  subject (subjectname, fcategory, objectType) 
		values ('${body.subjectName}',${body.categoryId}, 3 )`,
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

Test.deleteSubject = (body, result) => {
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

Test.getSubTopicList = (id, user, result) => {
	let SQL = '';
	SQL += ` select st.hmy as id,subtopic value,count(q.hmy) as count,
	st.isPaid as isPaid, st.amount as amount, st.isActive as isActive,
	s.isPaid as isParentPaid, s.amount as parentAmount `;
	if(user && user.id){
		SQL += ` ,CASE
		WHEN xref.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isBought`
	}
	SQL += ` from test v
	right outer join subtopic st on st.hmy = q.fsubtopic
	inner join subject s on s.hmy = st.fsubject `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 3 and xref.objPointer = st.hmy and 
				xref.objReference = 'subtopic' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `
	}
	SQL += ` where st.fsubject = ${id}  group by st.hmy `;

	sql.query(
		`select st.hmy as id,subtopic value,count(q.hmy) as count,
		st.isPaid as isPaid, st.amount as amount, st.isActive as isActive from test q
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

Test.getTestList = (id, user, result) => {
	let SQL = '';
	SQL += ` select q.hmy as id,testname as value, q.duration as time, q.instructions as instructions,
	q.isPaid as isPaid, q.amount as amount, q.isActive as isActive,
	st.isPaid as isParentPaid, st.amount as parentAmount,
	s.isPaid as isSuperParentPaid, s.amount as superParentAmount `;
	if(user && user.id){
		SQL += ` ,CASE
		WHEN xref.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isBought `
		SQL += ` ,CASE
		WHEN xrefParent.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isParentBought `
		SQL += ` ,CASE
		WHEN xrefSuperParent.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isSuperParentBought `
	}
	SQL += ` from test q
	inner join subtopic st on st.hmy = q.fsubtopic
	inner join subject s on s.hmy = st.fsubject `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 2 and xref.objPointer = q.hmy and 
				xref.objReference = 'test' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `;
		SQL += ` left outer join paymentxref xrefParent on xrefParent.objType = 2 and xrefParent.objPointer = st.hmy and 
				xrefParent.objReference = 'subtopic' and xrefParent.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `;
		SQL += ` left outer join paymentxref xrefSuperParent on xrefSuperParent.objType = 2 and xrefSuperParent.objPointer = s.hmy and 
				xrefSuperParent.objReference = 'subject' and xrefSuperParent.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `;
	}
	SQL += ` where st.hmy = ${id} `;


	sql.query(
		SQL,
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
		`select qd.hmy as id, question, option1, option2, option3, option4, explaination, correctOption, isMultiple,
		qd.negativeWeightage as negativeWeightage , qd.weightage as weightage, questionLang, 
		optionLang1, optionLang2, optionLang3, optionLang4, explainationLang,
		videoUrl, videoUrlId from testdetail qd
		inner join test q on q.hmy = qd.ftest
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
				var maxMarks = 0;
				res.forEach((element) => {
					console.log('ELEMENT IS THIS PLEASE LOOK:', element);
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
					element.weightage = parseFloat(element.weightage || 0).toFixed(1);
					element.negativeWeightage = parseFloat(element.negativeWeightage || 0).toFixed(1);
					element.selectedAnswer = [];
					element.isMarked = false;
					element.isStar = false;
					element.time = 0;
					maxMarks += parseFloat(element.weightage || 0);
					element.maxMarks = maxMarks;
				});
				console.log('Test Details :', res);
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
	console.log("This is test:", test);
	if (test.testId) {
		sql.query(
			`update test SET testname = '${test.testName}', duration = ${test.testTime}, instructions = '${test.testInstructions}'	 where hmy = ${test.testId}`,
			(err, data) => {
				if (err) {
					console.log('error2: ', err);
					result(err, null);
					return;
				}
				console.log(data.insertId);
				console.log(test.questions);

				test.questions.forEach((question) => {
					if (question.id) {
						sql.query(
							`update testdetail set question = '${question.question.toString()}',option1 = '${question.option1.toString()}',
						option2='${question.option2.toString()}',
							option3 = '${question.option3.toString()}',option4 = '${question.option4.toString()}'
							,correctoption = '${question.correctOption.toString()}',isMultiple = ${question.isMultiple} 
							,questionLang=${toSqlString(question.questionLang)},
							optionLang1=${toSqlString(question.optionLang1)},optionLang2=${toSqlString(question.optionLang2)},
							optionLang3=${toSqlString(question.optionLang3)}, optionLang4=${toSqlString(question.optionLang4)},
							weightage=${question.weightage},
							negativeWeightage=${question.negativeWeightage},videoUrl=${toSqlString(question.videoUrl)},
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
							`insert into testdetail (ftest,fsubtopic,fsubject,fcategory,question,option1,option2,
								option3,option4,correctoption,isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4, weightage, negativeWeightage,
								videoUrl, videoUrlId, explaination, explainationLang) values 
								(${data.insertId}, ${test.subTopicId}, ${test.subjectId}, ${test.categoryId},
									'${question.question.toString()}','${question.option1.toString()}','${question.option2.toString()}',
									'${question.option3.toString()}','${question.option4.toString()}',
									'${question.correctOption.toString()}',${question.isMultiple},'${question.questionLang}',
									'${question.optionLang1}','${question.optionLang2}','${question.optionLang3}','${question.optionLang4}',
									${question.weightage},${question.negativeWeightage},'${question.videoUrl}','${question.videoUrlId}','${question.explaination}','${question.explainationLang}')`,
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
			`insert into test (testname,fsubtopic,fsubject,fcategory,duration, instructions ) values 
		('${test.testName}', ${test.subTopicId}, ${test.subjectId}, ${test.categoryId}, ${test.testTime}, '${test.testInstructions}')`,
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
						`insert into testdetail (ftest,fsubtopic,fsubject,fcategory,question,option1,option2,
						option3,option4,correctoption,isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4, weightage, negativeWeightage,
						videoUrl, videoUrlId, explaination, explainationLang) values 
						(${data.insertId}, ${test.subTopicId}, ${test.subjectId}, ${test.categoryId},
							'${question.question.toString()}','${question.option1.toString()}','${question.option2.toString()}',
							'${question.option3.toString()}','${question.option4.toString()}',
							'${question.correctOption.toString()}',${question.isMultiple},'${question.questionLang}',
							'${question.optionLang1}','${question.optionLang2}','${question.optionLang3}','${question.optionLang4}',
							${question.weightage},${question.negativeWeightage},'${question.videoUrl}','${question.videoUrlId}','${question.explaination}','${question.explainationLang}')`,
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

Test.postIsActive = (req, result) => {
	sql.query(
		`update ${req.table} set isActive = ${req.isActive} where hmy = ${req.id}`,
		(err, data) => {
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

Test.postIsPaid = (req, result) => {
	sql.query(
		`update ${req.table} set isPaid = ${req.isPaid} where hmy = ${req.id}`,
		(err, data) => {
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

Test.postAmount = (req, result) => {
	sql.query(
		`update ${req.table} set amount = ${req.amount} where hmy = ${req.id}`,
		(err, data) => {
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

Test.postPaymentStatus = (req, result) => {
	if(req.table){
		console.log(`insert into paymentxref (objType, objPointer ,objReference ,fuser ,amount , txId ,status ,message, fReferralUser, fCoupon, referralAmount) 
		values (2, ${parseInt(req.objectId)}, '${String(req.table)}', ${req.userId}, ${req.amount}, '${String(req.txnId)}', 
		'${String(req.status)}', '${String(req.message)}', ${parseInt(req.referral)}, ${parseInt(req.coupon)}, ${parseInt(req.referralAmount)})`);
		sql.query(
			`insert into paymentxref (objType, objPointer ,objReference ,fuser ,amount , txId ,status ,message, fReferralUser, fCoupon, referralAmount) 
			values (2, ${parseInt(req.objectId)}, '${String(req.table)}', ${req.userId}, ${req.amount}, '${String(req.txnId)}', 
			'${String(req.status)}', '${String(req.message)}', ${parseInt(req.referral)}, ${parseInt(req.coupon)}, ${parseInt(req.referralAmount)})`,
			(err, data) => {
				if (err) {
					console.log('error: ', err);
					result(err, null);
					return;
				}
				if(req.referral > 0 && req.coupon > 0 && String(req.status) == 'SUCCESS'){
				sql.query(
					`update user set walletAmount = walletAmount + ${parseInt(req.amount)} where hmy =  ${parseInt(req.referral)}`,
					(err, data) => {
						if (err) {
							console.log('error: ', err);
							result(err, null);
							return;
						}
						result(null,{status: String(req.status)});
						return;
					}
				);} else if(req.referral > 0 && String(req.status) == 'SUCCESS'){
				sql.query(
					`update user set walletAmount = walletAmount + ${parseInt(req.amount)/2} where hmy =  ${parseInt(req.referral)}`,
					(err, data) => {
						if (err) {
							console.log('error: ', err);
							result(err, null);
							return;
						}
						result(null,{status: String(req.status)});
						return;
					}
				);}
				result(null,{status: String(req.status)});
				return;
			}
		);
	}
};

module.exports = Test;
