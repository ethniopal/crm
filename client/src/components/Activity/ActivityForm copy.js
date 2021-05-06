import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import Axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'

// material form components
import Button from '../CustomButtons/Button.js'
import { FormControl, FormControlLabel, MenuItem, Checkbox, FormHelperText, TextareaAutosize } from '@material-ui/core'
import { Alert } from '@material-ui/lab/'
//popup
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
//custom component
import ReactHookFormSelect from '../Forms/element/ReactHookFormSelect'

import { isEmpty } from 'lodash'
import { useForm } from 'react-hook-form'

const token = localStorage.getItem('jwt')

const ActivityForm = ({ customer, activity, handleClose, handleOpenNotification }) => {
	const [isNegatif, setIsNegatif] = useState(activity?.isNegatif || false)
	const [typeInteraction, setTypeInteraction] = useState(activity?.interactionType || 'Un appel')
	const [typeResponse, setTypeResponse] = useState('')
	const [responsesMenuItems, setResponsesMenuItems] = useState([])
	// const [dateValue, onChangeDate] = useState(new Date())
	const [startDate, setStartDate] = useState(activity?.date ? new Date(activity?.date) : new Date())

	const [serverError, setServerError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

	useEffect(() => {
		const tempResponse = []

		if (['Un courriel'].includes(typeInteraction)) {
			tempResponse.push('Pas de réponse')
			tempResponse.push("En attente d'une réponse")
			tempResponse.push('Terminer')
		}
		if (['Un appel', 'Une vidéo-conférence'].includes(typeInteraction)) {
			tempResponse.push('Connecté')
			tempResponse.push('Pas de réponse')
			tempResponse.push('Occupé')
			tempResponse.push('Non planifier')
		}
		if (['Un appel'].includes(typeInteraction)) {
			tempResponse.push('Mauvais numéro')
			tempResponse.push('À laissé un message en directe')
			tempResponse.push('À laissé un message vocal')
		}

		if (['Un rendez-vous'].includes(typeInteraction)) {
			tempResponse.push('Annuler')
			tempResponse.push('Non planifier')
			tempResponse.push('À schéduler')
			tempResponse.push('Confirmer')
		}
		// console.log({ tempResponse })

		setResponsesMenuItems(tempResponse)
		setTypeResponse(activity?.typeResponse || tempResponse[0])
	}, [typeInteraction])

	const defaultValues = {
		interactionType: activity?.interactionType || 'Un appel',
		responseType: activity?.typeResponse || responsesMenuItems[0],
		date: activity?.date || '',
		descriptionResponse: activity?.descriptionResponse || '',
		isNegatif: activity?.isNegatif || false,
		descriptionResponseNegatif: activity?.descriptionResponseNegatif || ''
	}

	//gestion des erreurs
	const validations = {
		interactionType: { required: 'Vous devez faire une sélection' },
		responseType: { required: 'Vous devez faire une sélection' },
		descriptionResponse: {
			required: {
				value: true,
				message: 'Vous devez compléter ce champ'
			}
		},
		isNegatif: {},
		descriptionResponseNegatif: {}
	}

	const interactionTypeHandleChange = async e => {
		if (e.target.name === 'interactionTypeSelect') {
			// register({ name: e.target.name, value: e.target.value })
			await setTypeInteraction(e.target.value)
		} else {
			setTypeResponse(e.target.value)
		}
	}

	const isNegatifHandleChange = () => {
		setIsNegatif(!isNegatif)
	}

	//form validation
	const { register, handleSubmit, formState, setError, errors, clearErrors, control } = useForm({
		defaultValues,
		mode: 'onTouched'
	})
	const { isSubmitted } = formState

	//create customed
	const createActivityRequest = async postData => {
		const config = {
			method: 'post',
			url: `/api/customer/${customer._id}/activity`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			handleOpenNotification({ open: true, severity: 'success', message: data.message })
			handleClose()
		} else {
			handleOpenNotification({ open: true, severity: 'error', message: data.message })
			setServerError(data.message)
		}
		setIsSubmitSuccessful(data.success)
	}

	const updateActivityRequest = async postData => {
		const config = {
			method: 'put',
			url: `/api/activity/${activity._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res

		if (data.success) {
			handleOpenNotification({ open: true, severity: 'success', message: data.message })
			handleClose()
		} else {
			handleOpenNotification({ open: true, severity: 'error', message: data.message })
			setServerError(data.message)
		}
		setIsSubmitSuccessful(data.success)
	}

	//gestion du submit
	const onSubmit = async data => {
		data.date = startDate
		data.interactionType = typeInteraction
		data.typeResponse = typeResponse
		data.isNegatif = data.isNegatif ?? false
		data.descriptionResponseNegatif = data.isNegatif ? data.descriptionResponseNegatif : ''

		//save the datas
		try {
			if (!activity?._id) {
				await createActivityRequest(data)
			} else {
				await updateActivityRequest(data)
			}
		} catch (err) {
			setServerError(err)
		}
	}

	//si soumis correctement
	if (isSubmitSuccessful) {
	}

	return (
		<>
			<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle id="form-dialog-title">{activity ? 'Éditer' : 'Ajouter'} une activité</DialogTitle>
				<DialogContent>
					<DialogContentText>Veuillez complétez tous les champs obligatoire.</DialogContentText>
					{isSubmitted && !isEmpty(serverError) && (
						<Alert severity="error">
							<b dangerouslySetInnerHTML={{ __html: serverError }}></b>
						</Alert>
					)}
					<div className="fieldset">
						<div className="row">
							<div className="col-lg-12">
								<FormControl style={{ width: '100%' }} className="form-group">
									<label>
										Date et heure:
										<br />
										<DatePicker
											selected={startDate}
											onChange={date => {
												if (date) {
													clearErrors('date')
												} else {
													setError('date', {
														type: 'manual',
														message: "Veuillez inscrire la date et l'heure."
													})
												}
												return setStartDate(date)
											}}
											timeInputLabel="Heure:"
											dateFormat="yyyy/MM/dd H:mm"
											popperPlacement="bottom-start"
											showTimeInput
										/>
									</label>
									{errors.date && (
										<FormHelperText error={Boolean(errors.date)}>
											{errors.date.message}
										</FormHelperText>
									)}
								</FormControl>
							</div>
							<div className="col-lg-6">
								<ReactHookFormSelect
									id="interactionType"
									name="interactionType"
									style={{ width: '100%' }}
									className="form-group"
									label="Type d'intéraction"
									control={control}
									defaultValue="Un courriel"
									variant="outlined"
									margin="normal"
									value={typeInteraction}
									onChange={interactionTypeHandleChange}
								>
									<MenuItem value={'Un appel'}>Un appel</MenuItem>
									<MenuItem value={'Un courriel'}>Un courriel</MenuItem>
									<MenuItem value={'Un rendez-vous'}>Un rendez-vous</MenuItem>
									<MenuItem value={'Une vidéo-conférence'}>Une vidéo-conférence</MenuItem>
								</ReactHookFormSelect>

								{/* <FormControl style={{ width: '100%' }} className="form-group">
											<InputLabel id="interactionTypeLabel">Type d'intéraction</InputLabel>
											<Controller
												render={({ onChange, value, onBlur, name }) => (
													<Select
														labelId="interactionTypeLabel"
														// id="interactionType"
														// name="interactionType"
														inputRef={register(validations.interactionType)}
														// error={Boolean(errors.interactionType)}
														value={typeInteraction}
														name={name}
														onChange={e => {
															// onChange(e)

															interactionTypeHandleChange(e)
														}}
														labelId="responseTypeLabel"
													>
														<MenuItem value={'Un appel'}>Un appel</MenuItem>
														<MenuItem value={'Un courriel'}>Un courriel</MenuItem>
														<MenuItem value={'Un rendez-vous'}>Un rendez-vous</MenuItem>
														<MenuItem value={'Une vidéo-conférence'}>
															Une vidéo-conférence
														</MenuItem>
													</Select>
												)}
												name="interactionType"
												// defaultValue={typeInteraction}
												control={control}
												rules={register(validations.interactionType)}
												error={Boolean(errors.interactionType)}
											/>
										</FormControl> */}
							</div>

							<div className="col-lg-6">
								<ReactHookFormSelect
									id="typeResponse"
									name="typeResponse"
									style={{ width: '100%' }}
									className="form-group"
									label="Type de réponse"
									control={control}
									defaultValue=""
									variant="outlined"
									margin="normal"
									onChange={interactionTypeHandleChange}
									value={typeResponse}
								>
									{responsesMenuItems.map(item => (
										<MenuItem key={item} value={item}>
											{item}
										</MenuItem>
									))}
								</ReactHookFormSelect>
								{/* <Controller
												render={({ onChange, value, onBlur, name }) => (
													<Select
														value={typeResponse}
														name={name}
														onChange={e => {
															interactionTypeHandleChange(e)
														}}
														labelId="responseTypeLabel"
													>
														{responsesMenuItems.map(item => (
															<MenuItem key={item} value={item}>
																{item}
															</MenuItem>
														))}
													</Select>
												)}
												name="responseType"
												defaultValue={defaultValues.responseType}
												control={control}
												rules={register(validations.responseType)}
												error={Boolean(errors.responseType)}
											/> */}
							</div>

							<div className="col-md-12">
								<FormControl style={{ width: '100%' }} className="form-group">
									<TextareaAutosize
										id="descriptionResponse"
										name="descriptionResponse"
										aria-label="Description de la réponse"
										className="textareaAutosize"
										label="Description"
										rowsMin={5}
										defaultValue={defaultValues.descriptionResponse}
										placeholder="Inscrire une description de l'activité"
										ref={register(validations.descriptionResponse)}
									/>

									{errors.descriptionResponse && (
										<FormHelperText error={Boolean(errors.descriptionResponse)}>
											{errors.descriptionResponse.message}
										</FormHelperText>
									)}
								</FormControl>
							</div>

							<div className="col-md-12">
								<FormControl style={{ width: '100%' }} className="form-group">
									<FormControlLabel
										control={
											<Checkbox
												checked={isNegatif}
												onChange={e => {
													isNegatifHandleChange(e)
												}}
												name="isNegatif"
											/>
										}
										inputRef={register(validations.isNegatif)}
										label="Retour negatif?"
									/>
								</FormControl>
							</div>

							{isNegatif && (
								<div className="col-md-12">
									<FormControl style={{ width: '100%' }} className="form-group">
										<TextareaAutosize
											id="descriptionResponseNegatif"
											name="descriptionResponseNegatif"
											aria-label="Expliquer pourquoi ceci a été négatif"
											className="textareaAutosize"
											label="Description"
											rowsMin={5}
											defaultValue={defaultValues.descriptionResponseNegatif}
											placeholder="Inscrire une description de l'activité"
											ref={register(validations.descriptionResponseNegatif)}
										/>
										{errors.descriptionResponseNegatif && (
											<FormHelperText error={Boolean(errors.descriptionResponseNegatif)}>
												errors.descriptionResponseNegatif.message
											</FormHelperText>
										)}
									</FormControl>
								</div>
							)}
						</div>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="danger">
						Cancel
					</Button>
					<Button type="submit" color="info">
						{activity ? 'Mise à jour' : 'Ajouter'}
					</Button>
				</DialogActions>
			</form>
		</>
	)
}

export default ActivityForm
