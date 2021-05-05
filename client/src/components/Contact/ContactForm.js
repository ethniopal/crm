import React, { useState } from 'react'

// core components
import { TextField } from '@material-ui/core'
import Button from 'components/CustomButtons/Button.js'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { Alert } from '@material-ui/lab/'
import { useForm } from 'react-hook-form'
import { regexEmail } from 'variables/regex'
import { isEmpty } from 'lodash'

// import faker from 'faker/locale/fr_CA'
// faker.locale = 'fr_CA'

const ContactForm = ({ customer, contact, handleClose, createContact, updateContact, serverError, setServerError }) => {
	const [defaultValues] = useState({
		name: contact?.name || '',
		function: contact?.function || '',
		cellphone: contact?.phone?.mobile || '',
		phone: contact?.phone?.phone || '',
		ext: contact?.phone?.ext || '',

		email: contact?.email || '',
		address: contact?.address?.address || '',
		city: contact?.address?.city || '',
		province: contact?.address?.province || '',
		country: contact?.address?.country || '',
		zip: contact?.address?.zip || ''

		// name: faker.name.findName(),
		// function: faker.name.jobTitle(),
		// cellphone: faker.phone.phoneNumber(),
		// phone: faker.phone.phoneNumber(),
		// email: faker.internet.email(),
		// address: faker.address.city(),
		// city: faker.address.city(),
		// province: faker.address.state(),
		// country: faker.address.country(),
		// zip: faker.address.zipCode()
	})

	//gestion des erreurs
	const validations = {
		name: {
			required: 'Vous devez compléter ce champ'
		},
		phone: {
			required: 'Vous devez compléter ce champ'
		},
		email: {
			required: 'Vous devez compléter ce champ',
			pattern: {
				value: regexEmail,
				message: 'Vous devez avoir un courriel valide'
			}
		},
		ext: {},
		function: {},
		cellphone: {},
		address: {},
		city: {},
		province: {},
		country: {},
		zip: {}
	}

	//form validation
	const { register, handleSubmit, formState, errors } = useForm({ defaultValues, mode: 'onTouched' })
	const { isSubmitted } = formState

	//gestion du submit
	const onSubmit = async data => {
		setServerError('')

		const postData = {
			name: data.name || '',
			function: data.function || '',
			email: data.email || '',
			phone: {
				phone: data.phone || '',
				ext: data.ext || '',
				mobile: data.cellphone || ''
			},
			address: {
				address: data.address || '',
				city: data.city || '',
				province: data.province || '',
				country: data.country || '',
				zip: data.zip || ''
			}
		}

		//save the datas
		try {
			if (!contact?._id) {
				await createContact(postData)
			} else {
				await updateContact(postData)
			}
		} catch (err) {
			setServerError(err)
		}
	}

	return (
		<>
			<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<DialogContentText>Veuillez complétez tous les champs obligatoire.</DialogContentText>
				</DialogContent>
				{isSubmitted && !isEmpty(serverError) && (
					<Alert severity="error">
						<b dangerouslySetInnerHTML={{ __html: serverError }}></b>
					</Alert>
				)}

				<div className="fieldset">
					<h1>Informations personnelles</h1>
					<div className="row">
						<div className="col-md-12">
							<TextField
								id="name"
								name="name"
								label="Nom du contact"
								type="text"
								classes={{ root: 'form-group' }}
								inputProps={{ maxLength: 100 }}
								helperText={errors.name && errors.name.message}
								error={Boolean(errors.name)}
								fullWidth
								inputRef={register(validations.name)}
							/>
						</div>

						<div className="col-md-12">
							<TextField
								id="function"
								name="function"
								label="Fonction"
								classes={{ root: 'form-group' }}
								inputProps={{ maxLength: 150 }}
								helperText={errors.function && errors.function.message}
								error={Boolean(errors.function)}
								fullWidth
								inputRef={register(validations.function)}
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
						<div className="col-md-6">
							<TextField
								id="ext"
								name="ext"
								label="ext."
								classes={{ root: 'form-group' }}
								inputProps={{ maxLength: 100 }}
								helperText={errors.ext && errors.ext.message}
								error={Boolean(errors.ext)}
								fullWidth
								inputRef={register(validations.ext)}
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
						<div className="col-md-6"></div>
						<div className="col-md-12">
							<TextField
								id="email"
								name="email"
								label="Courriel"
								classes={{ root: 'form-group' }}
								inputProps={{ maxLength: 255 }}
								helperText={errors.email && errors.email.message}
								error={Boolean(errors.email)}
								fullWidth
								inputRef={register(validations.email)}
							/>
						</div>
						<div className="col-md-12">
							<TextField
								id="address"
								name="address"
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
				<DialogActions>
					<Button onClick={handleClose} color="danger">
						Cancel
					</Button>
					<Button type="submit" color="info">
						{contact ? 'Mise à jour' : 'Ajouter'}
					</Button>
				</DialogActions>
			</form>
		</>
	)
}

export default ContactForm
