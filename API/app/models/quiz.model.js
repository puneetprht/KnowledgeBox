const sql = require('./db.js');
const query = require('./db.service');

const Quiz = function(quiz) {};

const toSqlString = (string) => {
	if (string) return `'${string.toString()}'`;
	else return null;
};

Quiz.getAllSubjects = (categories, admin, result) => {
	//console.log('categories:', categories);
	let SQL = `select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, subjectname as subjectName, categoryname as categoryName,
	count(stp.hmy) as count, c.hmy as category, IFNULL(s.isActive, 0) as isActive from  subject s 
	left outer join subtopic stp on stp.fsubject = s.hmy
	inner join category c on c.hmy = s.fcategory where `;

	if(admin){
		SQL += ` c.hmy in (select hmy from category) 	and s.objectType = 1 group by s.hmy`;
	}else{
		SQL += ` c.hmy in (${categories}) 	and s.objectType = 1 group by s.hmy`;
	}
	
	//console.log(SQL);
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

Quiz.getSubject = (Categoryid, result) => {
	sql.query(
		`select s.hmy as id,subjectname as subject, subjectname as subjectName, count(stp.hmy) as count, s.fcategory as category, IFNULL(s.isActive, 0) as isActive
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
		`select st.hmy as id,subtopic value,count(q.hmy) as count,
		IFNULL(st.isPaid, 0) as isPaid, st.amount as amount, IFNULL(st.isActive, 0) as isActive from quiz q
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
		`select q.hmy as id,quizname as value, q.duration as time,
		IFNULL(q.isPaid,0) as isPaid, q.amount as amount, IFNULL(q.isActive,0) as isActive from quiz q
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
	//console.log(body);
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
	//console.log(body);
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

Quiz.getQuizListById = (id, user, result) => {
	let SQL = '';
	SQL += ` select q.hmy as id, quizname as value, q.duration as time,
	IFNULL(q.isPaid,0) as isPaid, q.amount as amount, IFNULL(q.isActive,0) as isActive `;
	SQL += ` from quiz q`;
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

Quiz.getQuizDetail = (id, result) => {
	console.log("Quiz Id: ", id, ' Time: ', new Date());
	sql.query(
		`select qd.hmy as id,question , option1, option2, option3, option4, option5, explaination,correctOption, isMultiple,questionLang, 
		optionLang1, optionLang2, optionLang3, optionLang4, optionLang5, explainationLang,
		aq.hmy as questionAttachmentId, aq.attachmentUrl as questionAttachmentUrl,
		a1.hmy as optionAttachmentId1, a1.attachmentUrl as optionAttachmentUrl1,
		a2.hmy as optionAttachmentId2, a2.attachmentUrl as optionAttachmentUrl2,
		a3.hmy as optionAttachmentId3, a3.attachmentUrl as optionAttachmentUrl3,
		a4.hmy as optionAttachmentId4, a4.attachmentUrl as optionAttachmentUrl4,
		a5.hmy as optionAttachmentId5, a5.attachmentUrl as optionAttachmentUrl5,
		videoUrl, videoUrlId from quizdetail qd
		inner join quiz q on q.hmy = qd.fquiz
		left outer join attachment aq on qd.hmy = aq.fObjectDetail and aq.fOption = 7 and aq.objectType = 1 and aq.deleted = 0 
		left outer join attachment a1 on qd.hmy = a1.fObjectDetail and a1.fOption = 1 and a1.objectType = 1 and a1.deleted = 0
		left outer join attachment a2 on qd.hmy = a2.fObjectDetail and a2.fOption = 2 and a2.objectType = 1 and a2.deleted = 0
		left outer join attachment a3 on qd.hmy = a3.fObjectDetail and a3.fOption = 3 and a3.objectType = 1 and a3.deleted = 0
		left outer join attachment a4 on qd.hmy = a4.fObjectDetail and a4.fOption = 4 and a4.objectType = 1 and a4.deleted = 0
		left outer join attachment a5 on qd.hmy = a5.fObjectDetail and a5.fOption = 5 and a5.objectType = 1 and a5.deleted = 0
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
	// console.log(quizResult);
	sql.query(
		`insert into quizxref (fquiz,fuser,score) value (${quizResult.quizId},${quizResult.userId},${quizResult.score})`,
		(err, data) => {
			if (err) {
				console.log('error: ', err);
				result(err, null);
				return;
			}
			// console.log(data.insertId);

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

Quiz.postQuiz = async (quiz, result) => {
	quiz = JSON.parse(JSON.stringify(quiz).replace(/\\n/g,'<br>'));	
	console.log(quiz);
	try{
		if (quiz.quizId) {
			let data = await query.executeQuery(`update quiz SET quizname = '${quiz.quizName}', duration = ${quiz.quizTime} where hmy = ${quiz.quizId}`);
			console.log("Quiz Id:", data.insertId || quiz.quizId);
			console.log("Questions to be saved:", quiz.questions);
			for (let question of quiz.questions) {
				console.log("Question processing:", question);
				try{
					if (question.id) {
						let sql = `update quizdetail set question = ${toSqlString(question.question)},option1 = ${toSqlString(question.option1)},
										option2=${toSqlString(question.option2)},
									option3 = ${toSqlString(question.option3)}, option4 = ${toSqlString(question.option4)}, option5 = ${toSqlString(question.option5)}
									,correctoption = ${toSqlString(question.correctOption)},isMultiple = ${question.isMultiple} 
									,questionLang=${toSqlString(question.questionLang)},
									optionLang1=${toSqlString(question.optionLang1)},optionLang2=${toSqlString(question.optionLang2)},
									optionLang3=${toSqlString(question.optionLang3)}, optionLang4=${toSqlString(question.optionLang4)},
									optionLang5=${toSqlString(question.optionLang5)}, videoUrl=${toSqlString(question.videoUrl)},
									videoUrlId=${toSqlString(question.videoUrlId)}, explaination=${toSqlString(question.explaination)}, 
									explainationLang=${toSqlString(question.explainationLang)} where hmy = ${question.id}`;
						sql = sql.replace(/\n|\t/g,'');								
						let res = await query.executeQuery(sql);
					} else {
							let sql = `insert into quizdetail (fquiz, fsubtopic, fsubject, fcategory, question, option1, option2,
									option3, option4, option5, correctoption, isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4, optionLang5,
									videoUrl, videoUrlId, explaination, explainationLang) values 
									(${data.insertId || quiz.quizId}, ${quiz.subTopicId}, ${quiz.subjectId}, ${quiz.categoryId},
										${toSqlString(question.question)}, ${toSqlString(question.option1)}, ${toSqlString(question.option2)},
										${toSqlString(question.option3)}, ${toSqlString(question.option4)}, ${toSqlString(question.option5)},
										${toSqlString(question.correctOption)},${question.isMultiple},'${question.questionLang}',
										'${question.optionLang1}','${question.optionLang2}','${question.optionLang3}','${question.optionLang4}', ${toSqlString(question.optionLang5)},
										'${question.videoUrl}','${question.videoUrlId}','${question.explaination}','${question.explainationLang}')`;
							sql = sql.replace(/\n|\t|\r/g,'');			
							let res = await query.executeQuery(sql);
							question.id = res.insertId; 

							if(question.questionAttachmentId > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || test.testId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.questionAttachmentId}`);		
							}
							if(question.optionAttachmentId1 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || quiz.quizId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId1}`);		
							}
							if(question.optionAttachmentId2 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || quiz.quizId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId2}`);		
							}
							if(question.optionAttachmentId3 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || quiz.quizId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId3}`);		
							}
							if(question.optionAttachmentId4 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || quiz.quizId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId4}`);		
							}
							if(question.optionAttachmentId5 > 0){
								let att1 =  await query.executeQuery(`update attachment set fObject = ${data.insertId || quiz.quizId || 0 }, 
								fObjectDetail = ${question.id || 0} where hmy = ${question.optionAttachmentId5}`);		
							}
					}
				} catch (e) {
					console.error("Error:" + e + " \n in question: " + question)
				}
			}
			await deleteSaved(data.insertId || quiz.quizId, quiz.questions);
			result(null, {id: data.insertId || quiz.quizId});
			return;
		} else {
			let data = await query.executeQuery(`insert into quiz (quizname,fsubtopic,fsubject,fcategory,duration ) values 
											('${quiz.quizName}', ${quiz.subTopicId}, ${quiz.subjectId}, ${quiz.categoryId}, ${quiz.quizTime})`);
			console.log("Quiz Id:", data.insertId);
			console.log("Questions to be saved:", quiz.questions);
			for (let question of quiz.questions) {
				console.log("Question processing:", question);
				try{
					let sql = `insert into quizdetail (fquiz, fsubtopic, fsubject, fcategory, question, option1, option2,
						option3, option4, option5, correctoption, isMultiple, questionLang, optionLang1, optionLang2, optionLang3, optionLang4,
						optionLang5, videoUrl, videoUrlId, explaination, explainationLang) values 
						(${data.insertId}, ${quiz.subTopicId}, ${quiz.subjectId}, ${quiz.categoryId},
							${toSqlString(question.question)}, ${toSqlString(question.option1)}, ${toSqlString(question.option2)},
							${toSqlString(question.option3)}, ${toSqlString(question.option4)}, ${toSqlString(question.option5)},
							${toSqlString(question.correctOption)}, ${question.isMultiple}, '${question.questionLang}',
							'${question.optionLang1}', '${question.optionLang2}', '${question.optionLang3}', '${question.optionLang4}', ${toSqlString(question.optionLang5)},
							'${question.videoUrl}','${question.videoUrlId}','${question.explaination}','${question.explainationLang}')`;
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
				} catch (e) {
					console.error("Error:" + e + " \n in question: " + question)
				}
			}
			await deleteSaved(data.insertId, quiz.questions);
			result(null, {id: data.insertId});
			return;
		}
	} catch (err){
		result(err, null);
		return;
	}
};

const deleteSaved = async (id, quizData) => {
	let inputIds = quizData.map((q) => {return q.id});
	try {
	let data = await query.executeQuery(`select hmy from quizdetail where fquiz = ${id}`);
	let toDelete = data.map((q) => {return q.hmy}).filter(d => {return !inputIds.includes(d)});
	if(toDelete.length){
		toDelete.forEach(async (id) => {
			await query.executeQuery(`delete from quizDetail where hmy = ${id}`);
			await query.executeQuery(`delete from attachment where fObjectDetail = ${id}`);
		})
	}
	return;
	}
	catch (e) {
		console.log("error: ", e);
	}
	finally {
		console.log("Quiz Details not deleted.");
	}
}

Quiz.postIsActive = (req, result) => {
	console.log(`update ${req.table} set isActive = ${req.isActive} where hmy = ${req.id}`);
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

Quiz.postIsPaid = (req, result) => {
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

Quiz.postAmount = (req, result) => {
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

Quiz.saveImage = async (object, result) => {
	console.log(object);
	try {
		if(object.deleted){
			let req = await query.executeQuery(`update attachment set deleted = 1 where  hmy = ${object.id}`);
			result(null, {status: String(req.status)});
		} else {
			let data = await query.executeQuery(`insert into attachment (attachmentUrl, attachmentId, attachmentName, objectType,
				fObject, fObjectDetail, fOption) value (${toSqlString(object.attachmentUrl)}, ${toSqlString(object.attachmentId)},
				${toSqlString(object.attachmentName)}, 1, ${toSqlString(object.parentId)}, ${toSqlString(object.questionId)}, 
				${toSqlString(object.option)})`);
			result(null, {url: String(object.attachmentUrl), id: data.insertId});
		}
		return;
	}
	catch (e) {
		console.log("error: ", e);
	}
};

module.exports = Quiz;
