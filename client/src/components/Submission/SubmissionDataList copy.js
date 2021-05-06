import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import ReactDataGrid from 'react-data-grid'

const MIN_WIDTH_COLUMN = 160

const SubmissionDataList = ({ customer, initialRows = 20 }) => {
	const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
		const comparer = (a, b) => {
			if (sortDirection === 'ASC') {
				return a[sortColumn] > b[sortColumn] ? 1 : -1
			} else if (sortDirection === 'DESC') {
				return a[sortColumn] < b[sortColumn] ? 1 : -1
			}
		}
		return sortDirection === 'NONE' ? [...rows] : [...rows].sort(comparer)
	}

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
		const {
			_id,
			company: { _id: companyId }
		} = row

		return (
			<div className="datagrid__cell--option">
				<Link to={`/admin/customers/${companyId}/contacts/${_id}`}>
					<PermIdentityIcon style={{ color: 'rgb(220, 0, 78)' }} />
				</Link>

				<Link to={`/admin/customers/${companyId}/contacts/${_id}`}>
					<DeleteSweepIcon style={{ color: 'rgb(220, 0, 78)' }} />
				</Link>
			</div>
		)
	}

	const defaultColumnProperties = {
		width: MIN_WIDTH_COLUMN,
		sortable: true,
		resizable: true,
		draggable: true
	}

	const defaultColumns = [
		{
			key: 'name',
			name: 'Nom',
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
			key: 'email',
			name: 'Courriel',
			sortable: false
		},
		{
			key: 'language',
			name: 'Langue'
		},
		{
			key: 'status',
			name: 'Status'
		},
		{
			key: 'options',
			name: 'Options',
			formatter: OptionFormatter,
			sortable: false,
			width: 75
		}
	].map(c => ({ ...defaultColumnProperties, ...c }))

	const [columns] = useState(defaultColumns)
	const [rows, setRows] = useState([])
	const ROW_COUNT = 20

	useEffect(() => {
		if (!customer) return null
		let isComponentMounted = true
		const abortController = new AbortController()

		const token = localStorage.getItem('jwt')
		const id = customer._id

		const fetchData = async () => {
			try {
				const response = await fetch(`/api/customer/${id}/submissions`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success && isComponentMounted) {
					setRows(data.data)
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					// Handling error thrown by aborting request
				}
			}
		}

		fetchData()

		return () => {
			abortController.abort()
			isComponentMounted = false
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customer])

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

export default SubmissionDataList
