import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datetime-picker'

import { makeStyles } from '@material-ui/core/styles'
//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
// form components
import Button from 'components/CustomButtons/Button.js'
import { FormControl, FormControlLabel, MenuItem, Checkbox, FormHelperText, TextareaAutosize } from '@material-ui/core'

import ReactHookFormSelect from './element/ReactHookFormSelect'
//popup
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

//icons
import { Add } from '@material-ui/icons'

import { useForm, Controller } from 'react-hook-form'

//css
const styles = {
	cardCategoryWhite: {
		color: 'rgba(255,255,255,.62)',
		margin: '0',
		fontSize: '14px',
		marginTop: '0',
		marginBottom: '0'
	},
	cardTitleWhite: {
		color: '#FFFFFF',
		marginTop: '0px',
		minHeight: 'auto',
		fontWeight: '300',
		fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
		marginBottom: '3px',
		textDecoration: 'none'
	}
}

const useStyles = makeStyles(styles)

const ActivityForm = () => {
	const [open, setOpen] = useState(false)
	const [isNegatif, setIsNegatif] = useState(false)
	const [typeInteraction, setTypeInteraction] = useState('Un appel')
	const [typeResponse, setTypeResponse] = useState('')
	const [responsesMenuItems, setResponsesMenuItems] = useState([])
	const [dateValue, onChangeDate] = useState(new Date())

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
			tempResponse.push('Non planfier')
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
		setTypeResponse(tempResponse[0])
	}, [typeInteraction])

	const defaultValues = {
		interactionType: 'Un appel',
		responseType: responsesMenuItems[0],
		date: '',
		descriptionResponse: '',
		isNegatif: false,
		descriptionResponseNegatif: ''
	}

	//gestion des erreurs
	const validations = {
		interactionType: { required: 'Vous devez faire une sélection' },
		responseType: { required: 'Vous devez faire une sélection' },
		date: { required: 'Vous devez compléter ce champ' },
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
		console.log('entré', e.target)
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

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	//form validation
	const { register, handleSubmit, formState, errors, control } = useForm({
		defaultValues,
		mode: 'onTouched'
	})
	const { isSubmitting, isSubmitted, isSubmitSuccessful } = formState

	//gestion du submit
	const onSubmit = data => {
		data.interactionType = typeInteraction
		data.typeResponse = typeResponse
		data.isNegatif = data.isNegatif ?? false
		data.descriptionResponseNegatif = data.isNegatif ? data.descriptionResponseNegatif : ''
		console.log(data)
	}

	//si soumis correctement
	if (isSubmitSuccessful) {
		console.log('succes')
	}

	const classes = useStyles()

	var dateNow = new Date()
	var day = dateNow.getDate().toString().padStart(2, '0')
	var month = (1 + dateNow.getMonth()).toString().padStart(2, '0')
	var hour = dateNow.getHours().toString().padStart(2, '0')
	var minute = dateNow.getMinutes().toString().padStart(2, '0')
	// var sec = dateNow.getSeconds().toString().padStart(2, "0")
	// var ms = dateNow.getMilliseconds().toString().padStart(3, "0")
	var inputDate = `${dateNow.getFullYear()}-${month}-${day}T${hour}:${minute}`

	// const responseItems = responses.forEach(item => console.log(item + '1'))

	return (
		<Card style={{ width: '100%' }}>
			<div className="justify-content-end row">
				<Button
					variant="contained"
					color="transparent"
					onClick={handleClickOpen}
					startIcon={<Add />}
					style={{ marginRight: 20, marginBottom: 20 }}
				>
					Ajouter une activité
				</Button>
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
						<DialogTitle id="form-dialog-title">Nouvelle activitée</DialogTitle>
						<DialogContent>
							<DialogContentText>Veuillez complétez tous les champs obligatoire.</DialogContentText>

							<div className="fieldset">
								<div className="row">
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

									<div className="col-lg-12">
										<FormControl style={{ width: '100%' }} className="form-group">
											<DatePicker onChange={onChangeDate} value={dateValue} />
											{/* <Controller
												name="datetime"
												control={control}
												render={({ onChange, value }) => (
												)}
											/> */}
										</FormControl>
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
								Ajouter
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			</div>
			<CardHeader color="info">
				<h4 className={classes.cardTitleWhite}>Activités</h4>
				<p className={classes.cardCategoryWhite}>Liste des activités associé à ce client</p>
			</CardHeader>
			<CardBody>
				<div className="row">
					<div className="col-lg-12">
						<p>List</p>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default ActivityForm
