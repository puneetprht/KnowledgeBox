const sql = require('./db.js');
const query = require('./db.service');

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
				xref.objReference = 'subject' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser having fuser = ${user.id} ) `
	}
	if(admin){
		SQL += ` where c.hmy in (select hmy from category) and s.objectType = 3 group by s.hmy `;
	}	else{
		SQL += ` where c.hmy in (${categories}) and s.objectType = 3 group by s.hmy `;
	}

	// console.log("Query:", SQL);
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
				xref.objReference = 'subject' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser having fuser = ${user.id} ) `
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
	IFNULL(st.isPaid, 0) as isPaid, st.amount as amount, IFNULL(st.isActive, 0) as isActive,
	IFNULL(s.isPaid, 0) as isParentPaid, s.amount as parentAmount `;
	if(user && user.id){
		SQL += ` ,CASE
		WHEN xref.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isBought`
		SQL += ` ,CASE
		WHEN xrefSuperParent.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isParentBought `
	}
	SQL += ` from test v
	right outer join subtopic st on st.hmy = q.fsubtopic
	inner join subject s on s.hmy = st.fsubject `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 3 and xref.objPointer = st.hmy and 
				xref.objReference = 'subtopic' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser  having fuser = ${user.id} ) `
		SQL += ` left outer join paymentxref xrefSuperParent on xrefSuperParent.objType = 2 and xrefSuperParent.objPointer = s.hmy and 
				xrefSuperParent.objReference = 'subject' and xrefSuperParent.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser having fuser = ${user.id} ) `;
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
	IFNULL(q.isPaid,0) as isPaid, q.amount as amount, IFNULL(q.isActive,0) as isActive,
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
				xref.objReference = 'test' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser having fuser = ${user.id} ) `;
		SQL += ` left outer join paymentxref xrefParent on xrefParent.objType = 2 and xrefParent.objPointer = st.hmy and 
				xrefParent.objReference = 'subtopic' and xrefParent.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser having fuser = ${user.id} ) `;
		SQL += ` left outer join paymentxref xrefSuperParent on xrefSuperParent.objType = 2 and xrefSuperParent.objPointer = s.hmy and 
				xrefSuperParent.objReference = 'subject' and xrefSuperParent.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser having fuser = ${user.id} ) `;
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

Test.getTestListById = (id, user, result) => {
	let SQL = '';
	SQL += ` select q.hmy as id,testname as value, q.duration as time, q.instructions as instructions,
	IFNULL(q.isPaid,0) as isPaid, q.amount as amount, IFNULL(q.isActive,0) as isActive `;
	SQL += ` from test q`;
	SQL += ` where q.hmy = ${id} `;

	sql.query(
		SQL,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}

			if (res.length) {
				res = JSON.parse(JSON.stringify(res).replace(/<br>/g,'\\n'));	
				result(null, res[0]);
				return;
			}

			result(null, null);
			return;
		}
	);
};

Test.addTest = (body, result) => {
	// console.log(body);
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
	// console.log(body);
	sql.query(
		`delete from Test
		where hmy = ${body.id}`,
		(err, res) => {
			if (err) {
				//console.log('error: ', err);
				result(err, null);
				return;
			}
			sql.query(
				`delete from testDetail
				where ftest = ${body.id}`,
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
			result(null, null);
			return;
		}
	);
};

Test.getTestDetail = (id, result) => {
	console.log("Test Id: ", id, ' Time: ', new Date());
	sql.query(
		`select qd.hmy as id, question, option1, option2, option3, option4, option5, explaination, correctOption, isMultiple,
		qd.negativeWeightage as negativeWeightage , qd.weightage as weightage, questionLang, 
		optionLang1, optionLang2, optionLang3, optionLang4, optionLang5, explainationLang,
		aq.hmy as questionAttachmentId, aq.attachmentUrl as questionAttachmentUrl,
		a1.hmy as optionAttachmentId1, a1.attachmentUrl as optionAttachmentUrl1,
		a2.hmy as optionAttachmentId2, a2.attachmentUrl as optionAttachmentUrl2,
		a3.hmy as optionAttachmentId3, a3.attachmentUrl as optionAttachmentUrl3,
		a4.hmy as optionAttachmentId4, a4.attachmentUrl as optionAttachmentUrl4,
		a5.hmy as optionAttachmentId5, a5.attachmentUrl as optionAttachmentUrl5,
		ae.hmy as expAttachmentId, ae.attachmentUrl as expAttachmentUrl,
		videoUrl, videoUrlId from testdetail qd
		inner join test q on q.hmy = qd.ftest
		left outer join attachment aq on qd.hmy = aq.fObjectDetail and aq.fOption = 7 and aq.objectType = 3 and aq.deleted = 0 
		left outer join attachment a1 on qd.hmy = a1.fObjectDetail and a1.fOption = 1 and a1.objectType = 3 and a1.deleted = 0
		left outer join attachment a2 on qd.hmy = a2.fObjectDetail and a2.fOption = 2 and a2.objectType = 3 and a2.deleted = 0
		left outer join attachment a3 on qd.hmy = a3.fObjectDetail and a3.fOption = 3 and a3.objectType = 3 and a3.deleted = 0
		left outer join attachment a4 on qd.hmy = a4.fObjectDetail and a4.fOption = 4 and a4.objectType = 3 and a4.deleted = 0
		left outer join attachment a5 on qd.hmy = a5.fObjectDetail and a5.fOption = 5 and a5.objectType = 3 and a5.deleted = 0
		left outer join attachment ae on qd.hmy = ae.fObjectDetail and ae.fOption = 8 and ae.objectType = 3 and ae.deleted = 0 
		where q.hmy = ${id} `,
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			let count = 1;
			if (res.length) {
				res = JSON.parse(JSON.stringify(res).replace(/<br>/g,'\\n'));	
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
					element.weightage = parseFloat(element.weightage || 0).toFixed(2);
					element.negativeWeightage = parseFloat(element.negativeWeightage || 0).toFixed(2);
					element.selectedAnswer = [];
					element.isMarked = false;
					element.isStar = false;
					element.time = 0;
					maxMarks += parseFloat(element.weightage || 0);
					element.maxMarks = maxMarks;
				});
				//console.log('Test Details :', res);
				result(null, res);
				return;
			}
			result(null, null);
			return;
		}
	);
};

Test.postTestAnswers = (testResult, result) => {
	// console.log(testResult);
	sql.query(
		`insert into testxref (ftest,fuser,score) value (${testResult.testId},${testResult.userId},${testResult.score})`,
		(err, data) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			// console.log(data.insertId);

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

Test.postTest = async (test, result) => {
	test = JSON.parse(JSON.stringify(test).replace(/\\n/g,'<br>'));	
	console.log(test);
	try{
		if (test.testId) {
			let data = await query.executeQuery(`update test SET testname = '${test.testName}', duration = ${test.testTime}, instructions = '${test.testInstructions}'	 where hmy = ${test.testId}`);
			console.log("Test Id: ", data.insertId || test.testId);
			//console.log("Questions to be saved:", test.questions);
			for (let question of test.questions) {
				try{
				console.log("Question processing:", question);
					if (question.id) {
						let sql = `update testdetail set question = ${toSqlString(question.question)},option1 = ${toSqlString(question.option1)},
						option2=${toSqlString(question.option2)},
							option3 = ${toSqlString(question.option3)}, option4 = ${toSqlString(question.option4)}, option5 = ${toSqlString(question.option5)}
							,correctoption = ${toSqlString(question.correctOption)},isMultiple = ${question.isMultiple} 
							,questionLang=${toSqlString(question.questionLang)},
							optionLang1=${toSqlString(question.optionLang1)},optionLang2=${toSqlString(question.optionLang2)},
							optionLang3=${toSqlString(question.optionLang3)}, optionLang4=${toSqlString(question.optionLang4)},
							optionLang5=${toSqlString(question.optionLang5)},
							weightage=${question.weightage},
							negativeWeightage=${question.negativeWeightage},videoUrl=${toSqlString(question.videoUrl)},
							videoUrlId=${toSqlString(question.videoUrlId)}, explaination=${toSqlString(
								question.explaination
							)}, explainationLang=${toSqlString(
								question.explainationLang
							)} where hmy = ${question.id}`;
						sql = sql.replace(/\n|\t/g,'');								
						await query.executeQuery(sql);
					} else {
							let sql = `insert into testdetail (ftest, fsubtopic, fsubject, fcategory, question, option1, option2,
								option3, option4, option5, correctoption, isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4, optionLang5, weightage, negativeWeightage,
								videoUrl, videoUrlId, explaination, explainationLang) values 
								(${data.insertId || test.testId}, ${test.subTopicId}, ${test.subjectId}, ${test.categoryId},
									${toSqlString(question.question)}, ${toSqlString(question.option1)}, ${toSqlString(question.option2)},
									${toSqlString(question.option3)}, ${toSqlString(question.option4)}, ${toSqlString(question.option5)},
									${toSqlString(question.correctOption)}, ${question.isMultiple}, '${question.questionLang}',
									'${question.optionLang1}', '${question.optionLang2}', '${question.optionLang3}', '${question.optionLang4}', ${toSqlString(question.optionLang5)},
									${question.weightage}, ${question.negativeWeightage}, '${question.videoUrl}', '${question.videoUrlId}', '${question.explaination}','${question.explainationLang}')`;
							sql = sql.replace(/\n|\t|\r/g,'');			
							let res = await query.executeQuery(sql);
							question.id = res.insertId;

							if(question.questionAttachmentId > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.questionAttachmentId}`);		
							}
							if(question.optionAttachmentId1 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId1}`);		
							}
							if(question.optionAttachmentId2 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId2}`);		
							}
							if(question.optionAttachmentId3 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId|| 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId3}`);		
							}
							if(question.optionAttachmentId4 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId4}`);		
							}
							if(question.optionAttachmentId5 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId5}`);		
							}
							if(question.expAttachmentId > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.expAttachmentId}`);		
							}
					}
				} catch (e) {
					console.error("Error:" + e + " \n in question: " + question)
				}
			}
			await deleteSaved(data.insertId || test.testId, test.questions);
			result(null, {id: data.insertId || test.testId});
			return;
		} else {
			let data = await query.executeQuery(`insert into test (testname,fsubtopic,fsubject,fcategory,duration, instructions ) values 
			('${test.testName}', ${test.subTopicId}, ${test.subjectId}, ${test.categoryId}, ${test.testTime}, '${test.testInstructions}')`);
			console.log("Test Id: ", data.insertId);
			//console.log("Questions to be saved:", test.questions);
			for (let question of test.questions) {
				try{
					console.log("Question processing:", question);
					let sql = `insert into testdetail (ftest, fsubtopic, fsubject, fcategory, question, option1, option2,
						option3, option4, option5, correctoption, isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4, optionLang5, 
						weightage, negativeWeightage,	videoUrl, videoUrlId, explaination, explainationLang) values 
						(${data.insertId}, ${test.subTopicId}, ${test.subjectId}, ${test.categoryId},
							${toSqlString(question.question)}, ${toSqlString(question.option1)}, ${toSqlString(question.option2)},
							${toSqlString(question.option3)}, ${toSqlString(question.option4)}, ${toSqlString(question.option5)},
							${toSqlString(question.correctOption)}, ${question.isMultiple}, '${question.questionLang}',
							'${question.optionLang1}', '${question.optionLang2}', '${question.optionLang3}', '${question.optionLang4}', ${toSqlString(question.optionLang5)},
							${question.weightage}, ${question.negativeWeightage}, '${question.videoUrl}', '${question.videoUrlId}', '${question.explaination}', '${question.explainationLang}')`;
					sql = sql.replace(/\n|\t|\r/g,'');			
					let res = await query.executeQuery(sql);
					question.id = res.insertId;

					if(question.questionAttachmentId > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.questionAttachmentId}`);		
					}
					if(question.optionAttachmentId1 > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId1}`);		
					}
					if(question.optionAttachmentId2 > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId2}`);		
					}
					if(question.optionAttachmentId3 > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId3}`);		
					}
					if(question.optionAttachmentId4 > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId4}`);		
					}
					if(question.optionAttachmentId5 > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId5}`);		
					}
					if(question.expAttachmentId > 0){
						let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
						fObjectDetail = ${question.id || 0} where hmy = ${question.expAttachmentId}`);		
					}
				} catch (e) {
					console.error("Error:" + e + " \n in question: " + question)
				}
			}
			await deleteSaved(data.insertId, test.questions);
			result(null, {id: data.insertId});
			return;
		}
	} catch (err){
		result(err, null);
		return;
	}
};

Test.postIsActive = (req, result) => {
	sql.query(
		`update ${req.table} set isActive = ${req.flag} where hmy = ${req.id}`,
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
		`update ${req.table} set isPaid = ${req.flag} where hmy = ${req.id}`,
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

Test.saveImage = async (object, result) => {
	console.log(object);
	try {
		if(object.deleted){
			let req = await query.executeQuery(`update attachment set deleted = 1 where  hmy = ${object.id}`);
			result(null, {status: String(req.status)});
		} else {
			let data = await query.executeQuery(`insert into attachment (attachmentUrl, attachmentId, attachmentName, objectType,
				fObject, fObjectDetail, fOption) value (${toSqlString(object.attachmentUrl)}, ${toSqlString(object.attachmentId)},
				${toSqlString(object.attachmentName)}, 3, ${toSqlString(object.parentId)}, ${toSqlString(object.questionId)}, 
				${toSqlString(object.option)})`);
			result(null, {url: String(object.attachmentUrl), id: data.insertId});
		}
		return;
	}
	catch (e) {
		console.log("error: ", e);
	}
};

const deleteSaved = async (id, testData) => {
	let inputIds = testData.map((q) => {return q.id});
	try {
	let data = await query.executeQuery(`select hmy from testdetail where ftest = ${id}`);
	let toDelete = data.map((q) => {return q.hmy}).filter(d => {return !inputIds.includes(d)});
	if(toDelete.length){
		toDelete.forEach(async (id) => {
			await query.executeQuery(`delete from testDetail where hmy = ${id}`);
			await query.executeQuery(`delete from attachment where fObjectDetail = ${id}`);
		})
	}
	return;
	}
	catch (e) {
		console.log("error: ", e);
	}
	finally {
		console.log("Test Details not deleted.");
	}
}

module.exports = Test;
