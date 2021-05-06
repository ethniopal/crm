import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'

// import SubmissionDataList from './SubmissionDataList'
import DatagridSubmission from './DatagridSubmission'

import Button from 'components/CustomButtons/Button.js'

//icons
import { Add } from '@material-ui/icons'

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

const SubmissionTab = ({ customer, handleOpenNotification, ...props }) => {
	let { customerId, option, id: submissionId } = props.match.params

	const [contact, setContact] = useState(null)
	const [open, setOpen] = useState(!!submissionId)
	const [isLoading, setIsLoading] = useState(false)

	const handleClickOpen = () => {
		props.history.push(`/admin/customers/${customerId}/${option}`)
		setIsLoading(true)
		setContact(null)

		setOpen(true)
	}

	useEffect(() => {
		if (!submissionId) return null
		let isComponentMounted = true
		const abortController = new AbortController()
		const token = localStorage.getItem('jwt')

		//récupère les data
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/submission/${submissionId}`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success && isComponentMounted) {
					setContact(data.data)
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
	}, [submissionId])

	const classes = useStyles()
	return (
		<Card style={{ width: '100%' }}>
			<div className="justify-content-end row">
				<Link to={'/admin/submission/create'}>
					<Button
						variant="contained"
						color="transparent"
						onClick={handleClickOpen}
						startIcon={<Add />}
						style={{ marginRight: 20, marginBottom: 20 }}
					>
						Faire une soumission
					</Button>
				</Link>
			</div>
			<CardHeader color="info">
				<h4 className={classes.cardTitleWhite}>Soumissions</h4>
				<p className={classes.cardCategoryWhite}>Liste des soumissions associé à ce client</p>
			</CardHeader>
			<CardBody>
				<div className="row">
					<div className="col-lg-12">
						<DatagridSubmission {...props} />
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default SubmissionTab
