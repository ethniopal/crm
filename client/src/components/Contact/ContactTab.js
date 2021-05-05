import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'

import DatagridContact from './DatagridContact'

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

const ContactTab = ({ customer, handleOpenNotification, ...props }) => {
	const classes = useStyles()
	return (
		<Card style={{ width: '100%' }}>
			<CardHeader color="info">
				<h4 className={classes.cardTitleWhite}>Contacts</h4>
				<p className={classes.cardCategoryWhite}>Liste des contacts associé à ce client</p>
			</CardHeader>
			<CardBody>
				<div className="row">
					<div className="col-lg-12">
						<DatagridContact {...props} />
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default ContactTab
