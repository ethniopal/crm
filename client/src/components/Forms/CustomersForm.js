import React, { useState, useRef } from 'react'
// import { Redirect } from 'react-router-dom'
import Axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Button from '../CustomButtons/Button.js'
//card
import Card from '../Card/Card.js'
import CardHeader from '../Card/CardHeader.js'
import CardBody from '../Card/CardBody.js'
import CardFooter from '../Card/CardFooter.js'
import AddresCompany from '../Forms/AddressPartialForm'
import { Toast } from 'primereact/toast'
//phone component
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'

// core components
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core'

import { Alert } from '@material-ui/lab/'

import { useForm, Controller } from 'react-hook-form'
import { isEmpty } from 'lodash'
import { regexEmail, regexUrl } from '../../variables/regex'

// import faker from 'faker/locale/fr_CA'
// faker.locale = 'fr_CA'
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
const token = localStorage.getItem('jwt')
const useStyles = makeStyles(styles)

const CustomersForm = ({ setCustomer, customer, handleOpenNotification }) => {
	const toast = useRef(null)

	const arrType = ['Prospect', 'Partenaire', 'Revendeur', 'Fournisseur', 'Transporteur', 'Autre']

	const [defaultValues] = useState({
		status: customer?.status || 'Prospect',
		companyNo: customer?.refNumber || '',
		companyName: customer?.name || '',
		phone: customer?.phone.phone || '',
		website: customer?.website || '',
		companyAddress: customer?.address?.address || '',
		companyCity: customer?.address?.city || '',
		companyProvince: customer?.address?.province || '',
		companyCountry: customer?.address?.country || '',
		companyZip: customer?.address?.zip || '',
		personRessource: customer?.mainContact?.name || '',
		functionRessource: customer?.mainContact?.function || '',
		emailRessource: customer?.mainContact?.email || '',
		phoneRessource: customer?.mainContact?.phone?.phone || '',
		phoneExtRessource: customer?.mainContact?.phone?.ext || ''
		// cellRessource: customer.mainContact.phone.mobile || ''
		// status: arrType[Math.floor(Math.random() * arrType.length)],
		// companyNo: faker.random.number(),
		// companyName: faker.company.companyName(),
		// phone: faker.phone.phoneNumber(),
		// website: faker.internet.url(),
		// companyAddress: faker.address.streetAddress(),
		// companyCity: faker.address.city(),
		// companyProvince: faker.address.state(),
		// companyCountry: faker.address.country(),
		// companyZip: faker.address.zipCode(),
		// personRessource: faker.name.findName(),
		// functionRessource: faker.name.jobTitle(),
		// emailRessource: faker.internet.email(),
		// phoneRessource: faker.phone.phoneNumber(),
		// phoneExtRessource: faker.random.number(),
		// cellRessource: faker.phone.phoneNumber()
	})

	const [serverError, setServerError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

	//gestion des erreurs
	const validations = {
		status: {
			required: 'Vous devez sélectionner un choix'
		},
		companyNo: {},
		companyName: {
			required: 'Vous devez compléter ce champ'
		},
		phone: {
			required: 'Vous devez compléter ce champ',
			minLength: {
				value: 10,
				message: 'Le numéro entré est trop court'
			}
		},
		website: {
			value: regexUrl,
			message: 'Vous devez avoir un site web valide'
		},
		companyAddress: {},
		companyCity: {},
		companyProvince: {},
		companyCountry: {},
		companyZip: {},
		personRessource: {},
		functionRessource: {},
		emailRessource: {
			value: regexEmail,
			message: 'Vous devez avoir un courriel valide'
		},
		phoneRessource: {},
		phoneExtRessource: {},
		cellRessource: {}
	}

	//form validation
	const { register, handleSubmit, control, formState, errors } = useForm({ defaultValues, mode: 'onTouched' })
	const { isSubmitted } = formState

	//create customed
	const createCustomerRequest = async postData => {
		const config = {
			method: 'post',
			url: `/api/customer`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			setCustomer({ ...postData, _id: data.data._id })
			// toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 4000 })

			handleOpenNotification({ open: true, severity: 'success', message: data.message })
		} else {
			// toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })

			handleOpenNotification({ open: true, severity: 'error', message: data.message })
			setServerError(data.message)
		}
		setIsSubmitSuccessful(data.success)
	}

	const updateCustomerRequest = async postData => {
		const config = {
			method: 'put',
			url: `/api/customer/${customer._id}`,
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
			setCustomer({ ...postData, _id: data.data._id })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
			setServerError(data.message)
		}
		setIsSubmitSuccessful({ success: data.success, message: data.message })
	}

	//gestion du submit
	const onSubmit = async data => {
		setServerError('')
		const postData = {
			name: data.companyName || '',
			refNumber: data.companyNo || '',
			phone: {
				phone: data.phone || ''
			},
			website: data.website || '',
			address: {
				address: data.companyAddress || '',
				city: data.companyCity || '',
				province: data.companyProvince || '',
				country: data.companyCountry || '',
				zip: data.companyZip || ''
			},

			mainContact: {
				name: data.personRessource || '',
				email: data.emailRessource || '',
				function: data.functionRessource || '',
				phone: {
					phone: data.phoneRessource || '',
					ext: data.phoneExtRessource || '',
					mobile: data.cellRessource || ''
				}
			},
			status: data.status || defaultValues.status
		}

		//save the datas
		try {
			if (!customer) {
				await createCustomerRequest(postData)
			} else {
				await updateCustomerRequest(postData)
			}
		} catch (err) {
			setServerError(err)
		}
	}

	const classes = useStyles()
	return (
		<>
			<Toast ref={toast} />
			<Card>
				<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
					<CardHeader color="info">
						<h4 className={classes.cardTitleWhite}>Fiche client</h4>
						<p className={classes.cardCategoryWhite}>Compléter la fiche client</p>
					</CardHeader>
					<CardBody>
						<div className="form-group">
							{isSubmitSuccessful && (
								<Alert severity="success">L'enregistrement a été fait avec succès</Alert>
							)}

							{isSubmitted && !isEmpty(serverError) && (
								<Alert severity="error">
									<b dangerouslySetInnerHTML={{ __html: serverError }}></b>
								</Alert>
							)}
						</div>

						<div className="fieldset">
							<h1>Informations entreprise</h1>
							<div className="row">
								<div className="col-md-6">
									<FormControl style={{ width: '100%' }} className="form-group">
										<InputLabel id="statusLabel" required>
											Status de l'entreprise
										</InputLabel>
										<Controller
											as={
												<Select labelId="statusLabel">
													{arrType.map(type => (
														<MenuItem key={type} value={type}>
															{type}
														</MenuItem>
													))}
												</Select>
											}
											name="status"
											defaultValue={defaultValues.status}
											control={control}
											rules={register(validations.status)}
											error={Boolean(errors.status)}
										/>

										{errors.status && (
											<FormHelperText error={Boolean(errors.status)}>
												{errors.status.message}
											</FormHelperText>
										)}
									</FormControl>
								</div>
								<div className="col-md-6">
									<TextField
										id="companyNo"
										name="companyNo"
										label="Numéro d'identification"
										type="text"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 200 }}
										helperText={errors.companyNo && errors.companyNo.message}
										error={Boolean(errors.companyNo)}
										fullWidth
										inputRef={register(validations.companyNo)}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<TextField
										id="companyName"
										name="companyName"
										label="Nom de la compagnie"
										type="text"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 200 }}
										helperText={errors.companyName && errors.companyName.message}
										error={Boolean(errors.companyName)}
										required
										fullWidth
										inputRef={register(validations.companyName)}
									/>
								</div>

								<div className="col-md-6 col-sm-8">
									<TextField
										id="phone"
										name="phone"
										label="Téléphone"
										type="text"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 15 }}
										helperText={errors.phone && errors.phone.message}
										error={Boolean(errors.phone)}
										fullWidth
										inputRef={register(validations.phone)}
									/>
								</div>

								<div className="col-md-12">
									<TextField
										id="website"
										name="website"
										label="Site Internet"
										placeholder="https://exemple.com"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 255 }}
										helperText={errors.website && errors.website.message}
										error={Boolean(errors.website)}
										fullWidth
										inputRef={register(validations.website)}
									/>
								</div>
							</div>
							<AddresCompany
								title=""
								errors={errors}
								validations={validations}
								register={register}
								type="company"
							/>
						</div>
						<div className="fieldset">
							<h1>Informations sur contact principal</h1>

							<div className="row">
								<div className="col-md-6">
									<TextField
										id="personRessource"
										name="personRessource"
										label="Personne ressource"
										type="text"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 200 }}
										helperText={errors.personRessource && errors.personRessource.message}
										error={Boolean(errors.personRessource)}
										fullWidth
										inputRef={register(validations.personRessource)}
									/>
								</div>
								<div className="col-md-6">
									<TextField
										id="functionRessource"
										name="functionRessource"
										label="Fonction dans l'entreprise"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 200 }}
										helperText={errors.functionRessource && errors.functionRessource.message}
										error={Boolean(errors.functionRessource)}
										fullWidth
										inputRef={register(validations.functionRessource)}
									/>
								</div>
								<div className="col-md-12">
									<TextField
										id="emailRessource"
										name="emailRessource"
										label="Courriel"
										type="email"
										placeholder="john.doe@exemple.com"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 200 }}
										helperText={errors.emailRessource && errors.emailRessource.message}
										error={Boolean(errors.emailRessource)}
										fullWidth
										inputRef={register(validations.emailRessource)}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6 col-sm-8">
									<TextField
										id="phoneRessource"
										name="phoneRessource"
										label="Téléphone"
										type="text"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 15 }}
										helperText={errors.phoneRessource && errors.phoneRessource.message}
										error={Boolean(errors.phoneRessource)}
										fullWidth
										inputRef={register(validations.phoneRessource)}
									/>
								</div>
								<div className="col-md-6 col-sm-4">
									<TextField
										id="phoneExtRessource"
										name="phoneExtRessource"
										label="Extension téléphonique"
										type="number"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 10 }}
										helperText={errors.phoneExtRessource && errors.phoneExtRessource.message}
										error={Boolean(errors.phoneExtRessource)}
										fullWidth
										inputRef={register(validations.phoneExtRessource)}
									/>
								</div>
								<div className="col-md-6 col-sm-8">
									<TextField
										id="cellRessource"
										name="cellRessource"
										label="Cellulaire"
										type="text"
										classes={{ root: 'form-group' }}
										inputProps={{ maxLength: 15 }}
										helperText={errors.cellRessource && errors.cellRessource.message}
										error={Boolean(errors.cellRessource)}
										fullWidth
										inputRef={register(validations.cellRessource)}
									/>
								</div>
							</div>
						</div>
					</CardBody>
					<CardFooter>
						<Button type="submit" color="info">
							Mettre à jour
						</Button>
					</CardFooter>
				</form>
			</Card>
		</>
	)
}

export default CustomersForm
