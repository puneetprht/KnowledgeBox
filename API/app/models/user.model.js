const sql = require('./db.js');

// constructor
const user = function(user) {
	this.email = user.email;
	this.firstname = user.firstname;
	this.active = user.admin;
};

//create user while authentication.
user.create = (newuser, result) => {
	sql.query('INSERT INTO users SET ?', newuser, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}

		console.log('created user: ', { id: res.insertId, ...newuser });
		result(null, { id: res.insertId, ...newuser });
	});
};

user.getUserState = (userId, result) => {
	var query = 'select s.stateId from state s inner join statexref sx on sx.fstate = s.hmy';
	(query += ' inner join user u on u.hmy = sx.fuser where sx.fuser = ' + userId),
		sql.query(query, (err, res) => {
			if (err) {
				console.log('error: ', err);
				result(null, err);
				return;
			}

			result(null, res);
		});
};

//GetUser should fetch details for the logged in user.
user.getUser = (userId, result) => {
	sql.query(`SELECT * FROM user WHERE hmy = ${userId}`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}

		if (res.length) {
			console.log('found user: ', res[0]);
			result(null, res[0]);
			return;
		}

		// not found user with the id
		result({ message: 'No User' }, null);
	});
};

user.updateById = (id, user, result) => {
	sql.query(
		'UPDATE users SET email = ?, name = ?, active = ? WHERE id = ?',
		[ user.email, user.name, user.active, id ],
		(err, res) => {
			if (err) {
				console.log('error: ', err);
				result(null, err);
				return;
			}

			if (res.affectedRows == 0) {
				// not found user with the id
				result({ kind: 'not_found' }, null);
				return;
			}

			console.log('updated user: ', { id: id, ...user });
			result(null, { id: id, ...user });
		}
	);
};

user.remove = (id, result) => {
	sql.query('DELETE FROM users WHERE id = ?', id, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(null, err);
			return;
		}

		if (res.affectedRows == 0) {
			// not found user with the id
			result({ kind: 'not_found' }, null);
			return;
		}

		console.log('deleted user with id: ', id);
		result(null, res);
	});
};

user.removeAll = (result) => {
	sql.query('DELETE FROM users', (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(null, err);
			return;
		}

		console.log(`deleted ${res.affectedRows} users`);
		result(null, res);
	});
};

module.exports = user;
