const express = require('express')
const mongoose = require('mongoose')
const Submission = mongoose.model('Submission')
const { downloadResource, getQuery } = require('../utils/utils')
const { permission, status: statusUser } = require('../constants/user')
const { submissionEmail } = require('../emails/submissionEmail')
const { ADMIN, COLLABORATOR, SELLER, DISPATCHER, GUESS } = permission
const submissionController = {}

// const { omit } = require('../utils/utils')

/** Récupère une liste de client selon un filtre
 *
 * @param {*} req
 * @param {*} res
 */
submissionController.getAll = async (req, res) => {
	const [query, limit, order, orderby, offset] = getQuery(req)
	const ejectedCompanyId = []

	const dateNow = new Date()
	if (req.query.time === 'past') {
		query.date = { $lte: dateNow }
		order = 'DESC'
		orderby = 'date'
	}

	if (req.query.time === 'incoming') {
		query.date = { $gte: dateNow }
		order = 'ASC'
		orderby = 'date'
	}

	query._id = { $nin: ejectedCompanyId }

	// if ([SELLER, DISPATCHER, GUESS].includes(req.user.permission) || req.query.myAttribution === 'true') {
	// 	query.attributions = { $in: [req.user._id] }
	// }

	Submission.find(query)
		.populate({
			path: 'postedBy',
			select: ['name']
		})
		.populate({
			path: 'customer'
		})
		.populate({
			path: 'contact'
		})
		.select(['-__v']) //champs à retirer
		.limit(limit)
		.skip(offset)
		.sort([[orderby, order]])
		.then(submissions => {
			res.json({ success: true, count: submissions.length, data: submissions })
		})
		.catch(err => console.log(err))
}

/** Récupère une liste de client selon un filtre
 *
 * @param {*} req
 * @param {*} res
 */
submissionController.getAllFromCustomer = async (req, res) => {
	const [query, limit, order, orderby, offset] = getQuery(req)
	const ejectedCompanyId = []

	const dateNow = new Date()
	if (req.query.time === 'past') {
		query.date = { $lte: dateNow }
		order = 'DESC'
		orderby = 'date'
	}

	if (req.query.time === 'incoming') {
		query.date = { $gte: dateNow }
		order = 'ASC'
		orderby = 'date'
	}

	query._id = { $nin: ejectedCompanyId }
	query.customer = req.params.idCustomer
	// if ([SELLER, DISPATCHER, GUESS].includes(req.user.permission) || req.query.myAttribution === 'true') {
	// 	query.attributions = { $in: [req.user._id] }
	// }

	Submission.find(query)
		.populate({
			path: 'postedBy',
			select: ['name']
		})
		.populate('customer')
		.populate('contact')
		.select(['-__v']) //champs à retirer
		.limit(limit)
		.skip(offset)
		.sort([[orderby, order]])
		.then(submissions => {
			res.json({ success: true, count: submissions.length, data: submissions })
		})
		.catch(err => console.log(err))
}

/** Récupère un client selon un ID
 *
 * @param {*} req
 * @param {*} res
 */
submissionController.getOne = (req, res) => {
	const idSubmission = req.params.idSubmission
	Submission.findOne({ _id: idSubmission })
		.select(['-__v']) //champs à retirer
		.populate('postedBy', '_id name')
		.populate('customer')
		.populate('contact')
		.then(data => {
			if (!data) {
				return res.status(404).json({
					success: false,
					message: "Cette page n'existe pas! "
				})
			}
			return res.json({ success: true, data: data })
		})
		.catch(err => {
			if (!mongoose.isValidObjectId(idSubmission)) {
				return res.status(404).json({
					success: false,
					message: "Cette page n'existe pas! "
				})
			}
			return res.status(500).json({
				success: false,
				errors: err,
				message: "Une erreur s'est produite"
			})
		})
}

/** Création d'un client selon un ID
 *
 * @param {*} req
 * @param {*} res
 */
submissionController.create = (req, res) => {
	const { customer, address, goods } = req.body

	if (
		!customer ||
		!goods ||
		!address.source.address ||
		!address.source.city ||
		!address.source.province ||
		!address.source.country ||
		!address.source.zip ||
		!address.destination.address ||
		!address.destination.city ||
		!address.destination.province ||
		!address.destination.country ||
		!address.destination.zip
	) {
		return res.status(422).json({ success: false, message: 'Merci de compléter tous les champs obligatoire.' })
	}
	req.body.goods.quantity = parseFloat(goods.quantity) || 0
	req.body.goods.totalWeight.weight = parseFloat(goods.totalWeight.weight) || 0

	const data = {
		...req.body,
		postedBy: req.user._id
	}

	const createSubmission = new Submission(data)

	try {
		createSubmission.save(function (err, savedData) {
			if (err) {
				return res.send({ success: false, errors: err, message: 'Un problème est survenu' })
			}

			//success
			return res.json({
				success: true,
				data: {
					_id: savedData._id
				},
				message: 'La soumission a été créé avec succès!'
			})
		})
	} catch (err) {
		return res.json({ success: false, errors: err, message: 'Un problème est survenu' })
	}
}

/** Mise à jour d'un client selon un ID
 *
 * @param {*} req
 * @param {*} res
 */
submissionController.update = (req, res) => {
	const { customer, address, goods } = req.body
	const idSubmission = req.params.idSubmission

	if (
		!idSubmission ||
		!customer ||
		!goods ||
		!address.source.address ||
		!address.source.city ||
		!address.source.province ||
		!address.source.country ||
		!address.source.zip ||
		!address.destination.address ||
		!address.destination.city ||
		!address.destination.province ||
		!address.destination.country ||
		!address.destination.zip
	) {
		return res.status(422).json({ success: false, message: 'Merci de compléter tous les champs obligatoire.' })
	}
	req.body.goods.quantity = parseFloat(goods.quantity) || 0
	req.body.goods.totalWeight.weight = parseFloat(goods.totalWeight.weight) || 0

	const data = {
		...req.body,
		updatedBy: req.user._id
	}
	try {
		Submission.findOneAndUpdate({ _id: idSubmission }, { $set: data }, { new: true })
			.then(updatedData => {
				return res.json({
					success: true,
					message: `La soumission de (${updatedData.address.source.city},${updatedData.address.source.province}) -> (${updatedData.address.destination.city},${updatedData.address.destination.province})  a été correctement sauvegardé`
				})
			})
			.catch(err => {
				if (!mongoose.isValidObjectId(idSubmission)) {
					return res.status(404).json({ success: false, error: err, message: "Cette page n'existe pas!" })
				}
				return res.status(500).json({ success: false, errors: err, message: "Une erreur s'est produite" })
			})
	} catch (err) {
		return res.status(500).json({ success: false, errors: err, message: 'Un problème est survenu' })
	}
}

/**Suprime un client selon un ID
 *
 * @param {*} req
 * @param {*} res
 */
submissionController.delete = (req, res) => {
	const idSubmission = req.params.idSubmission

	if (!idSubmission) {
		return res.status(404).json({ success: false, message: "Cette page n'existe pas!" })
	}

	Submission.findByIdAndDelete({ _id: idSubmission }, async (err, docs) => {
		if (err) {
			return res.status(403).json({ success: false, errors: err, message: 'Opération interdite' })
		}

		return res.json({
			success: true,
			message: `La soumission a été supprimé.`
		})
	})
}

module.exports = {
	submissionController
}
