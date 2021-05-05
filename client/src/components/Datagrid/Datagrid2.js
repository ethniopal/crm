import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import ReactDataGrid from 'react-data-grid'

// import { Draggable } from 'react-data-grid-addons'
// const DraggableContainer = Draggable.Container

const { REACT_APP_API_URL } = process.env
const token = localStorage.getItem('jwt')
const MIN_WIDTH_COLUMN = 160

const PhoneFormatters = ({ row }) => {
	let phoneNumber = ''
	if (row.phone.phone) {
		phoneNumber = row.phone.phone
		if (row.phone.ext) {
			phoneNumber += `, poste ${row.phone.ext}`
		}
	} else if (row.phone.mobile) {
		phoneNumber = row.phone.mobile
	}

	return phoneNumber
}

const OptionFormatter = ({ row }) => {
	if (!row) return ''
	const { _id } = row
	return (
		<div className="datagrid__cell--option">
			<Link to={`/admin/customers/${_id}`}>
				<PermIdentityIcon style={{ color: 'rgb(220, 0, 78)' }} />
			</Link>
			<Link to={`/admin/customers/${_id}`}>
				<DeleteSweepIcon style={{ color: 'rgb(220, 0, 78)' }} />
			</Link>
		</div>
	)
}

const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
	// console.log(initialRows, sortColumn, sortDirection, rows)
	const comparer = (a, b) => {
		if (sortDirection === 'ASC') {
			return a[sortColumn] > b[sortColumn] ? 1 : -1
		} else if (sortDirection === 'DESC') {
			return a[sortColumn] < b[sortColumn] ? 1 : -1
		}
	}
	return sortDirection === 'NONE' ? [...rows] : [...rows].sort(comparer)
}

const defaultColumnProperties = {
	width: MIN_WIDTH_COLUMN,
	sortable: true,
	resizable: true,
	draggable: true
}

const defaultColumns = [
	{
		key: 'refNumber',
		name: 'REF',
		frozen: false,
		width: 75
	},
	{
		key: 'name',
		name: 'Companie',
		sortDescendingFirst: true,
		frozen: false,
		width: 'auto',
		minWidth: MIN_WIDTH_COLUMN
	},
	{
		key: 'phone.phone',
		name: 'Téléphone',
		sortable: false,
		formatter: PhoneFormatters
	},
	{
		key: 'status',
		name: 'Type'
	},
	{
		key: 'options',
		name: 'Options',
		formatter: OptionFormatter,
		sortable: false,
		width: 75
	}
].map(c => ({ ...defaultColumnProperties, ...c }))

function DataGrid({ initialRows = 20 }) {
	const [columns] = useState(defaultColumns)
	const [rows, setRows] = useState([])
	const ROW_COUNT = 20
	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		fetch(`${REACT_APP_API_URL}/api/customer`, {
			...signal,
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					// console.log(data)
					setRows(data.data)
				}
			})

		return () => controller.abort()
	}, [])

	return (
		<>
			<ReactDataGrid
				columns={columns}
				rows={rows}
				rowsCount={ROW_COUNT}
				onGridSort={(sortColumn, sortDirection) => setRows(sortRows(initialRows, sortColumn, sortDirection))}
				enableCellAutoFocus={false}
			/>
		</>
	)
}

export default DataGrid
