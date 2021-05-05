import React, { useState } from 'react'
import axios from 'axios'
//material-ui
import { Paper, TextField, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab/'
//libs
import { useForm } from 'react-hook-form'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import GlobalStyles from 'assets/GlobalStyles'

//constant
import { regexEmail } from '../../variables/regex'

const LoginForm = ({ ...props }) => {
	// const history = useHistory()
	const { REACT_APP_API_URL } = process.env

	const [serverError, setServerError] = useState('')
	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

	const { register, handleSubmit, formState, errors } = useForm({
		mode: 'onTouched'
	})
	const { isSubmitting, isSubmitted } = formState

	//gestion du submit
	const onSubmit = async data => {
		if (isSubmitting) {
			return
		}
		await setIsSubmitSuccessful(false)
		await setServerError('')
		const { username: email, password } = data
		const jsonAuth = await JSON.stringify({ email, password })
		await postAuthData(jsonAuth)
	}

	//requête pour envoyé les data de connexion
	async function postAuthData(dataForm) {
		if (isEmpty(dataForm)) {
			return
		}
		try {
			let responseAuth = await axios.post(`${REACT_APP_API_URL}/api/auth/signin`, dataForm, {
				headers: {
					'Content-Type': 'application/json'
				}
			})

			let { data } = responseAuth
			if (data.error) {
				await setServerError(data.error)
			} else {
				localStorage.setItem('jwt', data.token)
				localStorage.setItem('permission', data.permission)
				localStorage.setItem('user', data.user)
				window.location.href = '/admin/dashboard'
				await setIsSubmitSuccessful(true)
			}
		} catch (error) {
			await setServerError(error)
		}
	}

	//gestion des erreurs
	const validations = {
		username: {
			required: 'Vous devez compléter ce champ',
			pattern: {
				value: regexEmail,
				message: 'Vous devez avoir un courriel valide'
			}
		},
		password: { required: 'Vous devez compléter ce champ' },
		remember: {}
	}

	//rendu
	return (
		<>
			<GlobalStyles />

			<LoginFormStyled>
				<Paper className="login-form" elevation={3}>
					<h1 className="title">Connexion</h1>
					<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
						<div className="form-group">
							{/* {isSubmitSuccessful && <Redirect to="/admin/dashboard" />} */}
							{isSubmitted && !isEmpty(serverError) && (
								<Alert severity="error">
									<b>{serverError}</b>
								</Alert>
							)}
						</div>
						<div className="form-group">
							<TextField
								id="username"
								name="username"
								label="Courriel"
								type="email"
								inputProps={{ maxLength: 100 }}
								helperText={errors.username && errors.username.message}
								error={Boolean(errors.username)}
								fullWidth
								autoFocus
								required
								inputRef={register(validations.username)}
							/>
						</div>
						<div className="form-group">
							<TextField
								id="password"
								name="password"
								label="Mot de passe"
								type="password"
								inputProps={{
									maxLength: 100,
									autoComplete: 'on'
								}}
								fullWidth
								required
								helperText={errors.password && errors.password.message}
								error={Boolean(errors.password)}
								inputRef={register(validations.password)}
							/>
						</div>
						{/* <div className="form-group flex-between">
							<FormControlLabel
								control={
									<Checkbox
										color="primary"
										name="remember"
										inputRef={register(validations.remember)}
									/>
								}
								label="Se souvenir de moi"
							/>

							<Button
								disableFocusRipple
								disableRipple
								style={{ textTransform: 'none' }}
								variant="text"
								color="primary"
							>
								Mot de passe oublié ?
							</Button>
						</div> */}

						<Button
							// disabled={isSubmitting}
							className="submit-button"
							variant="outlined"
							color="primary"
							style={{ textTransform: 'none' }}
							type="submit"
						>
							Login
						</Button>
					</form>
				</Paper>
			</LoginFormStyled>
		</>
	)
}

const LoginFormStyled = styled.div`
	max-width: 500px;
	margin: 2rem auto;
	.title {
		text-align: center;
	}
	.login-form {
		padding: 0.5rem;
	}
	.form-group {
		margin: 0.5rem;
	}

	.submit-button {
		display: block;
		margin: 0 auto;
	}
`

export default LoginForm
