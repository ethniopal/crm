import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import Button from 'components/CustomButtons/Button.js'
//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
import CardFooter from 'components/Card/CardFooter.js'
import { Toast } from 'primereact/toast'
import { Alert } from '@material-ui/lab/'
import {
	deadlinesTxt,
	typeTransportTxt,
	typeMarchandiseTxt,
	infoTransportTxt,
	infoRemorqueTxt
} from '../../variables/submission.js'

// form components
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
	TextField,
	InputLabel,
	FormControl,
	FormControlLabel,
	MenuItem,
	FormHelperText,
	Select,
	Radio,
	RadioGroup,
	TextareaAutosize
} from '@material-ui/core'

import AddressPartialForm from './AddressPartial'
import { useForm, Controller } from 'react-hook-form'

import { regexEmail } from '../../variables/regex'
import { isEmpty } from 'lodash'
// import faker from 'faker/locale/fr_CA'
// faker.locale = 'fr_CA'
//css
const token = localStorage.getItem('jwt')

const styles = {
	card: {
		marginBottom: '90px'
	},
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
	},
	unitWeight: {
		height: '56px',
		flex: '1 0 auto'
	},
	dimensions: {
		flex: '1 0 auto'
	}
}
const useStyles = makeStyles(styles)

const SubmissionForm = props => {
	const classes = useStyles()
	const toast = useRef(null)

	const [isLoaded, setIsLoaded] = React.useState(false)
	const [submission, setSubmission] = React.useState(null)
	const [customers, setCustomers] = React.useState([])
	const [contacts, setContacts] = React.useState([])
	const [client, setClient] = React.useState(null)
	const [contact, setContact] = React.useState('')
	const [isNewCustomer, setIsNewCustomer] = React.useState(false)

	const [defaultValues, setDefaultValues] = useState({
		typeTransport: submission?.typeTransport || typeTransportTxt.FLT,
		customer: submission?.customer || '',
		contact: submission?.contact || '',
		address: {
			source: {
				address: submission?.address?.source?.address || '',
				city: submission?.address?.source?.city || '',
				province: submission?.address?.source?.province || '',
				country: submission?.address?.source?.country || '',
				zip: submission?.address?.source?.zip || '',
				date: submission?.address?.source?.date || ''
			},
			destination: {
				address: submission?.address?.destination?.address || '',
				city: submission?.address?.destination?.city || '',
				province: submission?.address?.destination?.province || '',
				country: submission?.address?.destination?.country || '',
				zip: submission?.address?.destination?.zip || '',
				date: submission?.address?.destination?.date || ''
			}
		},
		deadlinesState: submission?.deadlinesState || deadlinesTxt.REGULIER,
		requestedService: {
			requestedService: submission?.requestedService?.requestedService || '',
			typeService: submission?.requestedService?.typeService || '',
			typeApplication: submission?.requestedService?.typeApplication || '',
			incoterms: submission?.requestedService?.incoterms || '',
			typeShipment: submission?.requestedService?.typeShipment || '',
			typeEquipment: submission?.requestedService?.typeEquipment || ''
		},
		goods: {
			transport: submission?.goods?.transport || typeTransportTxt.FLT,
			commodity: submission?.goods?.commodity || typeMarchandiseTxt.PALETTE,
			quantity: submission?.goods?.quantity || '',
			totalWeight: {
				weight: submission?.goods?.totalWeight?.weight || '',
				unit: submission?.goods?.totalWeight?.unit || 'lb'
			},
			dimension: {
				full: submission?.goods?.dimension?.full || '',
				lenght: submission?.goods?.dimension?.lenght || '',
				width: submission?.goods?.dimension?.width || '',
				height: submission?.goods?.dimension?.height || '',
				unit: submission?.goods?.dimension?.unit || 'Pied'
			},
			oversized: submission?.goods?.oversized || false,
			hazmat: {
				isHasmat: submission?.goods?.hazmat?.isHasmat || false,
				category: submission?.goods?.hazmat?.category || '',
				un: submission?.goods?.hazmat?.un || '',
				quantity: submission?.goods?.hazmat?.quantity || '',
				weight: {
					weight: submission?.goods?.hazmat?.weight?.weight || '',
					unit: submission?.goods?.hazmat?.weight?.unit || ''
				}
			},
			//------- START international
			international: {
				overlaid: submission?.goods?.international?.overlaid || false,
				tailgateTruck: submission?.goods?.international?.tailgateTruck || false,
				loadingDock: submission?.goods?.international?.loadingDock || false,
				natureGoods: submission?.goods?.international?.natureGoods || '',
				cargoInsurance: submission?.goods?.international?.cargoInsurance || false,
				hazardousMaterial: submission?.goods?.international?.hazardousMaterial || false,
				category: submission?.goods?.international?.category || '',
				totalValue: submission?.goods?.international?.totalValue || ''
			},
			details: submission?.goods?.details || ''
		},
		equipment: {
			transport: submission?.equipment?.transport || infoTransportTxt.GENERAL,
			trailer: submission?.equipment?.trailer || infoRemorqueTxt.DRYBOX,
			toile: submission?.equipment?.toile || false,
			details: submission?.equipment?.details || ''
		},
		status: submission?.status || ''
	})

	const [serverError, setServerError] = useState('')

	//gestion des erreurs
	const validations = {
		companyEmail: {
			pattern: {
				value: regexEmail,
				message: 'Vous devez avoir un courriel valide'
			}
		},
		sourceAddress: {
			required: true,
			message: 'Vous devez remplir ce champs'
		},
		sourceCity: {
			required: true,
			message: 'Vous devez remplir ce champs'
		},
		sourceProvince: {
			required: true,
			message: 'Vous devez remplir ce champs'
		},

		destinationAddress: {
			required: true,
			message: 'Vous devez remplir ce champs'
		},
		destinationCity: {
			required: true,
			message: 'Vous devez remplir ce champs'
		},
		destinationProvince: {
			required: true,
			message: 'Vous devez remplir ce champs'
		}
	}

	const { register, handleSubmit, control } = useForm({ defaultValues, mode: 'onTouched' })

	const onSubmit = async data => {
		let msgError = []
		setServerError('')
		if (!client) msgError.push('Vous devez sélectionner un client')
		if (!contact)
			msgError.push(
				'Vous devez sélectionner un contact, si aucun contact, veuillez le rajouter dans la fiche client'
			)
		if (msgError.length > 0) {
			setServerError(msgError.join('<br />'))
		}

		const postData = {
			typeTransport: submission?.typeTransport || typeTransportTxt.FLT,
			customer: client?._id || null,
			contact: contact?._id || null,
			address: {
				source: {
					address: data.sourceAddress || '',
					city: data.sourceCity || '',
					province: data.sourceProvince || '',
					country: data.sourceCountry || '',
					zip: data.sourceZip || '',
					date: data.sourceDate || ''
				},
				destination: {
					address: data.destinationAddress || '',
					city: data.destinationCity || '',
					province: data.destinationProvince || '',
					country: data.destinationCountry || '',
					zip: data.destinationZip || '',
					date: data.destinationDate || ''
				}
			},
			deadlinesState: data?.deadlines || deadlinesTxt.REGULIER,
			requestedService: {
				requestedService: data?.requestedService || '',
				typeService: data?.typeService || '',
				typeApplication: data?.typeApplication || '',
				incoterms: data?.incoterms || '',
				typeShipment: data?.typeShipment || '',
				typeEquipment: data?.typeEquipment || ''
			},
			goods: {
				transport: data.typeTransport || typeTransportTxt.FLT,
				commodity: data.commodity || typeMarchandiseTxt.PALETTE,
				quantity: data.quantity || '',
				totalWeight: {
					weight: data.totalWeight || '',
					unit: data.unitWeight || ''
				},
				dimension: {
					full: data.dimensions || '',
					unit: data.unitDimension || 'Pied'
				},
				oversized: data.oversized === 'true',
				hazmat: {
					isHasmat: data.hazmat === 'true',
					category: data?.hazmatCategory || '',
					un: data?.hazmatUn || '',
					quantity: data?.hazmatQuantity || '',
					weight: {
						weight: data?.hazmatWeight || '',
						unit: data?.hazmatWeightUnit || 'lb'
					}
				},
				//------- START international
				international: {
					overlaid: data?.overlaid === 'true',
					tailgateTruck: data?.tailgateTruck === 'true',
					loadingDock: data?.loadingDock === 'true',
					natureGoods: data?.natureGoods || '',
					cargoInsurance: data?.cargoInsurance === 'true',
					hazardousMaterial: data?.hazardousMaterial === 'true',
					category: data?.internationalCategory || '',
					totalValue: data?.internationalTotalValue || ''
				},
				details: data.otherDetail || ''
			},
			equipment: {
				transport: data.transport || infoTransportTxt.GENERAL,
				trailer: data.remorque || infoRemorqueTxt.DRYBOX,
				toile: data.toiles === 'true',
				details: data.otherDetailEquipment || ''
			}
		}

		//save the datas
		console.log(submission)
		try {
			if (!submission) {
				console.log('create')
				await createRequest(postData)
			} else {
				console.log('update')

				await updateRequest(postData)
			}
		} catch (err) {
			setServerError(err)
		}
	}

	//create customed
	const createRequest = async postData => {
		const config = {
			method: 'post',
			url: `/api/submission`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			setSubmission({ ...postData, _id: data.data._id })
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 4000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
			setServerError(data.message)
		}
		// setIsSubmitSuccessful(data.success)
	}

	const updateRequest = async postData => {
		const config = {
			method: 'put',
			url: `/api/submission/${submission._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res

		if (data.success) {
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 4000 })
			setSubmission({ ...postData, _id: data.data._id })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
			setServerError(data.message)
		}
		// setIsSubmitSuccessful({ success: data.success, message: data.message })
	}

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		const token = localStorage.getItem('jwt')

		fetch(`/api/customer`, {
			...signal,
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					setCustomers(data.data)
				}
			})

		const idSubmission = props?.match?.params?.id

		if (idSubmission) {
			const controller = new AbortController()
			const { signal } = controller

			const token = localStorage.getItem('jwt')

			fetch(`/api/submission/${idSubmission}`, {
				...signal,
				headers: { Authorization: `Bearer ${token}` }
			})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						setSubmission(data.data)
						console.log(data.data.customer)
						console.log(data.data.contact)
						setClient(data.data.customer)
						setContact(data.data.contact)

						setIsLoaded(true)
						console.log(data.data)
					}
				})
		} else {
			setIsLoaded(true)
		}

		return () => controller.abort()
	}, [])

	useEffect(() => {
		if (client) {
			const controller = new AbortController()
			const { signal } = controller

			const token = localStorage.getItem('jwt')

			fetch(`/api/customer/${client._id}/contact`, {
				...signal,
				headers: { Authorization: `Bearer ${token}` }
			})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						setContacts(data.data)
					}
				})
			return () => controller.abort()
		}
	}, [client])

	const customerOptions =
		customers &&
		customers.map(option => {
			const firstLetter = option.name[0].toUpperCase()

			return {
				firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
				...option
			}
		})

	const contactOptions =
		contacts &&
		contacts.map(option => {
			const firstLetter = option.name[0].toUpperCase()
			return {
				firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
				...option
			}
		})

	return (
		<>
			{isLoaded && (
				<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
					<Toast ref={toast} />

					<div className="form-group">
						{!isEmpty(serverError) && (
							<Alert severity="error">
								<b dangerouslySetInnerHTML={{ __html: serverError }}></b>
							</Alert>
						)}
					</div>
					<Card className={classes.card}>
						<CardHeader color="info">
							<h4>Information sur la companie</h4>
						</CardHeader>
						<CardBody>
							<div className="row">
								<div className="col-lg-6">
									<br />
									{customers && (
										<Autocomplete
											id="customerList"
											options={customerOptions.sort(
												(a, b) => -b.firstLetter.localeCompare(a.firstLetter)
											)}
											onChange={(event, option) => {
												setClient(option)
											}}
											defaultValue={client}
											groupBy={option => option.firstLetter}
											getOptionLabel={option => option.name}
											style={{ width: 300 }}
											renderInput={params => {
												return (
													<TextField
														{...params}
														label="Sélection du client"
														value={client?._id}
														variant="outlined"
													/>
												)
											}}
										/>
									)}
									{!client && (
										<p style={{ lineHeight: 1.4, fontSize: '0.8rem' }}>
											Si le client n'est pas listé, veuillez l'ajouter via le menu Client
										</p>
									)}

									{/* <FormControl style={{ width: '100%' }} className="form-group">
								<FormControlLabel
									control={
										<Checkbox
											checked={isNewCustomer}
											onChange={isNewCustomerHandleChange}
											name="isNewCustomer"
										/>
									}
									label="Le client n'est pas répertorier dans la liste?"
								/>
							</FormControl> */}
								</div>
								<div className="col-lg-6">
									<br />
									{client && contacts.length > 0 && (
										<Autocomplete
											id="contactList"
											options={contactOptions.sort(
												(a, b) => -b.firstLetter.localeCompare(a.firstLetter)
											)}
											onChange={(event, option) => {
												setContact(option)
											}}
											groupBy={option => option.firstLetter}
											getOptionLabel={option => option.name}
											style={{ width: 300 }}
											defaultValue={contact}
											renderInput={params => {
												return (
													<TextField
														{...params}
														label="Sélection du contact"
														value={contact}
														variant="outlined"
													/>
												)
											}}
										/>
									)}
								</div>
								{client && (
									<>
										<div className="col-lg-6">
											<br />
											<strong>Fiche client :</strong> {client.name} <strong>REF :</strong>
											{client.refNumber}
											<br />
											<strong>Adresse:</strong> {client.address.address}, {client.address.city}
											<br />
											{client.address.province} {client.address.country} {client.address.zip}
											<br />
											<strong>Téléphone:</strong> {client.phone.phone}
											<br />
										</div>
									</>
								)}

								{contact && (
									<>
										<div className="col-lg-6">
											<br />
											<strong>Nom du contact :</strong> {contact.name}
											<br />
											<strong>Téléphone:</strong> {contact.phone.phone}
											{contact.phone.ext ? `#${contact.phone.ext}` : ''}
											<br />
											<strong>Email:</strong>{' '}
											<a href={`mailto:${contact.email}`}>{contact.email}</a>
											<br />
										</div>
									</>
								)}
							</div>

							{
								//affiche seulement si l'option nouveau client est coché
								isNewCustomer && (
									<div>
										<div className="fieldset">
											<h1>Informations</h1>
											<div className="row">
												<div className="col-md-6">
													<TextField
														id="companyName"
														name="companyName"
														label="Nom de la compagnie"
														type="text"
														classes={{ root: 'form-group' }}
														inputProps={{ maxLength: 100 }}
														helperText={
															validations.companyName && validations.companyName.message
														}
														error={Boolean(validations.companyName)}
														inputRef={register(validations.companyName)}
														fullWidth
													/>
												</div>
												<div className="col-md-6">
													<TextField
														id="companyContactName"
														name="companyContactName"
														label="Personne ressource"
														classes={{ root: 'form-group' }}
														inputProps={{ maxLength: 100 }}
														helperText={
															validations.companyContactName &&
															validations.companyContactName.message
														}
														error={Boolean(validations.companyContactName)}
														inputRef={register(validations.companyContactName)}
														fullWidth
													/>
												</div>

												<div className="col-md-6">
													<TextField
														id="companyPhone"
														name="companyPhone"
														label="Téléphone"
														classes={{ root: 'form-group' }}
														inputProps={{ maxLength: 100 }}
														helperText={
															validations.companyPhone && validations.companyPhone.message
														}
														error={Boolean(validations.companyPhone)}
														inputRef={register(validations.companyPhone)}
														fullWidth
													/>
												</div>
												<div className="col-md-6">
													<TextField
														id="companyEmail"
														name="companyEmail"
														label="Email"
														classes={{ root: 'form-group' }}
														inputProps={{ maxLength: 100 }}
														helperText={
															validations.companyEmail && validations.companyEmail.message
														}
														error={Boolean(validations.companyEmail)}
														inputRef={register(validations.companyEmail)}
														fullWidth
													/>
												</div>
											</div>
										</div>

										<AddressPartialForm
											title="Adresse de la compagnie"
											type="company"
											validations={validations}
											register={register}
										/>
									</div>
								)
							}
						</CardBody>
					</Card>

					<Card className={classes.card}>
						<CardHeader color="info">
							<h4 className={classes.cardTitleWhite}>Information sur les adresses</h4>
						</CardHeader>
						<CardBody>
							<AddressPartialForm
								title="Adresse source"
								type="source"
								values={defaultValues.address.source}
								validations={validations}
								register={register}
							/>

							<AddressPartialForm
								title="Adresse destination"
								type="destination"
								values={defaultValues.address.destination}
								validations={validations}
								register={register}
							/>
							<div className="fieldset">
								<h1>Deadlines</h1>
								<FormControl style={{ width: '100%' }} className="form-group">
									<InputLabel id="dealinesLabel">Dealines</InputLabel>
									<Controller
										control={control}
										name="deadlines"
										defaultValue={deadlinesTxt.REGULIER}
										as={
											<Select
												labelId="dealinesLabel"
												id="deadlines"
												name="deadlines"
												inputRef={register(validations.deadlines)}
												error={Boolean(validations.deadlines)}
												fullWidth
											>
												{Object.keys(deadlinesTxt).map((item, i) => (
													<MenuItem key={i} value={deadlinesTxt[item]}>
														{deadlinesTxt[item]}
													</MenuItem>
												))}
											</Select>
										}
									/>
								</FormControl>
							</div>
						</CardBody>
					</Card>

					<Card className={classes.card}>
						<CardHeader color="info">
							<h4 className={classes.cardTitleWhite}>Information sur la marchandise</h4>
						</CardHeader>
						<CardBody>
							<div className="fieldset">
								<div className="row">
									<div className="col-md-6">
										<FormControl style={{ width: '100%' }} className="form-group">
											<InputLabel id="typeTransportLabel">Type de transport</InputLabel>

											<Controller
												control={control}
												name="typeTransport"
												defaultValue="FLT"
												as={
													<Select
														labelId="typeTransportLabel"
														id="typeTransport"
														inputRef={register(validations.typeTransport)}
														error={Boolean(validations.typeTransport)}
														fullWidth
													>
														{Object.keys(typeTransportTxt).map((item, i) => (
															<MenuItem key={i} value={typeTransportTxt[item]}>
																{typeTransportTxt[item]}
															</MenuItem>
														))}
													</Select>
												}
											/>
										</FormControl>
									</div>

									<div className="col-md-6">
										<FormControl style={{ width: '100%' }} className="form-group">
											<InputLabel id="commodityLabel">Marchandise</InputLabel>
											<Controller
												control={control}
												name="commodity"
												defaultValue={defaultValues.goods.commodity}
												as={
													<Select
														labelId="commodityLabel"
														id="commodity"
														error={Boolean(validations.commodity)}
														inputRef={register(validations.commodity)}
														fullWidth
													>
														{Object.keys(typeMarchandiseTxt).map((item, i) => (
															<MenuItem key={i} value={typeMarchandiseTxt[item]}>
																{typeMarchandiseTxt[item]}
															</MenuItem>
														))}
													</Select>
												}
											/>
										</FormControl>
									</div>

									<div className="col-md-6">
										<TextField
											id="quantity"
											name="quantity"
											label="Quantité"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 50 }}
											inputRef={register(validations.quantity)}
											defaultValue={defaultValues.goods.quantity}
											helperText={validations.quantity && validations.quantity.message}
											error={Boolean(validations.quantity)}
											fullWidth
										/>
									</div>

									<div className={'col-md-6'} style={{ display: 'flex', alignItems: 'flex-end' }}>
										<TextField
											id="dimensions"
											name="dimensions"
											label="Dimensions"
											classes={{ root: 'form-group' }}
											className={classes.dimensions}
											placeholder="L x W x H"
											inputProps={{ maxLength: 50 }}
											defaultValue={defaultValues.goods.dimension.full}
											helperText={validations.dimensions && validations.dimensions.message}
											error={Boolean(validations.dimensions)}
											inputRef={register(validations.dimensions)}
										/>
										<Controller
											control={control}
											name="unitDimension"
											defaultValue={defaultValues.goods.dimension.unit}
											as={
												<Select
													labelId="unitDimension"
													id="unitDimension"
													name="unitDimension"
													className={classes.unit}
													inputRef={register(validations.unitDimension)}
													error={Boolean(validations.unitDimension)}
												>
													<MenuItem value="Pied">Pied</MenuItem>
													<MenuItem value="Pouce">Po</MenuItem>
													<MenuItem value="Cm">CM</MenuItem>
												</Select>
											}
										/>
									</div>

									<div className={'col-md-6'} style={{ display: 'flex', alignItems: 'flex-end' }}>
										<TextField
											id="totalWeight"
											name="totalWeight"
											label="Poids Total"
											classes={{ root: 'form-group' }}
											className={classes.dimensions}
											placeholder="ex: 75000"
											inputProps={{ maxLength: 50 }}
											helperText={validations.weight && validations.weight.message}
											error={Boolean(validations.weight)}
											defaultValue={defaultValues.goods.totalWeight.weight}
											inputRef={register(validations.weight)}
										/>
										<Controller
											control={control}
											name="unitWeight"
											defaultValue={defaultValues.goods.totalWeight.unit}
											as={
												<Select
													labelId="unitWeight"
													id="unitWeight"
													name="unitWeight"
													className={classes.unitWeight}
													inputRef={register(validations.unitWeight)}
													error={Boolean(validations.unitWeight)}
												>
													<MenuItem value="lb">lb</MenuItem>
													<MenuItem value="kg">kg</MenuItem>
												</Select>
											}
										/>
									</div>

									<div className={'col-md-6'}>
										<div style={{ marginTop: '10px' }}>
											<InputLabel>Oversized</InputLabel>
											<Controller
												control={control}
												name="oversized"
												defaultValue={defaultValues.goods.oversized.toString()}
												as={
													<RadioGroup
														row
														aria-label="Oversize"
														id="oversized"
														name="oversized"
														inputRef={register(validations.oversized)}
													>
														<FormControlLabel
															value={'true'}
															control={<Radio />}
															label="Oui"
														/>
														<FormControlLabel
															value={'false'}
															control={<Radio />}
															label="Non"
														/>
													</RadioGroup>
												}
											/>
											<div>
												<small>Si oui, veuillez compléter la section "Autre Détails"</small>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="fieldset">
								<h1>Hazmat</h1>
								<div className="row">
									<div className={'col-md-6'}>
										<div style={{ marginTop: '10px' }}>
											<Controller
												control={control}
												name="hazmat"
												defaultValue={defaultValues.goods.hazmat.isHasmat.toString()}
												as={
													<RadioGroup
														row
														defaultValue="Non"
														aria-label="HazMat"
														id="hazmat"
														name="hazmat"
														inputRef={register(validations.hazmat)}
													>
														<FormControlLabel
															value={'true'}
															control={<Radio />}
															label="Oui"
														/>
														<FormControlLabel
															value={'false'}
															control={<Radio />}
															label="Non"
														/>
													</RadioGroup>
												}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="fieldset">
								<h1>Autre détails</h1>
								<div className="row">
									<div className={'col-md-12'}>
										<div style={{ marginTop: '10px' }}>
											<Controller
												control={control}
												name="otherDetail"
												defaultValue={defaultValues.goods.details}
												as={
													<TextareaAutosize
														id="otherDetail"
														name="otherDetail"
														aria-label="otherDetail"
														className="textareaAutosize"
														label="otherDetail"
														rowsMin={5}
														placeholder=""
														style={{ width: '100%' }}
													/>
												}
											/>

											{validations.otherDetail?.error && (
												<FormHelperText error={Boolean(validations.otherDetail.message)}>
													{validations.otherDetail.message}
												</FormHelperText>
											)}
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>

					<Card className={classes.card}>
						<CardHeader color="info">
							<h4 className={classes.cardTitleWhite}>Information sur le Transport</h4>
						</CardHeader>
						<CardBody>
							<div className="fieldset">
								<div className="row">
									<div className={'col-md-6'}>
										<FormControl style={{ width: '100%' }} className="form-group">
											<InputLabel id="transportLabel">Transport</InputLabel>
											<Controller
												control={control}
												name="transport"
												defaultValue={defaultValues.equipment.transport}
												as={
													<Select
														labelId="transportLabel"
														id="transport"
														name="transport"
														inputRef={register(validations.transport)}
														error={Boolean(validations.transport)}
														fullWidth
													>
														{Object.keys(infoTransportTxt).map((item, i) => (
															<MenuItem key={i} value={infoTransportTxt[item]}>
																{infoTransportTxt[item]}
															</MenuItem>
														))}
													</Select>
												}
											/>
										</FormControl>
									</div>

									<div className={'col-md-6'}>
										<FormControl style={{ width: '100%' }} className="form-group">
											<InputLabel id="commodityLabel">Type de remorque</InputLabel>
											<Controller
												control={control}
												name="remorque"
												defaultValue={defaultValues.equipment.trailer}
												as={
													<Select
														labelId="remorqueLabel"
														id="remorque"
														name="remorque"
														inputRef={register(validations.remorque)}
														error={Boolean(validations.commodity)}
														fullWidth
													>
														{Object.keys(infoRemorqueTxt).map((item, i) => (
															<MenuItem key={i} value={infoRemorqueTxt[item]}>
																{infoRemorqueTxt[item]}
															</MenuItem>
														))}
													</Select>
												}
											/>
										</FormControl>
									</div>

									<div className={'col-md-6'}>
										<div style={{ marginTop: '10px' }}>
											<InputLabel>Toiles</InputLabel>
											<Controller
												control={control}
												name="toiles"
												defaultValue={defaultValues.equipment.toile.toString()}
												as={
													<RadioGroup
														row
														defaultValue="Oui"
														aria-label="Toiles"
														id="toiles"
														name="toiles"
														inputRef={register(validations.toiles)}
													>
														<FormControlLabel
															value={'true'}
															control={<Radio />}
															label="Oui"
														/>
														<FormControlLabel
															value={'false'}
															control={<Radio />}
															label="Non"
														/>
													</RadioGroup>
												}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="fieldset">
								<h1>Autre détails</h1>
								<div className="row">
									<div className={'col-md-12'}>
										<div style={{ marginTop: '10px' }}>
											<Controller
												control={control}
												name="otherDetailEquipment"
												defaultValue={defaultValues.equipment.details}
												as={
													<TextareaAutosize
														id="otherDetailEquipment"
														aria-label="otherDetailEquipment"
														className="textareaAutosize"
														label="otherDetailEquipment"
														rowsMin={5}
														placeholder=""
														inputRef={register(validations.otherDetailEquipment)}
														style={{ width: '100%' }}
													/>
												}
											/>

											{validations.otherDetailEquipment?.error && (
												<FormHelperText
													error={Boolean(validations.otherDetailEquipment.message)}
												>
													{validations.otherDetailEquipment.message}
												</FormHelperText>
											)}
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardFooter style={{ position: 'fixed', right: '0px', bottom: '0px', zIndex: 9999 }}>
							<Button type="submit" color="warning">
								Mettre à jour
							</Button>
						</CardFooter>
					</Card>
				</form>
			)}
		</>
	)
}

export default SubmissionForm
