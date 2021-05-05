import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

//card
import Card from '../Card/Card.js'
import CardHeader from '../Card/CardHeader.js'
import CardBody from '../Card/CardBody.js'

import Button from '../CustomButtons/Button.js'
//popup
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'

//icons
import { Add } from '@material-ui/icons'

//components
import AttachmentDataList from './AttachmentDataList'
import AttachmentForm from './AttachmentForm.js'

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

const AttachmentTab = ({ customer, handleOpenNotification, ...props }) => {
	let { customerId, option, id: attachmentId } = props.match.params

	const [attachments, setAttachments] = useState([])
	const [open, setOpen] = useState(!!attachmentId)
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

	useEffect(() => {
		if (!customerId) return null
		let isComponentMounted = true
		const abortController = new AbortController()
		const token = localStorage.getItem('jwt')

		//récupère les data
		const fetchData = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/${customerId}/attachment`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success && isComponentMounted) {
					setAttachments(data.data)
				} else {
					handleOpenNotification({ open: true, severity: 'error', message: data.message })
				}
			} catch (error) {
				console.log(error)
				if (error.name === 'AbortError') {
					// Handling error thrown by aborting request
				}
			}
		}

		fetchData()

		return () => {
			abortController.abort()
			isComponentMounted = false
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customerId])

	// console.log(attachments)
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
					Ajouter un fichier
				</Button>

				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					fullWidth={true}
					maxWidth={'sm'}
				>
					<DialogTitle id="form-dialog-title">Pièce jointe</DialogTitle>
					{isLoading && (
						<AttachmentForm
							customer={customer}
							attachments={attachments}
							setAttachments={setAttachments}
							handleClose={handleClose}
							handleOpenNotification={handleOpenNotification}
						/>
					)}
				</Dialog>
			</div>
			<CardHeader color="info">
				<h4 className={classes.cardTitleWhite}>Pièces jointes</h4>
				<p className={classes.cardCategoryWhite}>Liste des pièces jointes associé à ce client</p>
			</CardHeader>
			<CardBody>
				<div className="row">
					<div className="col-lg-12">
						<AttachmentDataList
							customer={customer}
							attachments={attachments}
							setAttachments={setAttachments}
							handleOpenNotification={handleOpenNotification}
						/>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default AttachmentTab
