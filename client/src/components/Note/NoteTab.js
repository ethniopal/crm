import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

//card
import Card from '../Card/Card.js'
import CardHeader from '../Card/CardHeader.js'
import CardBody from '../Card/CardBody.js'

import NoteForm from './NoteForm'
import NoteDataList from './NoteDataList'

import Button from '../CustomButtons/Button.js'
//popup
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'

//icons
import { Add } from '@material-ui/icons'

const token = localStorage.getItem('jwt')

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

const NoteTab = ({ customer, handleOpenNotification, ...props }) => {
	let { customerId, option, id: noteId } = props.match.params

	const [note, setNote] = useState(null)
	const [notes, setNotes] = useState(null)
	const [open, setOpen] = useState(!!noteId)
	const [isLoading, setIsLoading] = useState(false)

	const handleClickOpen = () => {
		props.history.push(`/admin/customers/${customerId}/${option}`)
		setIsLoading(true)

		setOpen(true)
	}

	const handleClose = () => {
		props.history.push(`/admin/customers/${customerId}/${option}`)

		setOpen(false)
	}

	//récupère les informations du client désiré
	useEffect(() => {
		if (!customerId) return null

		let isComponentMounted = true
		const abortController = new AbortController()
		const fetchData = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/${customerId}/note`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` },
					method: 'get'
				})

				const data = await response.json()

				if (data.success && isComponentMounted) {
					setNotes(data.data)
				}
			} catch (error) {
				console.log(error)
				if (error.name === 'AbortError') {
				}
			}

			setIsLoading(true)
		}

		fetchData()

		return () => {
			abortController.abort()
			isComponentMounted = false
		}
	}, [customerId])

	useEffect(() => {
		if (!noteId) return null
		let isComponentMounted = true
		const abortController = new AbortController()
		const fetchData = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${noteId}`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` },
					method: 'get'
				})
				const data = await response.json()

				if (data.success && isComponentMounted) {
					setNote(data.data)
				}
			} catch (error) {
				console.log(error)
				if (error.name === 'AbortError') {
					// Handling error thrown by aborting request
				}
			}

			setIsLoading(true)
		}

		fetchData()

		return () => {
			abortController.abort()
			isComponentMounted = false
		}
	}, [noteId])

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
					Ajouter une note
				</Button>

				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					fullWidth={true}
					maxWidth={'sm'}
				>
					<DialogTitle id="form-dialog-title">Note</DialogTitle>
					{isLoading && (
						<NoteForm
							customer={customer}
							note={note}
							setNotes={setNotes}
							notes={notes}
							handleClose={handleClose}
							handleOpenNotification={handleOpenNotification}
						/>
					)}
				</Dialog>
			</div>
			<CardHeader color="info">
				<h4 className={classes.cardTitleWhite}>Notes</h4>
				<p className={classes.cardCategoryWhite}>Liste des notes associé à ce client</p>
			</CardHeader>
			<CardBody>
				<div className="row">
					<div className="col-lg-12">
						<NoteDataList
							customer={customer}
							notes={notes}
							setNotes={setNotes}
							handleOpenNotification={handleOpenNotification}
						/>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default NoteTab
