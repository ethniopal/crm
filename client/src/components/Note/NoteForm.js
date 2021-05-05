import React, { useState } from 'react'
import Axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'

// material form components
import Button from '../CustomButtons/Button.js'
import { FormControl, TextareaAutosize, TextField, FormHelperText } from '@material-ui/core'
import { Alert } from '@material-ui/lab/'
//popup
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const token = localStorage.getItem('jwt')

const NoteForm = ({ customer, note, notes, setNotes, handleClose, handleOpenNotification }) => {
	const [field, setField] = useState({
		title: note?.title || '',
		description: note?.description || ''
	})
	const [errors, setErrors] = useState({
		title: {
			error: false,
			message: 'Ce champs est requis'
		},
		description: {
			error: false,
			message: 'Ce champs est requis'
		}
	})

	const [serverError, setServerError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

	const handleChangeField = e => {
		const { name, value } = e.target
		setField({ ...field, [name]: value })

		if (!value) {
			setErrors({ ...errors, [name]: { ...errors[name], error: true } })
		} else {
			setErrors({ ...errors, [name]: { ...errors[name], error: false } })
		}
	}

	//create customed
	const createNoteRequest = async () => {
		const config = {
			method: 'post',
			url: `${process.env.REACT_APP_API_URL}/api/customer/${customer._id}/note`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: field
		}

		let res = await Axios(config)
		let { data } = res

		if (data.success) {
			await setNotes([{ ...data.data }, ...notes])
			await handleOpenNotification({ open: true, severity: 'success', message: data.message })
			await handleClose()
		} else {
			await handleOpenNotification({ open: true, severity: 'error', message: data.message })
			await setServerError(data.message)
		}
		setIsSubmitSuccessful(data.success)
	}

	const updateNoteRequest = async () => {
		const config = {
			method: 'put',
			url: `${process.env.REACT_APP_API_URL}/api/notes/${note._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: field
		}

		let res = await Axios(config)
		let { data } = res

		if (data.success) {
			await handleOpenNotification({ open: true, severity: 'success', message: data.message })
			await handleClose()
		} else {
			await handleOpenNotification({ open: true, severity: 'error', message: data.message })
			await setServerError(data.message)
		}
		setIsSubmitSuccessful(data.success)
	}

	//gestion du submit
	const handleSubmit = () => {
		setServerError('')
		let canSave = true
		for (let name in field) {
			if (field[name] === '') {
				canSave = false
				setErrors({ ...errors, [name]: { ...errors[name], error: true } })
			}
		}

		if (canSave) {
			try {
				if (!note?._id) {
					createNoteRequest()
				} else {
					updateNoteRequest()
				}
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
									placeholder="Inscrire un titre pour mieu positionner la note"
								/>

								{errors.title.error && (
									<FormHelperText error={Boolean(errors.title.message)}>
										{errors.title.message}
									</FormHelperText>
								)}
							</FormControl>

							<FormControl style={{ width: '100%' }} className="form-group">
								<TextareaAutosize
									id="description"
									name="description"
									aria-label="description"
									className="textareaAutosize"
									label="Description"
									rowsMin={5}
									onChange={e => handleChangeField(e)}
									onBlur={e => handleChangeField(e)}
									value={field.description}
									placeholder="Décrire la note"
								/>

								{errors.description.error && (
									<FormHelperText error={Boolean(errors.description.message)}>
										{errors.description.message}
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
					{note?.description ? 'Mise à jour' : 'Ajouter'}
				</Button>
			</DialogActions>
		</>
	)
}

export default NoteForm
