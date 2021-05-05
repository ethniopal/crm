import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from 'components/CustomButtons/Button.js'
//card
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardBody from 'components/Card/CardBody.js'
import CardFooter from 'components/Card/CardFooter.js'
// form components
import Autocomplete from '@material-ui/lab/Autocomplete'
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

//icons
import { Add } from '@material-ui/icons'

//custom component
import AddressPartialForm from './AddressPartialForm'

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

const CustomersForm = () => {
	const [client, setClient] = React.useState('')
	const [contact, setContact] = React.useState('')
	const [isNewCustomer, setIsNewCustomer] = React.useState(true)

	const isNewCustomerHandleChange = () => {
		setIsNewCustomer(!isNewCustomer)
	}

	const options = top100Films.map(option => {
		const firstLetter = option.title[0].toUpperCase()
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
			...option
		}
	})

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

	//si soumis correctement
	if (isSubmitSuccessful) {
		console.log('succes')
	}
	console.log('test')

	const classes = useStyles()
	return (
		<form className="outer-spacing" onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Information sur la companie</h4>
				</CardHeader>
				<CardBody>
					<div className="row">
						<div className="col-lg-6">
							<Autocomplete
								id="customerList"
								options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
								groupBy={option => option.firstLetter}
								getOptionLabel={option => option.title}
								style={{ width: 300 }}
								renderInput={params => {
									setClient(params.inputProps.value)
									return (
										<TextField
											{...params}
											label="Sélection du client"
											value={client}
											variant="outlined"
										/>
									)
								}}
							/>

							<FormControl style={{ width: '100%' }} className="form-group">
								<FormControlLabel
									control={
										<Checkbox
											checked={isNewCustomer}
											onChange={isNewCustomerHandleChange}
											name="isNewCustomer"
										/>
									}
									label="Le client n'est pas répertorier dans la liste"
								/>
							</FormControl>
						</div>
						<div className="col-lg-6">
							{client && (
								<Autocomplete
									id="contactList"
									options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
									groupBy={option => option.firstLetter}
									getOptionLabel={option => option.title}
									style={{ width: 300 }}
									renderInput={params => {
										setContact(params.inputProps.value)
										return (
											<TextField
												{...params}
												label="Sélection du contact"
												value={contact}
												variant="outlined"
											/>
										)
									}}
								/>
							)}
						</div>
					</div>

					{
						//affiche seulement si l'option nouveau client est coché
						isNewCustomer && (
							<div>
								<div className="fieldset">
									<h1>Informations</h1>
									<div className="row">
										<div className="col-md-6">
											<TextField
												id="companyName"
												name="companyName"
												label="Nom de la compagnie"
												type="text"
												classes={{ root: 'form-group' }}
												inputProps={{ maxLength: 100 }}
												helperText={errors.companyName && errors.companyName.message}
												error={Boolean(errors.companyName)}
												fullWidth
												inputRef={register(validations.companyName)}
											/>
										</div>
										<div className="col-md-6">
											<TextField
												id="companyContactName"
												name="companyContactName"
												label="Personne ressource"
												classes={{ root: 'form-group' }}
												inputProps={{ maxLength: 100 }}
												helperText={
													errors.companyContactName && errors.companyContactName.message
												}
												error={Boolean(errors.companyContactName)}
												fullWidth
												inputRef={register(validations.companyContactName)}
											/>
										</div>

										<div className="col-md-6">
											<TextField
												id="companyPhone"
												name="companyPhone"
												label="Téléphone"
												classes={{ root: 'form-group' }}
												inputProps={{ maxLength: 100 }}
												helperText={errors.companyPhone && errors.companyPhone.message}
												error={Boolean(errors.companyPhone)}
												fullWidth
												inputRef={register(validations.companyPhone)}
											/>
										</div>
										<div className="col-md-6">
											<TextField
												id="companyEmail"
												name="companyEmail"
												label="Email"
												classes={{ root: 'form-group' }}
												inputProps={{ maxLength: 100 }}
												helperText={errors.companyEmail && errors.companyEmail.message}
												error={Boolean(errors.companyEmail)}
												fullWidth
												inputRef={register(validations.companyEmail)}
											/>
										</div>
									</div>
								</div>

								<AddressPartialForm
									title="Adresse de la compagnie"
									validations={validations}
									errors={errors}
									register={register}
									type="company"
								/>
							</div>
						)
					}
				</CardBody>
			</Card>

			<Card>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Information sur les adresses</h4>
				</CardHeader>
				<CardBody>
					<AddressPartialForm
						title="Adresse source"
						validations={validations}
						errors={errors}
						register={register}
						type="source"
					/>

					<AddressPartialForm
						title="Adresse destination"
						validations={validations}
						errors={errors}
						register={register}
						type="destination"
					/>
					<div className="fieldset">
						<h1>Deadlines</h1>
						<FormControl style={{ width: '100%' }} className="form-group">
							<InputLabel id="dealinesLabel">Dealines</InputLabel>
							<Select
								labelId="dealinesLabel"
								id="dealines"
								name="dealines"
								defaultValue="Urgent"
								// inputRef={register(validations.dealines)}
								error={Boolean(errors.dealines)}
								fullWidth
							>
								<MenuItem value="Regulier">Regulier</MenuItem>
								<MenuItem value="Urgent">Urgent</MenuItem>
							</Select>
						</FormControl>
					</div>
				</CardBody>
			</Card>
			<Card>
				<CardFooter>
					<Button type="submit" color="info">
						Mettre à jour
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}

export default CustomersForm

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
	{ title: 'The Shawshank Redemption', year: 1994 },
	{ title: 'The Godfather', year: 1972 },
	{ title: 'The Godfather: Part II', year: 1974 },
	{ title: 'The Dark Knight', year: 2008 },
	{ title: '12 Angry Men', year: 1957 },
	{ title: "Schindler's List", year: 1993 },
	{ title: 'Pulp Fiction', year: 1994 },
	{ title: 'The Lord of the Rings: The Return of the King', year: 2003 },
	{ title: 'The Good, the Bad and the Ugly', year: 1966 },
	{ title: 'Fight Club', year: 1999 },
	{ title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
	{ title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
	{ title: 'Forrest Gump', year: 1994 },
	{ title: 'Inception', year: 2010 },
	{ title: 'The Lord of the Rings: The Two Towers', year: 2002 },
	{ title: "One Flew Over the Cuckoo's Nest", year: 1975 },
	{ title: 'Goodfellas', year: 1990 },
	{ title: 'The Matrix', year: 1999 },
	{ title: 'Seven Samurai', year: 1954 },
	{ title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
	{ title: 'City of God', year: 2002 },
	{ title: 'Se7en', year: 1995 },
	{ title: 'The Silence of the Lambs', year: 1991 },
	{ title: "It's a Wonderful Life", year: 1946 },
	{ title: 'Life Is Beautiful', year: 1997 },
	{ title: 'The Usual Suspects', year: 1995 },
	{ title: 'Léon: The Professional', year: 1994 },
	{ title: 'Spirited Away', year: 2001 },
	{ title: 'Saving Private Ryan', year: 1998 },
	{ title: 'Once Upon a Time in the West', year: 1968 },
	{ title: 'American History X', year: 1998 },
	{ title: 'Interstellar', year: 2014 },
	{ title: 'Casablanca', year: 1942 },
	{ title: 'City Lights', year: 1931 },
	{ title: 'Psycho', year: 1960 },
	{ title: 'The Green Mile', year: 1999 },
	{ title: 'The Intouchables', year: 2011 },
	{ title: 'Modern Times', year: 1936 },
	{ title: 'Raiders of the Lost Ark', year: 1981 },
	{ title: 'Rear Window', year: 1954 },
	{ title: 'The Pianist', year: 2002 },
	{ title: 'The Departed', year: 2006 },
	{ title: 'Terminator 2: Judgment Day', year: 1991 },
	{ title: 'Back to the Future', year: 1985 },
	{ title: 'Whiplash', year: 2014 },
	{ title: 'Gladiator', year: 2000 },
	{ title: 'Memento', year: 2000 },
	{ title: 'The Prestige', year: 2006 },
	{ title: 'The Lion King', year: 1994 },
	{ title: 'Apocalypse Now', year: 1979 },
	{ title: 'Alien', year: 1979 },
	{ title: 'Sunset Boulevard', year: 1950 },
	{ title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
	{ title: 'The Great Dictator', year: 1940 },
	{ title: 'Cinema Paradiso', year: 1988 },
	{ title: 'The Lives of Others', year: 2006 },
	{ title: 'Grave of the Fireflies', year: 1988 },
	{ title: 'Paths of Glory', year: 1957 },
	{ title: 'Django Unchained', year: 2012 },
	{ title: 'The Shining', year: 1980 },
	{ title: 'WALL·E', year: 2008 },
	{ title: 'American Beauty', year: 1999 },
	{ title: 'The Dark Knight Rises', year: 2012 },
	{ title: 'Princess Mononoke', year: 1997 },
	{ title: 'Aliens', year: 1986 },
	{ title: 'Oldboy', year: 2003 },
	{ title: 'Once Upon a Time in America', year: 1984 },
	{ title: 'Witness for the Prosecution', year: 1957 },
	{ title: 'Das Boot', year: 1981 },
	{ title: 'Citizen Kane', year: 1941 },
	{ title: 'North by Northwest', year: 1959 },
	{ title: 'Vertigo', year: 1958 },
	{ title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
	{ title: 'Reservoir Dogs', year: 1992 },
	{ title: 'Braveheart', year: 1995 },
	{ title: 'M', year: 1931 },
	{ title: 'Requiem for a Dream', year: 2000 },
	{ title: 'Amélie', year: 2001 },
	{ title: 'A Clockwork Orange', year: 1971 },
	{ title: 'Like Stars on Earth', year: 2007 },
	{ title: 'Taxi Driver', year: 1976 },
	{ title: 'Lawrence of Arabia', year: 1962 },
	{ title: 'Double Indemnity', year: 1944 },
	{ title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
	{ title: 'Amadeus', year: 1984 },
	{ title: 'To Kill a Mockingbird', year: 1962 },
	{ title: 'Toy Story 3', year: 2010 },
	{ title: 'Logan', year: 2017 },
	{ title: 'Full Metal Jacket', year: 1987 },
	{ title: 'Dangal', year: 2016 },
	{ title: 'The Sting', year: 1973 },
	{ title: '2001: A Space Odyssey', year: 1968 },
	{ title: "Singin' in the Rain", year: 1952 },
	{ title: 'Toy Story', year: 1995 },
	{ title: 'Bicycle Thieves', year: 1948 },
	{ title: 'The Kid', year: 1921 },
	{ title: 'Inglourious Basterds', year: 2009 },
	{ title: 'Snatch', year: 2000 },
	{ title: '3 Idiots', year: 2009 },
	{ title: 'Monty Python and the Holy Grail', year: 1975 }
]
