import React, { useState, useRef } from 'react'
// @material-ui/core components

// core components
import { TextField } from '@material-ui/core'
import { Fingerprint as GeneratedPasswordIcon } from '@material-ui/icons'

import Button from 'components/CustomButtons/Button.js'

import { generatePassword } from '../../variables/user'

export default function UserProfile({ updatePassword }) {
	const passwordRef = useRef(null)
	const confirmPasswordRef = useRef(null)

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')

	const handleGeneratePassword = () => {
		const password = generatePassword()

		setPassword(password)
		setConfirmPassword(password)

		passwordRef.current.type = 'text'
		confirmPasswordRef.current.type = 'text'
	}

	const handleChangeTextPassword = e => {
		const { name, value } = e.target

		if (name === 'password') {
			setPassword(value)
		}
		if (name === 'confirm') {
			setConfirmPassword(value)
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		let errorMsg = ''
		if (password.length < 10) {
			errorMsg = 'Votre mot de passe contient moins de 10 caractères.'
		}
		if (password !== confirmPassword) {
			errorMsg += 'Veuillez confirmer le mot de passe.'
		}
		setError(errorMsg)
		if (errorMsg === '') {
			updatePassword({ password: password })
		}
	}

	return (
		<form onSubmit={e => handleSubmit(e)} className="outer-spacing">
			<div className="row">
				<div className="col-sm-12 col-md-12 ">
					<div className="form-group">
						<Button
							variant="outlined"
							color="info"
							startIcon={<GeneratedPasswordIcon />}
							onClick={() => handleGeneratePassword()}
						>
							Générer un mot de passe
						</Button>
						<p style={{ lineHeight: '1.2', fontSize: '1rem' }}>
							Veuillez vous assurez que vous avez une copie du mot de passe avant d'enregistrer. Taille
							minimum du mot de passe de 10 caractères
						</p>
					</div>
				</div>

				<div className="col-sm-12 col-md-12">
					<TextField
						inputRef={passwordRef}
						id="password"
						name="password"
						label="Mot de passe"
						type="password"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 100 }}
						value={password}
						onChange={e => handleChangeTextPassword(e)}
						fullWidth
						required
					/>
				</div>

				<div className="col-sm-12 col-md-12">
					<TextField
						inputRef={confirmPasswordRef}
						id="confirm"
						name="confirm"
						label="Confirmer le mot de passe"
						type="password"
						classes={{ root: 'form-group' }}
						value={confirmPassword}
						onChange={e => handleChangeTextPassword(e)}
						fullWidth
						required
					/>
				</div>
				<div className="col-sm-12 col-md-12">
					{error && <p style={{ lineHeight: '1.2', fontSize: '0.8rem', color: 'red' }}>{error}</p>}
				</div>
				<div className="col-sm-12 col-md-12">
					<Button
						id="submitbtn"
						name="submitbtn"
						type="submit"
						color="danger"
						classes={{ root: 'form-group' }}
						fullWidth
						required
					>
						Enregistrer le nouveau mot de passe
					</Button>
				</div>
			</div>
		</form>
	)
}
