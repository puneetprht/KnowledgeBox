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

Video.addVideo = (body, result) => {
	console.log(body);
	sql.query(
		`insert into video (videoname,url,fsubtopic,fsubject,fcategory,fstate)
        value ('First Video', 'https://www.youtube.com/watch?v=8NyP_XzqgGA', 1,1,1,1)`,
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

module.exports = Video;
