const sgMail = require('@sendgrid/mail')
const keys = require('../keys')
const { SENDGRID_KEY, FROM_EMAIL } = require('../keys')
sgMail.setApiKey(SENDGRID_KEY)
const APP_URL = 'https://sotechcrm.herokuapp.com/'
const settingEmail = {
	from: FROM_EMAIL,
	signature: `<br><br>Ce courriel est un envoie automatisé, veuillez ne pas y répondre.`
}

function sendMail(msg) {
	msg.from = {
		email: msg.from,
		name: 'Sotech Nitram'
	}

	sgMail
		.send(msg)
		.then(response => {
			console.log('Email sent : ' + msg.subject)
		})
		.catch(error => {
			console.error(error)

			if (error.response) {
				// Extract error msg
				const { message, code, response } = error

				// Extract response msg
				const { headers, body } = response

				console.error(body)
			}
		})
}

module.exports = {
	settingEmail,
	sendMail
}
