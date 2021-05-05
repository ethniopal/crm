import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
import CardFooter from 'components/Card/CardFooter.js'
// form components
import Button from 'components/CustomButtons/Button.js'
import {
	TextField,
	InputLabel,
	FormControl,
	FormControlLabel,
	MenuItem,
	Checkbox,
	FormHelperText,
	Select,
	TextareaAutosize
} from '@material-ui/core'

//popup
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

//icons
import { Add } from '@material-ui/icons'

import { useForm } from 'react-hook-form'
import { isEmpty } from 'lodash'
import { regexEmail } from 'variables/regex'

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

const ActivityForm = () => {
	const [open, setOpen] = React.useState(false)
	const [isNegatif, setIsNegatif] = React.useState(false)

	const isNegatifHandleChange = () => {
		setIsNegatif(!isNegatif)
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	//form validation
	const { register, handleSubmit, formState, errors, setError } = useForm({
		mode: 'onTouched'
	})
	const { isSubmitting, isSubmitted, isSubmitSuccessful } = formState

	//gestion du submit
	const onSubmit = data => {
		console.log(data)
	}

	//gestion des erreurs
	const validations = {
		email: {
			required: 'Vous devez compléter ce champ',
			pattern: {
				value: regexEmail,
				message: 'Vous devez avoir un courriel valide'
			}
		},
		remember: {}
	}

	//si soumis correctement
	if (isSubmitSuccessful) {
		console.log('succes')
	}

	const classes = useStyles()

	var dateNow = new Date()
	var day = dateNow.getDate().toString().padStart(2, '0')
	var month = (1 + dateNow.getMonth()).toString().padStart(2, '0')
	var hour = dateNow.getHours().toString().padStart(2, '0')
	var minute = dateNow.getMinutes().toString().padStart(2, '0')
	// var sec = dateNow.getSeconds().toString().padStart(2, "0")
	// var ms = dateNow.getMilliseconds().toString().padStart(3, "0")
	var inputDate = `${dateNow.getFullYear()}-${month}-${day}T${hour}:${minute}`

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
				<Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
					<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
						<DialogTitle id="form-dialog-title">Nouvelle Note</DialogTitle>
						<DialogContent>
							<DialogContentText>Veuillez complétez tous les champs obligatoire.</DialogContentText>

							<div className="fieldset">
								<div className="row">
									<div className="col-lg-12">
										<FormControl style={{ width: '100%' }} className="form-group">
											<TextareaAutosize
												id="noteCustomer"
												name="noteCustomer"
												aria-label="Description de la note"
												className="textareaAutosize"
												label="Description de la note"
												floatingLabel={true}
												rowsMin={10}
												placeholder="Inscrire une description de la note"
											/>
										</FormControl>
									</div>
								</div>
							</div>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose} color="danger">
								Cancel
							</Button>
							<Button type="submit" color="info">
								Ajouter
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			</div>
			<CardHeader color="info">
				<h4 className={classes.cardTitleWhite}>Notes</h4>
				<p className={classes.cardCategoryWhite}>Liste des notes associé à ce client</p>
			</CardHeader>
			<CardBody>
				<div className="row">
					<div className="col-lg-12">
						<p>List</p>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default ActivityForm
