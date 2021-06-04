import React, { useState } from 'react'

// core components
import { TextField, MenuItem } from '@material-ui/core'
import Button from 'components/CustomButtons/Button.js'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { isEmpty } from 'lodash'
import { Alert } from '@material-ui/lab/'
import { useForm } from 'react-hook-form'
import { regexEmail } from '../../variables/regex'
import ReactHookFormSelect from '../Forms/element/ReactHookFormSelect'
import { userPermission, userStatus, haveAccess, generatePassword } from '../../variables/user.js'
const { ADMIN } = userPermission

// import faker from 'faker/locale/fr_CA'
// faker.locale = 'fr_CA'

const UserForm = ({ user, handleClose, createUser, updateUser, serverError, setServerError }) => {
	const [defaultValues] = useState({
		salemanNumber: user?.salemanNumber || '',
		name: user?.name || '',
		cellphone: user?.phone?.mobile || '',
		phone: user?.phone?.phone || '',
		ext: user?.phone?.ext || '',

		email: user?.email || '',
		permission: user?.permission || userPermission.GUESS,
		status: user?.status || userStatus.ACTIVE,

		address: user?.address?.address || '',
		city: user?.address?.city || '',
		province: user?.address?.province || '',
		country: user?.address?.country || '',
		zip: user?.address?.zip || ''
	})

	const [select, setSelect] = useState({
		permission: user?.permission || userPermission.GUESS,
		status: user?.status || userStatus.ACTIVE
	})

	//gestion des erreurs
	const validations = {
		salemanNumber: {},
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
		permission: {},
		status: {},
		cellphone: {},
		address: {},
		city: {},
		province: {},
		country: {},
		zip: {}
	}

	//form validation
	const { register, handleSubmit, formState, errors, control } = useForm({ defaultValues, mode: 'onTouched' })
	const { isSubmitted } = formState

	const selectHandleChange = e => {
		setSelect({ ...select, [e.target.name.replace('Select', '')]: e.target.value })
	}

	//gestion du submit
	const onSubmit = async data => {
		setServerError('')

		if (!select.permission) {
			setServerError("Vous devez définir la permission de l'utilisateur")
		}
		if (!select.status) {
			setServerError("Vous devez définir le status de l'utilisateur ")
		}

		if (select.status && select.permission) {
			const postData = {
				salemanNumber: data.salemanNumber || '',
				name: data.name || '',
				permission: select.permission || '',
				status: select.status,
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
				if (!user?._id) {
					postData.password = generatePassword()
					await createUser(postData)
				} else {
					await updateUser(postData)
				}
			} catch (err) {
				setServerError(err)
			}
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
					<h1>Authorisation</h1>
					<div className="row">
						<div className="col-sm-12 col-md-6">
							{haveAccess([ADMIN]) ? (
								<ReactHookFormSelect
									id="permission"
									name="permission"
									style={{ width: '100%' }}
									className="form-group"
									label="Permission"
									control={control}
									defaultValue={defaultValues.permission}
									variant="outlined"
									margin="normal"
									value={select.permission}
									onChange={selectHandleChange}
								>
									{Object.keys(userPermission).map((item, i) => (
										<MenuItem key={i} value={userPermission[item]}>
											{userPermission[item]}
										</MenuItem>
									))}
								</ReactHookFormSelect>
							) : (
								select.permission
							)}
						</div>
						<div className="col-sm-12 col-md-6">
							{haveAccess([ADMIN]) ? (
								<ReactHookFormSelect
									id="status"
									name="status"
									style={{ width: '100%' }}
									className="form-group"
									label="Status"
									control={control}
									defaultValue={defaultValues.status}
									variant="outlined"
									margin="normal"
									value={select.status}
									onChange={selectHandleChange}
								>
									{Object.keys(userStatus).map((item, i) => (
										<MenuItem key={i} value={userStatus[item]}>
											{userStatus[item]}
										</MenuItem>
									))}
								</ReactHookFormSelect>
							) : (
								<span className={`user-badge status-${select.status}`}>{select.status}</span>
							)}
						</div>
					</div>
				</div>
				<div className="fieldset">
					<h1>Informations personnelles</h1>
					<div className="row">
						<div className="col-sm-12 col-md-6">
							<TextField
								id="salemanNumber"
								name="salemanNumber"
								label="# Vendeur"
								type="text"
								classes={{ root: 'form-group' }}
								inputProps={{ maxLength: 100 }}
								helperText={errors.salemanNumber && errors.salemanNumber.message}
								error={Boolean(errors.salemanNumber)}
								fullWidth
								inputRef={register(validations.salemanNumber)}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12 col-md-6">
							<TextField
								id="name"
								name="name"
								label="Nom"
								type="text"
								classes={{ root: 'form-group' }}
								inputProps={{ maxLength: 100 }}
								helperText={errors.name && errors.name.message}
								error={Boolean(errors.name)}
								fullWidth
								inputRef={register(validations.name)}
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
						{user ? 'Mise à jour' : 'Ajouter'}
					</Button>
				</DialogActions>
			</form>
		</>
	)
}

export default UserForm
