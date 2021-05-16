const sql = require('./db.js');

const Video = function(video) {};

Video.getAllSubjects = (categories, user, admin, result) => {
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
		SQL += ` left outer join paymentxref xref on xref.objType = 2 and xref.objPointer = s.hmy and 
				xref.objReference = 'subject' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `
	}
	if(admin){
		SQL += ` where c.hmy in (select hmy from category) and s.objectType = 2 group by s.hmy `;
	}	else{
		SQL += ` where c.hmy in (${categories}) and s.objectType = 2 group by s.hmy `;
	}
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

Video.getSubject = (Categoryid, user, result) => {
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
		SQL += ` left outer join paymentxref xref on xref.objType = 2 and xref.objPointer = s.hmy and 
				xref.objReference = 'subject' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `
	}
	SQL += ` where s.fcategory = ${Categoryid} and s.objectType = 2 group by s.hmy `;

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

Video.addSubject = (body, result) => {
	sql.query(
		`insert into  subject (subjectname, fcategory, objectType) 
		values ('${body.subjectName}',${body.categoryId}, 2 )`,
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

Video.deleteSubject = (body, result) => {
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

Video.getSubTopicList = (id, user, result) => {
	let SQL = '';
	SQL += ` select st.hmy as id,subtopic value,count(v.hmy) as count,
	st.isPaid as isPaid, st.amount as amount, st.isActive as isActive,
	s.isPaid as isParentPaid, s.amount as parentAmount `;
	if(user && user.id){
		SQL += ` ,CASE
		WHEN xref.status = 'SUCCESS' THEN 1
		ELSE 0
		END as isBought`
	}
	SQL += ` from video v
	right outer join subtopic st on st.hmy = v.fsubtopic
	inner join subject s on s.hmy = st.fsubject `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 2 and xref.objPointer = st.hmy and 
				xref.objReference = 'subtopic' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `
	}
	SQL += ` where st.fsubject = ${id}  group by st.hmy `;

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
				result(null, res);
				return;
			}

			result(null, null);
			return;
		}
	);
};

Video.getVideoList = (id, user, result) => {
	let SQL = '';
	SQL += ` select v.hmy as id,videoname as value, url as url, urlVideoId,
	v.isPaid as isPaid, v.amount as amount, v.isActive as isActive,
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
	SQL += ` from video v
	inner join subtopic st on st.hmy = v.fsubtopic
	inner join subject s on s.hmy = st.fsubject `;
	if(user && user.id){
		SQL += ` left outer join paymentxref xref on xref.objType = 2 and xref.objPointer = v.hmy and 
				xref.objReference = 'video' and xref.hmy in (select max(hmy) from paymentxref group by objtype,objpointer,objReference,fuser) `;
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

Video.postVideo = (body, result) => {
	//console.log(body);
	let urlVideoId = getQueryParams('v', body.videoUrl);
	if (!urlVideoId) {
		urlVideoId = body.videoUrl.split('.be/')[1];
	  }
	//console.log(urlVideoId);
	if (urlVideoId) {
		sql.query(
			`insert into video (videoname,url,fsubtopic,fsubject,fcategory,urlVideoId)
        value ('${body.videoName}', '${body.videoUrl}', ${body.subTopicId},${body.subjectId},${body.categoryId},'${urlVideoId}')`,
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
	} else {
		result('No Video Id detected.', null);
		return;
	}
};

Video.deleteVideo = (body, result) => {
	//console.log(body);
	sql.query(
		`delete from Video
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

Video.postIsActive = (req, result) => {
	//console.log("Query: ", req);
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

Video.postIsPaid = (req, result) => {
	// console.log("Query: ", req);
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

Video.postAmount = (req, result) => {
	console.log("Amount:", req);
	sql.query(
		`update ${req.table} set amount = ${parseInt(req.amount)} where hmy = ${req.id}`,
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

Video.postPaymentStatus = (req, result) => {
	if(req.table){
		/*switch(req.table){
			case 'subject':{
				sql.query(
					`insert into paymentxref (objType, objPointer ,objReference ,fuser ,amount , txId ,status ,message) 
					values (2, ${parseInt(req.objectId)}, '${String(req.table)}', ${req.userId}, '${String(req.txnId)}', 
					'${String(req.status)}', '${String(req.message)}')`,
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
			}
				break;
			case 'subtopic':{}
				break;
			case 'video':{}
				break;
		}*/
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

/*V/ideo.test = async (req, result) => {
	result = await sql.query(`select * from subject where fcategory = 24`);
};*/

const getQueryParams = (params, url) => {
	let href = url;
	//this expression is to get the query strings
	let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
	let queryString = reg.exec(href);
	return queryString ? queryString[1] : null;
};

module.exports = Video;
