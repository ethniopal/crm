import React from 'react'
import { TextField } from '@material-ui/core'

const AddressPartialForm = ({ title, errors, validations, register, type = '', ...props }) => {
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
						helperText={errors[`${type}Address`] && errors[`${type}Address`].message}
						error={Boolean(errors[`${type}Address`])}
						fullWidth
						inputRef={register(validations[`${type}Address`])}
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}City`}
						name={`${type}City`}
						label="Ville"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 150 }}
						helperText={errors[`${type}City`] && errors[`${type}City`].message}
						error={Boolean(errors[`${type}City`])}
						fullWidth
						inputRef={register(validations[`${type}City`])}
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}Province`}
						name={`${type}Province`}
						label="Province"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 150 }}
						helperText={errors[`${type}Province`] && errors[`${type}Province`].message}
						error={Boolean(errors[`${type}Province`])}
						fullWidth
						inputRef={register(validations[`${type}Province`])}
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}Country`}
						name={`${type}Country`}
						label="Pays"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 150 }}
						helperText={errors[`${type}Country`] && errors[`${type}Country`].message}
						error={Boolean(errors[`${type}Country`])}
						fullWidth
						inputRef={register(validations[`${type}Country`])}
					/>
				</div>
				<div className="col-md-6">
					<TextField
						id={`${type}Zip`}
						name={`${type}Zip`}
						label="Code Postal"
						classes={{ root: 'form-group' }}
						inputProps={{ maxLength: 100 }}
						helperText={errors[`${type}Zip`] && errors[`${type}Zip`].message}
						error={Boolean(errors[`${type}Zip`])}
						fullWidth
						inputRef={register(validations[`${type}Zip`])}
					/>
				</div>
			</div>
		</div>
	)
}

export default AddressPartialForm
