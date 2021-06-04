const { settingEmail, sendMail } = require('./config')
const striptags = require('striptags')
const { getFormatDate, getFormatDateFull } = require('../utils/utils')

const activityEmail = {}

activityEmail.weeklyReport = (user, data, dateStart, dateEnd) => {
	const weekStart = getFormatDate(dateStart)
	const weekEnd = getFormatDate(dateEnd)

	const style = `
	<style type="text/css">
		table {
		border-spacing: 0;
	  }
	  
	  table td {
		border-collapse: collapse;
		border:1px solid #dbdbdb;
	  }

	  tr, td{
		padding:15px;
		vertical-align:middle;
	  }

	  tr:nth-child(odd){
		  background:#ededed;
	  }
	</style>
	`

	msg = {
		from: settingEmail.from,
		to: user.email,
		subject: `[CRM] Rapport activité de la semaine DU ${weekStart} AU ${weekEnd}`,
		html: `${style}<p>Bonjour ${user.name}, <br>
		Voici les activitées prévues de la semaine.</p>

		${showActivityTable(data)}

		${settingEmail.signature}`
	}

	msg.text = striptags(msg.html)

	sendMail(msg)
}

function showActivityTable(data) {
	if (!data || data.length == 0) return '<p>Aucune activité prévu pour la semaine</p>'
	return `<table>
		<tr>
			<th>Date</th>
			<th>Entreprise</th>
			<th>Type</th>
			<th>Réponse</th>
			<th>Description</th>
			<th>Description Négative</th>
		</tr>
		${data.map(item => activityRowData(item)) || ''}
	</table>`
}

function activityRowData(rowData) {
	return `<tr style="${rowData.isNegatif && 'color:red'}">
		<td>${getFormatDateFull(rowData.date)}</td>
		<td>${rowData.company.name}</td>
		<td>${rowData.interactionType}</td>
		<td>${rowData.typeResponse}</td>
		<td>${rowData.descriptionResponse}</td>
		<td>${rowData.descriptionResponseNegatif}</td>
	</tr>`
}

module.exports = {
	activityEmail
}
