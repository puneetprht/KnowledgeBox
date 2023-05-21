const sql = require('./db.js');
// const email = require('../service/emailService');

// constructor
const user = function(user) {
	this.email = user.email;
	this.firstname = user.firstname;
	this.active = user.admin;
};

//GetUser should fetch details for the logged in user.
const getUser = (userId, result) => {
	sql.query(`SELECT hmy as id, firstname, lastname, email, password, phone, 
	isAdmin, password, stateId, referralCode, walletAmount FROM user WHERE hmy = ${userId}`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}
		if (res.length) {
			// console.log('found user: ', res[0]);
			result(null, res[0]);
			return;
		}
		result(null, null);
	});
};
user.getUser = getUser;

const getUserDetail = (userId, result) => {
	sql.query(`SELECT u.hmy as id, u.firstname, u.lastname, u.email, u.password, u.phone, 
	u.isAdmin, u.stateId, u.referralCode, u.walletAmount, sum(referralAmount) as TotalReferral, sum(referralAmount) - u.walletAmount as paid 
    FROM user u 
    left outer join paymentxref px on px.freferraluser = u.hmy
    WHERE u.hmy = ${userId}
    group by px.freferraluser;`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}
		if (res.length) {
			// console.log('found user: ', res[0]);
			result(null, res[0]);
			return;
		}
		result(null, null);
	});
};
user.getUserDetail = getUserDetail;

const getUserList = (limit, offset, search, result) => {
	limit = limit || 10;
	offset = offset || 0;

	let where = search ? ` where (firstname like '%${search}%' or lastname like '%${search}%' or email like '%${search}%' or phone like '%${search}%') ` : '';

	console.log(`SELECT hmy as id, firstname, lastname, email, password, phone, 
	isAdmin, stateId, referralCode, walletAmount FROM user ${where} limit ${limit} offset ${offset}`);
	sql.query(`SELECT hmy as id, firstname, lastname, email, password, phone, 
	isAdmin, stateId, referralCode, walletAmount FROM user ${where} limit ${limit} offset ${offset}`, (err, res) => {
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
	});
};
user.getUserList = getUserList;

user.deleteUser = (body, result) => {
	//console.log(body);
	sql.query(
		`delete from user
		where hmy = ${body.id || body.Id}`,
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

const getUserByEmail = async (userEmail) => {
	sql.query(`SELECT hmy as id, firstname, lastname, email, password, phone, isAdmin, password, stateId, referralCode, walletAmount FROM user WHERE email = '${userEmail}'`, (err, res) => {
		if (err) {
			result(err, null);
			return;
		}
		if (res.length) {
			// console.log('found user: ', res[0]);
			if (result) {
				result(null, res[0]);
			}
			return res[0];
		}
		result(null, null);
	});
};
user.getUserByEmail = getUserByEmail;

user.registerUser = async (user, result) => {
	try {
		let userFetch = {};
		console.log(user);
		sql.query(`SELECT * FROM user WHERE email = '${user.email}'`, (err, res) => {
			if (err) {
				result(err, null);
				return;
			}
			let userFetch = res[0];
			if (userFetch) {
				result({ message: 'Email already registered!' }, null);
				return;
			}
			sql.query(
				`INSERT INTO user (firstname, lastname, email, password, phone, isAdmin, referralcode) values ('${user.firstName}',
				'${user.lastName}','${user.email}','${user.password}','${user.phoneNumber}', 0, CONCAT("K", FLOOR(RAND()*99), SUBSTR(UPPER('${user.firstName}'),1,1), SUBSTR(UPPER('${user.lastName}'),1,1)))`,
				(err, res) => {
					if (err) {
						console.log('error: ', err);
						result(err, null);
						return;
					}

					console.log('created user: ', { hmy: res.insertId, id: res.insertId, ...user });
					result(null, { hmy: res.insertId, id: res.insertId, ...user, isAdmin: 0 });
					return;
				}
			);
		});
	} catch (error) {
		result(error, null);
		return;
	}
};

user.updateUser = async function (user, result) {
	try {
		console.log(user);
		console.log(`update user set firstname = '${user.firstName || user.firstname}', lastname = '${user.lastName || user.lastname}', phone='${user.phone || 0}', isAdmin=${user.isAdmin || 0} 
		where hmy = ${user.id}`);
		sql.query(
			`update user set firstname = '${user.firstName || user.firstname}', lastname = '${user.lastName || user.lastname}', phone='${user.phone || 0}', isAdmin=${user.isAdmin||0} 
			where hmy = ${user.id}`,
			(err, res) => {
				if (err) {
					console.log('error: ', err);
					result(err, null);
					return;
				}
				console.log('Updated user: ', { hmy: res.insertId, ...user });
				result(null, { hmy: res.insertId, ...user, isAdmin: 0 });
				return;
			}
		);
	} catch (error) {
		result(error, null);
		return;
	}
};

user.payUser = async function (user, result) {
	try {
		console.log(user);
		sql.query(
			`update user set walletamount= ${user.amountleft || 0} 
			where hmy = ${user.id}`,
			(err, res) => {
				if (err) {
					console.log('error: ', err);
					result(err, null);
					return;
				}
				console.log('Updated user: ', { hmy: res.insertId, ...user });
				result(null, { hmy: res.insertId, ...user, isAdmin: 0 });
				return;
			}
		);
	} catch (error) {
		result(error, null);
		return;
	}
};

user.authenticateUser = async (user, result) => {
	try {
		let userFetch = {};
		console.log(user);
		sql.query(
			`SELECT hmy as id, firstname, lastname, email, password, phone, isAdmin, password, stateId, referralCode, walletAmount FROM user WHERE email = '${user.email}'`,
			(err, res) => {
				if (err) {
					result(err, null);
					return;
				}
				let userFetch = res[0];
				console.log(userFetch);
				if (userFetch && userFetch.password === user.password) {
					delete user.password;

					result(null, userFetch);
					return;
				}
				result({ message: 'Email/Password is wrong!' }, null);
				return;
			}
		);
	} catch (error) {
		result(error, null);
		return;
	}
};

//create user while authentication.
user.create = (newuser, result) => {
	sql.query('INSERT INTO users SET ?', newuser, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}

		//console.log('created user: ', { id: res.insertId, ...newuser });
		result(null, { id: res.insertId, ...newuser });
	});
};

user.postUserState = async (user, result) => {
	try {
		console.log(user);
		sql.query(
			`update user SET stateId = ${user.stateId} WHERE hmy = '${user.userId}'`,
			(err, res) => {
				if (err) {
					result(err, null);
					return;
				}
				result(null, null);
				return;
			}
		);
	} catch (error) {
		result(error, null);
		return;
	}
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

			//console.log('updated user: ', { id: id, ...user });
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

		//console.log('deleted user with id: ', id);
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

		//console.log(`deleted ${res.affectedRows} users`);
		result(null, res);
	});
};

user.sendVerificationEmail = async (id, result) => {
	let user = {};
	await getUser(id, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(null, err);
			return;
		}
		user = res;
	});

	//console.log(user);
	if (!user || !user.email) {
		//console.log("User or User's Email not found.");
		result("User or User's Email not found.", null);
		return;
	}

	let htmlBody =
		'<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account. </div>\
    <table border="0" cellpadding="0" cellspacing="0" width="100%">\
        <tr>\
            <td bgcolor="#003e92" align="center">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#003e92" align="center" style="padding: 0px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\
                            <h1 style="font-size: 28px; font-weight: 400; margin: 2; color: #003e92">Greetings from Knowledge box!</h1> <img src="http://cdn.mcauto-images-production.sendgrid.net/75379187249e0ae9/e8a778fe-17e6-4ffd-8cca-512c2e2e10e8/164x160.png" width="125" height="120" style="display: block; border: 0px;" />\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;color: #003e92">We are delighted to serve you with our Knowledge, Please verify and start learning.</p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left">\
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
                                <tr>\
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">\
                                        <table border="0" cellspacing="0" cellpadding="0">\
                                            <tr>\
                                                <td align="center" style="border-radius: 30px;" bgcolor="#003e92"><a href="https://www.google.com" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 30px; border: 1px solid #003e92; display: inline-block;">Verify Email</a></td>\
                                            </tr>\
                                        </table>\
                                    </td>\
                                </tr>\
                            </table>\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
    </table>';

	const msg = {
		to: user.email,
		from: 'knowledge2020box@gmail.com',
		subject: 'User email verification!',
		html: htmlBody
	};
	// await email.sendEmail(msg, result);
};

user.verifyCoupon = (code, result) => {
	sql.query(`select isPercent, amount, amount as percent, 'coupon' as type, hmy as id from couponcode where isActive = 1 and couponcode = '${code}'`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(null, err);
			return;
		}

		result(null, res[0]);
	});
};

user.verifyReferral = (code, result) => {
	sql.query(`select isPercent, amount, percent, 'referral' as type, (select hmy from user where referralCode = '${code}') as id from config where 1 = (select 1 from user where referralCode = '${code}')`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(null, err);
			return;
		}

		result(null, res[0]);
	});
};
module.exports = user;
