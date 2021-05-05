import React, { useState, useEffect } from 'react'

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
	Radio,
	RadioGroup,
	TextareaAutosize
} from '@material-ui/core'

import AddressPartialForm from './AddressPartial'

//css
const styles = {
	card: {
		marginBottom: '90px'
	},
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
	},
	unit: {
		height: '56px',
		flex: '1 0 auto'
	},
	dimensions: {
		flex: '1 0 auto'
	}
}
const useStyles = makeStyles(styles)

const SubmissionForm = () => {
	const classes = useStyles()

	const [client, setClient] = React.useState('')
	const [contact, setContact] = React.useState('')
	const [isNewCustomer, setIsNewCustomer] = React.useState(true)

	const [fields, setFields] = useState({
		title: '',
		description: ''
	})

	const [validations, setValidations] = useState({
		title: {
			rules: { required: true },
			error: false
		},
		description: {
			rules: { required: true },
			error: false
		}
	})

	const isValid = (name, value) => {
		const { rules, error } = validations[name]
		if (!rules) return true

		Object.keys(rules).map(rule => {})
	}

	const handleChangeField = e => {
		const { name, value } = e.target
		switch (name) {
			default:
				setFields({ ...fields, [name]: value })
		}
	}

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
	console.log(fields)

	return (
		<div>
			<Card className={classes.card}>
				<CardHeader color="info">
					<h4>Information sur la companie</h4>
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
												helperText={validations.companyName && validations.companyName.message}
												error={Boolean(validations.companyName)}
												fullWidth
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
													validations.companyContactName &&
													validations.companyContactName.message
												}
												error={Boolean(validations.companyContactName)}
												fullWidth
											/>
										</div>

										<div className="col-md-6">
											<TextField
												id="companyPhone"
												name="companyPhone"
												label="Téléphone"
												classes={{ root: 'form-group' }}
												inputProps={{ maxLength: 100 }}
												helperText={
													validations.companyPhone && validations.companyPhone.message
												}
												error={Boolean(validations.companyPhone)}
												fullWidth
											/>
										</div>
										<div className="col-md-6">
											<TextField
												id="companyEmail"
												name="companyEmail"
												label="Email"
												classes={{ root: 'form-group' }}
												inputProps={{ maxLength: 100 }}
												helperText={
													validations.companyEmail && validations.companyEmail.message
												}
												error={Boolean(validations.companyEmail)}
												fullWidth
											/>
										</div>
									</div>
								</div>

								<AddressPartialForm
									title="Adresse de la compagnie"
									type="company"
									validations={validations}
								/>
							</div>
						)
					}
				</CardBody>
			</Card>

			<Card className={classes.card}>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Information sur les adresses</h4>
				</CardHeader>
				<CardBody>
					<AddressPartialForm title="Adresse source" type="source" validations={validations} />

					<AddressPartialForm title="Adresse destination" type="destination" validations={validations} />
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
								error={Boolean(validations.dealines)}
								fullWidth
							>
								<MenuItem value="Regulier">Regulier</MenuItem>
								<MenuItem value="Urgent">Urgent</MenuItem>
							</Select>
						</FormControl>
					</div>
				</CardBody>
			</Card>

			<Card className={classes.card}>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Information sur la marchandise</h4>
				</CardHeader>
				<CardBody>
					<div className="fieldset">
						<div className="row">
							<div className="col-md-6">
								<FormControl style={{ width: '100%' }} className="form-group">
									<InputLabel id="typeTransportLabel">Type de transport</InputLabel>
									<Select
										labelId="typeTransportLabel"
										id="typeTransport"
										name="typeTransport"
										defaultValue="FLT"
										// inputRef={register(validations.dealines)}
										error={Boolean(validations.dealines)}
										fullWidth
									>
										<MenuItem value="FLT">FLT</MenuItem>
										<MenuItem value="LTL">LTL</MenuItem>
									</Select>
								</FormControl>
							</div>

							<div className="col-md-6">
								<FormControl style={{ width: '100%' }} className="form-group">
									<InputLabel id="commodityLabel">Marchandise</InputLabel>
									<Select
										labelId="commodityLabel"
										id="commodity"
										name="commodity"
										defaultValue="Palette"
										// inputRef={register(validations.dealines)}
										error={Boolean(validations.commodity)}
										fullWidth
									>
										<MenuItem value="Palette">Palette</MenuItem>
										<MenuItem value="Boîte">Boîte</MenuItem>
										<MenuItem value="Unité">Unité</MenuItem>
									</Select>
								</FormControl>
							</div>

							<div className="col-md-6">
								<TextField
									id="quantity"
									name="quantity"
									label="Quantité"
									classes={{ root: 'form-group' }}
									inputProps={{ maxLength: 50 }}
									helperText={validations.quantity && validations.quantity.message}
									error={Boolean(validations.quantity)}
									fullWidth
								/>
							</div>

							<div className={'col-md-6'} style={{ display: 'flex', alignItems: 'bottom' }}>
								<TextField
									id="dimensions"
									name="dimensions"
									label="Dimensions"
									classes={{ root: 'form-group' }}
									className={classes.dimensions}
									placeholder="L x W x H"
									inputProps={{ maxLength: 50 }}
									helperText={validations.dimensions && validations.dimensions.message}
									error={Boolean(validations.dimensions)}
								/>
								<Select
									labelId="unitDimension"
									id="unitDimension"
									name="unitDimension"
									defaultValue="Pied"
									className={classes.unit}
									// inputRef={register(validations.dealines)}
									error={Boolean(validations.unit)}
								>
									<MenuItem value="Pied">Pied</MenuItem>
									<MenuItem value="Pouce">Po</MenuItem>
									<MenuItem value="Cm">CM</MenuItem>
								</Select>
							</div>

							<div className={'col-md-6'} style={{ display: 'flex', alignItems: 'bottom' }}>
								<TextField
									id="totalWeight"
									name="totalWeight"
									label="Poids Total"
									classes={{ root: 'form-group' }}
									className={classes.dimensions}
									placeholder="ex: 75000"
									inputProps={{ maxLength: 50 }}
									helperText={validations.dimensions && validations.dimensions.message}
									error={Boolean(validations.dimensions)}
								/>
								<Select
									labelId="unitWeight"
									id="unitWeight"
									name="unitWeight"
									defaultValue="lb"
									className={classes.unit}
									// inputRef={register(validations.dealines)}
									error={Boolean(validations.unit)}
								>
									<MenuItem value="lb">lb</MenuItem>
									<MenuItem value="kg">kg</MenuItem>
								</Select>
							</div>

							<div className={'col-md-6'}>
								<div style={{ marginTop: '10px' }}>
									<InputLabel>Oversized</InputLabel>
									<RadioGroup row defaultValue="Non" aria-label="Oversize">
										<FormControlLabel value="Oui" control={<Radio />} label="Oui" />
										<FormControlLabel value="Non" control={<Radio />} label="Non" />
									</RadioGroup>
									<div>
										<small>Si oui, veuillez compléter la section "Autre Détails"</small>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="fieldset">
						<h1>Hazmat</h1>
						<div className="row">
							<div className={'col-md-6'}>
								<div style={{ marginTop: '10px' }}>
									<RadioGroup row defaultValue="Non" aria-label="Oversize">
										<FormControlLabel value="Oui" control={<Radio />} label="Oui" />
										<FormControlLabel value="Non" control={<Radio />} label="Non" />
									</RadioGroup>
								</div>
							</div>
						</div>
					</div>

					<div className="fieldset">
						<h1>Autre détails</h1>
						<div className="row">
							<div className={'col-md-12'}>
								<div style={{ marginTop: '10px' }}>
									<TextareaAutosize
										id="otherDetail"
										name="otherDetail"
										aria-label="otherDetail"
										className="textareaAutosize"
										label="otherDetail"
										rowsMin={5}
										onChange={e => handleChangeField(e)}
										value={fields.otherDetail}
										placeholder=""
										style={{ width: '100%' }}
									/>

									{validations.otherDetail?.error && (
										<FormHelperText error={Boolean(validations.otherDetail.message)}>
											{validations.otherDetail.message}
										</FormHelperText>
									)}
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card className={classes.card}>
				<CardHeader color="info">
					<h4 className={classes.cardTitleWhite}>Information sur la marchandise</h4>
				</CardHeader>
				<CardBody>
					<div className="fieldset">
						<div className="row">
							<div className={'col-md-6'}>
								<FormControl style={{ width: '100%' }} className="form-group">
									<InputLabel id="transportLabel">Transport</InputLabel>
									<Select
										labelId="transportLabel"
										id="transport"
										name="transport"
										defaultValue="Général"
										// inputRef={register(validations.dealines)}
										error={Boolean(validations.transport)}
										fullWidth
									>
										<MenuItem value="Général">Général</MenuItem>
										<MenuItem value="Spécilisé">Spécilisé</MenuItem>
									</Select>
								</FormControl>
							</div>

							<div className={'col-md-6'}>
								<FormControl style={{ width: '100%' }} className="form-group">
									<InputLabel id="commodityLabel">Type de remorque</InputLabel>
									<Select
										labelId="remorqueLabel"
										id="remorque"
										name="remorque"
										defaultValue="Drybox"
										// inputRef={register(validations.dealines)}
										error={Boolean(validations.commodity)}
										fullWidth
									>
										<MenuItem value="Drybox">Drybox</MenuItem>
										<MenuItem value="Réfrigéré">Réfrigéré</MenuItem>
										<MenuItem value="Chauffé">Chauffé</MenuItem>
									</Select>
								</FormControl>
							</div>

							<div className={'col-md-6'}>
								<div style={{ marginTop: '10px' }}>
									<InputLabel>Toiles</InputLabel>
									<RadioGroup row defaultValue="Oui" aria-label="Toiles">
										<FormControlLabel value="Oui" control={<Radio />} label="Oui" />
										<FormControlLabel value="Non" control={<Radio />} label="Non" />
									</RadioGroup>
								</div>
							</div>
						</div>
					</div>

					<div className="fieldset">
						<h1>Autre détails</h1>
						<div className="row">
							<div className={'col-md-12'}>
								<div style={{ marginTop: '10px' }}>
									<TextareaAutosize
										id="otherDetailEquipment"
										name="otherDetailEquipment"
										aria-label="otherDetailEquipment"
										className="textareaAutosize"
										label="otherDetailEquipment"
										rowsMin={5}
										onChange={e => handleChangeField(e)}
										value={fields.otherDetailEquipment}
										placeholder=""
										style={{ width: '100%' }}
									/>

									{validations.otherDetailEquipment?.error && (
										<FormHelperText error={Boolean(validations.otherDetailEquipment.message)}>
											{validations.otherDetailEquipment.message}
										</FormHelperText>
									)}
								</div>
							</div>
						</div>
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
		</div>
	)
}

export default SubmissionForm

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

const defaultRule = {
	required: {
		value: false,
		message: 'Ce champs est requis'
	},
	number: {
		value: false,
		message: 'Ce champs doit être un nombre'
	},
	minChar: {
		value: 0,
		message: `Ce champs ne conti`
	},
	maxChar: {
		value: 255,
		message: `Ce champs est trop  long`
	},
	min: {
		value: 0,
		message: `La valeur inscrite n'est pas suffisament haute`
	},
	max: {
		value: 255,
		message: `La valeur inscrite est trop haute`
	},
	pattern: {
		value: null,
		message: `Ce champs est incorrectement ortographié`
	}
}
