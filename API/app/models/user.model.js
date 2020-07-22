const sql = require('./db.js');
const email = require('../service/emailService');

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
const getUser = (userId, result) => {
	sql.query(`SELECT * FROM user WHERE hmy = ${userId}`, (err, res) => {
		if (err) {
			console.log('error: ', err);
			if (result) {
				result(err, null);
			}
			return;
		}

		if (res.length) {
			console.log('found user: ', res[0]);
			if (result) {
				result(null, res[0]);
			}
			return res[0];
		}

		// not found user with the id
		if (result) {
			result({ message: 'No User' }, null);
		}
	});
};
user.getUser = getUser;

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

user.sendVerificationEmail = async (id, result) => {
	/*let htmlBody =
		'<div style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">';
	htmlBody +=
		'<img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:20% !important; width:20%; height:auto !important;" width="120" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/75379187249e0ae9/e8a778fe-17e6-4ffd-8cca-512c2e2e10e8/164x160.png">';
	htmlBody += '</div>';
	htmlBody +=
		'<div style="font-family: inherit; text-align: inherit; margin-left: 0px"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; font-family: verdana, geneva, sans-serif; color: #003e92">Greeting from Knowledge box,</span></div>';
	htmlBody += '<div style="font-family: inherit; text-align: inherit; margin-left: 0px"><br></div>';
	htmlBody +=
		'<div style="font-family: inherit; text-align: inherit; margin-left: 0px"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; font-family: verdana, geneva, sans-serif; color: #003e92">We are delighted to serve you with our Knowledge, Please verify and start learning.</span></div>';
	htmlBody += '<br>';
	htmlBody +=
		'<div align="center" bgcolor="#003e92" class="inner-div" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">';
	htmlBody +=
		'<a href="https://www.google.com" style="background-color:#003e92; border:1px solid #003e92; border-color:#003e92; border-radius:30px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Verify Email.</a>';
	htmlBody += '</div>';*/
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
		console.log("User or User's Email not found.");
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
	await email.sendEmail(msg, result);
};

module.exports = user;
