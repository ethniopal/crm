import React from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

import Card from '../../components/Card/Card.js'
import CardHeader from '../../components/Card/CardHeader.js'
import CardBody from '../../components/Card/CardBody.js'
import CardFooter from '../../components/Card/CardFooter.js'

import Button from '../../components/CustomButtons/Button.js'

import SubmissionForm from '../../components/Submission/SubmissionForm'

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

export default function SubmissionList(props) {
	const classes = useStyles()
	return (
		<div>
			<Card>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Modifier une soumission</h4>
				</CardHeader>
				<CardBody>
					<SubmissionForm {...props} />
				</CardBody>
			</Card>
		</div>
	)
}
