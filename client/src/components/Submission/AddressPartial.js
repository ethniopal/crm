import React from 'react'
import { TextField } from '@material-ui/core'
// import { registerLocale } from 'react-datepicker'

const AddressPartialForm = ({ title, validations, register, values, type = '', ...props }) => {
	return (
		<div className={title && 'fieldset'}>
			{title && <h1>{title}</h1>}
			<div className="row">
				<div className="col-md-12">
					<TextField
						id={`${type}Address`}
						name={`${type}Address`}
						label="Adresse"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 255 }}
						helperText={validations[`${type}Address`] && validations[`${type}Address`].message}
						error={Boolean(validations[`${type}Address`])}
						defaultValue={values?.address}
						inputRef={register(validations[`${type}Address`])}
						fullWidth
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}City`}
						name={`${type}City`}
						label="Ville"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 150 }}
						helperText={validations[`${type}City`] && validations[`${type}City`].message}
						error={Boolean(validations[`${type}City`])}
						defaultValue={values?.city}
						inputRef={register(validations[`${type}City`])}
						fullWidth
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}Province`}
						name={`${type}Province`}
						label="Province"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 150 }}
						helperText={validations[`${type}Province`] && validations[`${type}Province`].message}
						error={Boolean(validations[`${type}Province`])}
						defaultValue={values?.province}
						inputRef={register(validations[`${type}Province`])}
						fullWidth
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}Country`}
						name={`${type}Country`}
						label="Pays"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 150 }}
						helperText={validations[`${type}Country`] && validations[`${type}Country`].message}
						error={Boolean(validations[`${type}Country`])}
						defaultValue={values?.country}
						inputRef={register(validations[`${type}Country`])}
						fullWidth
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}Zip`}
						name={`${type}Zip`}
						label="Code Postal"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 100 }}
						helperText={validations[`${type}Zip`] && validations[`${type}Zip`].message}
						error={Boolean(validations[`${type}Zip`])}
						defaultValue={values?.zip}
						inputRef={register(validations[`${type}`])}
						fullWidth
					/>
				</div>
			</div>
		</div>
	)
}

export default AddressPartialForm
