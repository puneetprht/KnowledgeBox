const sql = require('./db.js');

// constructor
const state = function(state) {
	this.id = state.id;
	this.StateId = state.StateId;
    this.name = state.name;
    this.image = state.image;
    this.imagebnw = state.imagebnw;
};

//GetUser should fetch details for the logged in user.
state.getState = (id, result) => {
	sql.query(`SELECT * FROM state WHERE hmy = ${id}`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}

		if (res.length) {
			//console.log('found user: ', res[0]);
			result(null, res[0]);
			return;
		}

		// not found user with the id
		result({ message: 'No User' }, null);
	});
};

state.getAllStateForId = (id, user, result) => {
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

state.remove = (id, result) => {
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

state.removeAll = (result) => {
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

module.exports = state;
