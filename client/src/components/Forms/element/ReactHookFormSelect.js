import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import { Controller } from 'react-hook-form'

const ReactHookFormSelect = ({ name, label, control, defaultValue, children, onChange, value, ...props }) => {
	const labelId = `${name}-label`
	return (
		<FormControl {...props}>
			<InputLabel id={labelId}>{label}</InputLabel>
			<Controller
				render={() => (
					<Select labelId={labelId} label={label} name={`${name}Select`} onChange={onChange} value={value}>
						{children}
					</Select>
				)}
				name={name}
				control={control}
				defaultValue={defaultValue}
			/>
		</FormControl>
	)
}
export default ReactHookFormSelect
