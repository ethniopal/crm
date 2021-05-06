import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'

// material form components
import Button from '../CustomButtons/Button.js'
import { FormControl, TextField, FormHelperText } from '@material-ui/core'
import { Alert } from '@material-ui/lab/'
//popup
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const token = localStorage.getItem('jwt')

const AttachmentForm = ({ customer, setAttachments, attachments, handleClose, handleOpenNotification }) => {
	const [field, setField] = useState({
		title: '',
		file: ''
	})
	const [errors, setErrors] = useState({
		title: {
			error: false,
			message: 'Ce champs est requis'
		},
		file: {
			error: false,
			message: 'Ce champs est requis'
		}
	})

	const [serverError, setServerError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

	const handleChangeField = e => {
		const { name, value, type } = e.target

		if (type === 'file') {
			setField({ ...field, [name]: e.target.files[0] })
		} else {
			setField({ ...field, [name]: value })
		}

		if (!value) {
			setErrors({ ...errors, [name]: { ...errors[name], error: true } })
		} else {
			setErrors({ ...errors, [name]: { ...errors[name], error: false } })
		}
	}

	//create customed
	const createAttachmentRequest = async () => {
		const formData = new FormData()

		formData.append('file', field.file, field.file.name)
		formData.append('title', field.title)

		const myHeaders = new Headers()
		myHeaders.append('Authorization', `Bearer ${token}`)

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: formData,
			redirect: 'follow'
		}

		const url = `/api/customer/${customer._id}/upload-single`
		const response = await fetch(url, requestOptions)
		const data = await response.json()

		if (data.success) {
			handleOpenNotification({ open: true, severity: 'success', message: data.message })

			setAttachments([...attachments, { ...data.data }])
			handleClose()
		} else {
			handleOpenNotification({ open: true, severity: 'error', message: data.message })
			setServerError(data.message)
		}
		setIsSubmitSuccessful(data.success)
	}

	//gestion du submit
	const handleSubmit = () => {
		//save the datas
		setServerError('')
		let canUpload = true
		for (let name in field) {
			if (!field[name]) {
				canUpload = false
				setErrors({ ...errors, [name]: { ...errors[name], error: true } })
			}
		}

		if (canUpload) {
			try {
				createAttachmentRequest()
			} catch (err) {
				setServerError(err)
			}
		} else {
			setServerError('Vous devez compléter tous les champs obligatoires.')
		}
	}

	if (isSubmitSuccessful) {
	}

	return (
		<>
			<DialogContent>
				<DialogContentText>Veuillez complétez tous les champs obligatoire.</DialogContentText>
				{serverError && (
					<Alert severity="error">
						<b dangerouslySetInnerHTML={{ __html: serverError }}></b>
					</Alert>
				)}
				<div className="fieldset">
					<div className="row">
						<div className="col-lg-12">
							<FormControl style={{ width: '100%' }} className="form-group">
								<TextField
									id="title"
									name="title"
									aria-label="title"
									label="Titre"
									onChange={e => handleChangeField(e)}
									onBlur={e => handleChangeField(e)}
									value={field.title}
									placeholder="Inscrire un titre"
								/>

								{errors.title.error && (
									<FormHelperText error={Boolean(errors.title.message)}>
										{errors.title.message}
									</FormHelperText>
								)}
							</FormControl>

							<FormControl style={{ width: '100%' }} className="form-group">
								<input
									type="file"
									name="file"
									onChange={e => handleChangeField(e)}
									onBlur={e => handleChangeField(e)}
								/>
								{errors.file.error && (
									<FormHelperText error={Boolean(errors.file.message)}>
										{errors.file.message}
									</FormHelperText>
								)}
							</FormControl>
						</div>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="danger">
					Cancel
				</Button>
				<Button type="submit" color="info" onClick={handleSubmit}>
					{'Ajouter le fichier'}
				</Button>
			</DialogActions>
		</>
	)
}

export default AttachmentForm
