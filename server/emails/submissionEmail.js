const { settingEmail, sendMail } = require('./config')
const striptags = require('striptags')

const submissionEmail = {}

submissionEmail.newCustomer = (to, data) => {
	msg = {
		from: settingEmail.from,
		to: to.map(item => item.email),
		subject: `[CRM] Nouvelle soumission`,
		html: `Bonjour, <br>
		Vous recevez ce courriel car une nouvelle a été ajouté dans le CRM. <br>
		Voici les informations de celle-ci. À tout moment vous pouvez modifier ces informations via le CRM si désiré.

		<h3>Informations Entreprise</h3>
		<b>Nom</b> : ${data.name || ''} <br>
		<b>Courriel</b> : ${data.email || ''} <br>
		<b>Site web</b> : ${data.website || ''}<br>
		<b>Adresse</b>: <br>
		    <b>Rue</b>: ${data.address.address || ''}<br>
			<b>Ville</b>: ${data.address.city || ''}<br>
			<b>Province</b>: ${data.address.province || ''}<br>
			<b>Pays</b>: ${data.address.country || ''}<br>
			<b>Code Postal</b>: ${data.address.zip || ''}<br>
		<b>Téléphone</b>: ${data.phone.phone || ''} <b>Ext.</b>: ${data.phone.ext || ''}<br>
		<b>Cellulaire</b>: ${data.phone.cellulaire || ''}<br>

		<h3>Informations contact principal</h3>
		<b>Nom</b> : ${data.mainContact.name || ''} <br>
		<b>Courriel</b> : ${data.mainContact.email || ''} <br>
		<b>Poste</b> : ${data.mainContact.function || ''} <br>
		<b>Téléphone</b>: ${data.mainContact.phone.phone || ''} <b>Ext.</b>: ${data.mainContact.phone.ext || ''}<br>
		<b>Cellulaire</b>: ${data.mainContact.phone.cellulaire || ''}<br>

		${settingEmail.signature}`
	}

	msg.text = striptags(msg.html)
	sendMail(msg)
}

module.exports = {
	submissionEmail
}
