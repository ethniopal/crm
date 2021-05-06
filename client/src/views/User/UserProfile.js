import React, { useState, useEffect, useRef } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import { Toast } from 'primereact/toast'

import FormPassword from '../../components/Users/FormPassword.js'
import UserForm from '../../components/Users/FormUser'

import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'

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

export default function UserProfile() {
	const token = localStorage.getItem('jwt')

	const [user, setUser] = useState(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [serverError, setServerError] = useState('')
	const toast = useRef(null)

	const controller = new AbortController()
	const { signal } = controller
	const updateUser = async postData => {
		const res = await fetch(`/api/user/${user._id}`, {
			method: 'PUT',
			body: JSON.stringify(postData),
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			setUser({ ...user })

			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Utilisateur mis à jour', life: 3000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
		}
	}

	const updatePassword = async postData => {
		const res = await fetch(`/api/user/password/${user._id}`, {
			method: 'PATCH',
			body: JSON.stringify(postData),
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			toast.current.show({
				severity: 'success',
				summary: 'Réussi',
				detail: 'Mot de passe mis à jour',
				life: 3000
			})
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: 'Le mot de passe a échoué', life: 3000 })
		}
	}

	useEffect(() => {
		fetch(`/api/profile`, {
			...signal,
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					setUser(data.data)
					setIsLoaded(true)
				}
			})

		return () => controller.abort()
	}, [])

	const classes = useStyles()
	return (
		<div className="row">
			<Toast ref={toast} />
			<div className="col-lg-12">
				<Card>
					<CardHeader color="info">
						<h4 className={classes.cardTitleWhite}>Editer votre Profil</h4>
						<p className={classes.cardCategoryWhite}>Compléter votre profil</p>
					</CardHeader>
					<CardBody>
						{isLoaded && (
							<UserForm
								user={user}
								handleClose={() => {}}
								updateUser={updateUser}
								serverError={serverError}
								setServerError={setServerError}
							/>
						)}
					</CardBody>
				</Card>

				<Card style={{ marginTop: 120 }}>
					<CardHeader color="danger">
						<h4 className={classes.cardTitleWhite}>Nouveau mot de passe</h4>
						<p className={classes.cardCategoryWhite}>Vous désirez un nouveau mot de passe?</p>
					</CardHeader>
					<CardBody style={{ maxWidth: 600 }}>
						<FormPassword updatePassword={updatePassword} style={{ maxWidth: '600px' }} />
					</CardBody>
				</Card>
			</div>
		</div>
	)
}
