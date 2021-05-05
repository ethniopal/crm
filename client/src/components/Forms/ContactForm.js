import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from 'components/CustomButtons/Button.js'
//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
import CardFooter from 'components/Card/CardFooter.js'
// core components
import { TextField } from '@material-ui/core'

//popup
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

//icons
import { Add } from '@material-ui/icons'

import { useForm } from 'react-hook-form'
import { isEmpty } from 'lodash'
import { regexEmail } from 'variables/regex'

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

const ContactForm = () => {
	const [open, setOpen] = React.useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const [defaultValues] = useState({
		// status: contact?.status || 'Prospect',
		// companyNo: contact?.refNumber || '',
		// companyName: contact?.name || '',
		// phone: contact?.phone.phone || '',
		// website: contact?.website || '',
		// companyAddress: contact?.address?.address || '',
		// companyCity: contact?.address?.city || '',
		// companyProvince: contact?.address?.province || '',
		// companyCountry: contact?.address?.country || '',
		// companyZip: contact?.address?.zip || '',
		// personRessource: contact?.mainContact?.function || '',
		// emailRessource: contact?.mainContact?.email || '',
		// phoneRessource: contact?.mainContact?.phone?.phone || '',
		// phoneExtRessource: contact?.mainContact?.phone?.ext || '',
		// cellRessource: contact.mainContact.phone.mobile || ''
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

	//form validation
	const [serverError, setServerError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
	const { register, handleSubmit, control, formState, errors } = useForm({ defaultValues, mode: 'onTouched' })
	const { isSubmitted } = formState

	//gestion du submit
	const onSubmit = data => {
		console.log(data)
	}

	//gestion des erreurs
	const validations = {
		email: {
			required: 'Vous devez compléter ce champ',
			pattern: {
				value: regexEmail,
				message: 'Vous devez avoir un courriel valide'
			}
		},
		remember: {}
	}

	//si soumis correctement
	if (isSubmitSuccessful) {
		console.log('succes')
	}

	const classes = useStyles()
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
					Ajouter un contact
				</Button>
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
						<DialogTitle id="form-dialog-title">Nouveau Contact</DialogTitle>
						<DialogContent>
							<DialogContentText>Veuillez complétez tous les champs obligatoire.</DialogContentText>

							<div className="fieldset">
								<h1>Informations personnelles</h1>
								<div className="row">
									<div className="col-md-6">
										<TextField
											id="firstname"
											name="firstname"
											label="Prénom"
											type="text"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.firstname && errors.firstname.message}
											error={Boolean(errors.firstname)}
											fullWidth
											inputRef={register(validations.firstname)}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="lastname"
											name="lastname"
											label="Nom de famille"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.lastname && errors.lastname.message}
											error={Boolean(errors.lastname)}
											fullWidth
											inputRef={register(validations.lastname)}
										/>
									</div>
									<div className="col-md-12">
										<TextField
											id="job"
											name="job"
											label="Fonction"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 150 }}
											helperText={errors.job && errors.job.message}
											error={Boolean(errors.job)}
											fullWidth
											inputRef={register(validations.job)}
										/>
									</div>

									<div className="col-md-6">
										<TextField
											id="cellphone"
											name="cellphone"
											label="Cellulaire"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.cellphone && errors.cellphone.message}
											error={Boolean(errors.cellphone)}
											fullWidth
											inputRef={register(validations.cellphone)}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="phone"
											name="phone"
											label="Téléphone"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.phone && errors.phone.message}
											error={Boolean(errors.phone)}
											fullWidth
											inputRef={register(validations.phone)}
										/>
									</div>
									<div className="col-md-12">
										<TextField
											id="email"
											name="email"
											label="Courriel"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 255 }}
											helperText={errors.email && errors.ademaildemailress.message}
											error={Boolean(errors.email)}
											fullWidth
											inputRef={register(validations.email)}
										/>
									</div>
									<div className="col-md-12">
										<TextField
											id="adresse"
											name="adresse"
											label="Adresse"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 255 }}
											helperText={errors.address && errors.address.message}
											error={Boolean(errors.address)}
											fullWidth
											inputRef={register(validations.address)}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="city"
											name="city"
											label="Ville"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.city && errors.city.message}
											error={Boolean(errors.city)}
											fullWidth
											inputRef={register(validations.city)}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="province"
											name="province"
											label="Province"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.province && errors.province.message}
											error={Boolean(errors.province)}
											fullWidth
											inputRef={register(validations.province)}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="country"
											name="country"
											label="Pays"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.country && errors.country.message}
											error={Boolean(errors.country)}
											fullWidth
											inputRef={register(validations.country)}
										/>
									</div>
									<div className="col-md-6">
										<TextField
											id="zip"
											name="zip"
											label="Code Postal"
											classes={{ root: 'form-group' }}
											inputProps={{ maxLength: 100 }}
											helperText={errors.zip && errors.zip.message}
											error={Boolean(errors.zip)}
											fullWidth
											inputRef={register(validations.zip)}
										/>
									</div>
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
				<h4 className={classes.cardTitleWhite}>Contacts</h4>
				<p className={classes.cardCategoryWhite}>Liste des contacts associé à ce client</p>
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

export default ContactForm
