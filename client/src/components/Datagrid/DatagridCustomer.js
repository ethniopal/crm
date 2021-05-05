import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DataGrid from './Datagrid'

import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'

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

function DatagridCustomer() {
	const classes = useStyles()

	return (
		<>
			<Card>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Liste des clients</h4>
					<p className={classes.cardCategoryWhite}>Visualiser la liste des clients</p>
				</CardHeader>
				<CardBody>
					<DataGrid />
				</CardBody>
			</Card>
		</>
	)
}

export default DatagridCustomer
