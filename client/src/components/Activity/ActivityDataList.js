import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import ReactDataGrid from 'react-data-grid'
import { Checkbox } from '@material-ui/core'

const token = localStorage.getItem('jwt')
const MIN_WIDTH_COLUMN = 160

const ActivityDataList = ({ customer, initialRows = 20, handleOpenNotification, activities, setActivities }) => {
	const handleClickDelete = (e, id, companyId) => {
		const fetchDelete = async id => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activity/${id}`, {
					method: 'delete',
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success) {
					handleOpenNotification({ open: true, severity: 'success', message: data.message })
				} else {
					handleOpenNotification({ open: true, severity: 'error', message: data.message })
				}
			} catch (error) {
				console.log(error)
			}
		}

		const fetchData = async companyId => {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/${companyId}/activity`, {
				headers: { Authorization: `Bearer ${token}` }
			})
			const data = await response.json()

			if (data.success) {
				setActivities(data.data)
			}
		}

		fetchDelete(id)
		fetchData(companyId)

		// console.log(customer, contacts, id)
	}

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

	const DateFormatters = ({ row }) => {
		const date = new Date(row.date)
		let formatted_date = ''
		if (date) {
			const year = date.getFullYear()
			const month = (date.getMonth() + 1 + '').padStart(2, '0')
			const day = (date.getDate() + '').padStart(2, '0')
			const hour = (date.getHours() + '').padStart(2, '0')
			const min = (date.getMinutes() + '').padStart(2, '0')

			formatted_date = `${year}/${month}/${day} ${hour}:${min}`
		}
		return formatted_date
	}

	const BooleanFormatters = ({ row }) => {
		const { isNegatif } = row

		return <Checkbox checked={isNegatif} readOnly inputProps={{ 'aria-label': 'primary checkbox' }} />
	}

	const OptionFormatter = ({ row }) => {
		if (!row) return ''
		const {
			_id,
			company: { _id: companyId }
		} = row

		return (
			<div className="datagrid__cell--option">
				<Link to={`/admin/customers/${companyId}/activites/${_id}`}>
					<PermIdentityIcon style={{ color: 'rgb(220, 0, 78)' }} />
				</Link>

				<DeleteSweepIcon
					style={{ color: 'rgb(220, 0, 78)' }}
					onClick={e => handleClickDelete(e, _id, companyId)}
				/>
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
			key: 'date',
			name: 'Date',
			formatter: DateFormatters
		},
		{
			key: 'interactionType',
			name: "Type d'intération",
			sortable: true
		},
		{
			key: 'typeResponse',
			name: 'Type de réponse',
			sortable: true
		},
		{
			key: 'isNegatif',
			name: 'Négatif',
			sortable: false,
			formatter: BooleanFormatters
		},
		{
			key: 'descriptionResponse',
			name: 'Description',
			sortable: false
		},
		{
			key: 'descriptionResponseNegatif',
			name: 'Description Négatif',
			sortable: false
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
	// const [rows, setRows] = useState([])
	const ROW_COUNT = 20

	return (
		<>
			{activities ? (
				<ReactDataGrid
					columns={columns}
					rows={activities}
					rowsCount={ROW_COUNT}
					onGridSort={(sortColumn, sortDirection) =>
						setActivities(sortRows(initialRows, sortColumn, sortDirection))
					}
					enableCellAutoFocus={false}
				/>
			) : (
				<p>Aucune activité associé à ce client</p>
			)}
		</>
	)
}

export default ActivityDataList
