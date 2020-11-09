const sql = require('./db.js');

const Video = function(video) {};

Video.getAllSubjects = (categories, result) => {
	console.log('categories:', categories);
	sql.query(
		`select s.hmy as id,concat(subjectname,'(',categoryname,')') as subject, 
		count(stp.hmy) as count, c.hmy as category from  subject s 
		left outer join subtopic stp on stp.fsubject = s.hmy
		inner join category c on c.hmy = s.fcategory where c.hmy in (${categories}) and s.objectType = 2 group by s.hmy`,
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

Video.getSubject = (Categoryid, result) => {
	sql.query(
		`select s.hmy as id,subjectname as subject,count(stp.hmy) as count, s.fcategory as category
		from subtopic stp 
		right outer join subject s on stp.fsubject = s.hmy 
		where s.fcategory = ${Categoryid} and s.objectType = 2 group by s.hmy `,
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

Video.getSubTopicList = (id, result) => {
	console.log('SubjectId: ', id);
	sql.query(
		`select st.hmy as id,subtopic value,count(v.hmy) as count from video v
		right outer join subtopic st on st.hmy = v.fsubtopic
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

Video.getVideoList = (id, result) => {
	sql.query(
		`select v.hmy as id,videoname as value, url as url, urlVideoId from video v
		inner join subtopic st on st.hmy = v.fsubtopic
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

Video.postVideo = (body, result) => {
	console.log(body);
	let urlVideoId = getQueryParams('v', body.videoUrl);
	if (urlVideoId) {
		urlVideoId = body.videoUrl.split('.be/')[1];
	  }
	console.log(urlVideoId);
	if (urlVideoId) {
		console.log('posting video data');
		sql.query(
			`insert into video (videoname,url,fsubtopic,fsubject,fcategory,fstate,urlVideoId)
        value ('${body.videoName}', '${body.videoUrl}', ${body.subTopicId},${body.subjectId},${body.categoryId},${body.stateId},'${urlVideoId}')`,
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
	console.log(body);
	sql.query(
		`delete from Video
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

const getQueryParams = (params, url) => {
	let href = url;
	//this expression is to get the query strings
	let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
	let queryString = reg.exec(href);
	return queryString ? queryString[1] : null;
};

module.exports = Video;
