import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// @material-ui/core components
//button

//tabs
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import CustomersForm from '../../components/Forms/CustomersForm'
import CustomerBreadcrumbs from '../../components/Breadcrumps/CustomerBreadcrumbs'

import ContactTab from '../../components/Contact/ContactTab'
import ActivityTab from '../../components/Activity/ActivityTab'
import NoteTab from '../../components/Note/NoteTab'
import AttachmentTab from '../../components/Attachment/AttachmentTab'
import SubmissionTab from '../../components/Submission/SubmissionTab'
// import SubmissionForm from 'components/Forms/SubmissionForm'

export default function CustomerPage({ ...props }) {
	let { customerId, option } = props.match.params
	// console.log(customerId)
	let options = ['contacts', 'activites', 'soumissions', 'notes', 'attachments', 'sondages']
	option = options.indexOf(option)
	option = option !== -1 ? option + 1 : 0

	const [notification, setNotification] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'right'
	})
	const [tab, setTab] = useState(option)
	const [customer, setCustomer] = useState(null)

	//récupère les informations du clients
	useEffect(() => {
		if (!customerId) return null
		let isComponentMounted = true
		const abortController = new AbortController()
		const token = localStorage.getItem('jwt')

		//récupère les data
		const fetchData = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/${customerId}`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success && isComponentMounted) {
					setCustomer(data.data)
				} else {
					setNotification({ ...notification, open: true, severity: 'error', message: data.message })
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

	//modifie l'url si besoin
	function handleChangeIndex(event, newValue) {
		if (newValue !== 0 && customerId) {
			props.history.push(`/admin/customers/${customerId}/${options[newValue - 1]}`)
		} else {
			props.history.push(`/admin/customers/${customerId}`)
		}
		setTab(newValue)
	}

	//ferme la notification au besoin
	function handleCloseNotification(event, reason) {
		if (reason === 'clickaway') {
			return
		}
		setNotification({
			...notification,
			open: false
		})
	}

	const handleOpenNotification = newNotification => {
		setNotification({
			...notification,
			...newNotification,
			open: true
		})
	}

	return (
		<div className="row">
			<Snackbar
				open={notification.open}
				autoHideDuration={4000}
				onClose={handleCloseNotification}
				anchorOrigin={{ vertical: notification.vertical, horizontal: notification.horizontal }}
				key={notification.vertical + notification.horizontal}
			>
				<Alert onClose={handleCloseNotification} severity={notification.severity}>
					{notification.message}
				</Alert>
			</Snackbar>
			<CustomerBreadcrumbs lastOption={option === 0 ? 'Fiche Client' : options[option - 1]} />
			{customer || option ? (
				<>
					<AppBar position="static" color="default">
						<Tabs
							value={tab}
							onChange={handleChangeIndex}
							indicatorColor="primary"
							textColor="primary"
							variant="scrollable"
							scrollButtons="auto"
						>
							<Tab label="Fiche Client" {...a11yProps(0)} />
							<Tab label="Contact" {...a11yProps(1)} />
							<Tab label="Activités" {...a11yProps(2)} />
							<Tab label="Soumissions" {...a11yProps(3)} />
							<Tab label="Notes" {...a11yProps(4)} />
							<Tab label="Pièces jointes" {...a11yProps(5)} />
						</Tabs>
					</AppBar>

					<TabPanel value={tab} index={0}>
						<CustomersForm
							customer={customer}
							setCustomer={setCustomer}
							handleOpenNotification={handleOpenNotification}
						/>
					</TabPanel>
					<TabPanel value={tab} index={1}>
						<ContactTab customer={customer} handleOpenNotification={handleOpenNotification} {...props} />
					</TabPanel>
					<TabPanel value={tab} index={2}>
						<ActivityTab customer={customer} handleOpenNotification={handleOpenNotification} {...props} />
					</TabPanel>
					<TabPanel value={tab} index={3}>
						<SubmissionTab customer={customer} handleOpenNotification={handleOpenNotification} {...props} />
					</TabPanel>
					<TabPanel value={tab} index={4}>
						<NoteTab customer={customer} handleOpenNotification={handleOpenNotification} {...props} />
					</TabPanel>
					<TabPanel value={tab} index={5}>
						<AttachmentTab customer={customer} handleOpenNotification={handleOpenNotification} {...props} />
					</TabPanel>
				</>
			) : (
				<CustomersForm customer={customer} setCustomer={setCustomer} />
			)}
		</div>
	)
}

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			style={{ width: '100%' }}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
}

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`
	}
}
