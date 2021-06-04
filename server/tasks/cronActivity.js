const express = require('express')
const mongoose = require('mongoose')
const cron = require('node-cron')
const User = mongoose.model('User')
const Activity = mongoose.model('Activity')
const { activityEmail } = require('../emails/activityEmail')
const userMsg = require('../constants/user')
const { permission } = require('../constants/user')
const { ADMIN, COLLABORATOR, SELLER, DISPATCHER, GUESS } = permission

/*
* * * * * *
| | | | | |
| | | | | day of week (3 = mercredi)
| | | | month (1 a 12)
| | | day of month 1 à 31
| | hour (0 à 23)
| minute (0 à 59)
second ( optional : 0 à 59 ) */

// cron.schedule('* * * * *', function () {
// 	console.log('running a task every minute')
// })

/** Tous les Lundi matin à 7h00 */
cron.schedule('0 0 7 * * 1', weeklyReportTask)

function weeklyReportTask() {
	User.find({ status: userMsg.status.ACTIVE, permission:{$not:{$eq:ADMIN}}})
		.select(['-__v', '-password']) //champs à retirer
		.then(users => {
			if(!users || users.length < 1) return

			users.forEach(user => {
				// console.log(user.email, user.permission)
				getActivitiesUser(user)
			})
		})
		.catch(err => console.log(err))
}

function getActivitiesUser(user) {
	const TODAY = new Date()
	const SEVEN_DAY_LATER = new Date(TODAY.getTime() + 7 * 24 * 60 * 60 * 1000)

	const query = {
		postedBy: user._id,
		date: {
			$gte: TODAY,
			$lt: SEVEN_DAY_LATER
		}
	}

	Activity.find(query)
		.populate({
			path: 'company',
			select: ['name']
		})
		.select(['-__v'])
		.sort({ date: 'asc' })
		.then(activities => {
			// console.log(user.email)
			activityEmail.weeklyReport(user, activities, TODAY, SEVEN_DAY_LATER)
		})
		.catch(err => console.log(err))
}
