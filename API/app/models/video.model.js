const sql = require('./db.js');

const Video = function(video) {};

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
