// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const mailClient = require('@sendgrid/mail');
const emailConfig = require('../../config/email.config');
const { response } = require('express');

mailClient.setApiKey(emailConfig.SENDGRID_API_KEY);

const email = function(email) {};

email.sendEmail = (msg, result) => {
	mailClient
		.send(msg)
		.then((response) => {
			console.log('Email sent successfully!');
			result(null, 'Verification Email sent.');
			return;
		})
		.catch((err) => {
			console.log('Error sending email.');
			result('Error sending Email.', null);
			return;
		});
};

module.exports = email;

/*let htmlBody = '<div style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">';
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
	'<a href="{{unique_name}}" style="background-color:#003e92; border:1px solid #003e92; border-color:#003e92; border-radius:30px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Verify Email.</a>';
htmlBody += '</div>';

const msg = {
	to: 'puneet1993@gmail.com',
	from: 'knowledge2020box@gmail.com',
	subject: 'Integration testing 2',
	text: 'and easy to do anywhere, even with Node.js',
	html: htmlBody
};

mailClient
	.send(msg)
	.then((response) => {
		console.log('Email sent successfully!');
	})
	.catch((err) => {
		console.log('Error sending email.');
	});
*/
