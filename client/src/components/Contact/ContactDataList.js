import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import ReactDataGrid from 'react-data-grid'

const MIN_WIDTH_COLUMN = 160
const token = localStorage.getItem('jwt')

const ContactDataList = ({ customer, initialRows = 20, handleOpenNotification, contacts, setContacts }) => {
	const handleClickDelete = (e, id, companyId) => {
		const fetchDelete = async id => {
			try {
				const response = await fetch(`/api/contact/${id}`, {
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
			const response = await fetch(`/api/customer/${companyId}/contact`, {
				headers: { Authorization: `Bearer ${token}` }
			})
			const data = await response.json()

			if (data.success) {
				setContacts(data.data)
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
			key: 'action',
			name: 'Action',
			formatter: OptionFormatter,
			sortable: false,
			width: 75
		}
	].map(c => ({ ...defaultColumnProperties, ...c }))

	const [columns] = useState(defaultColumns)

	const ROW_COUNT = 20

	// useEffect(() => {
	// 	if (!customer) return null
	// 	const controller = new AbortController()
	// 	const { signal } = controller
	// 	const token = localStorage.getItem('jwt')
	// 	const id = customer._id

	// 	fetch(`/api/customer/${id}/contact`, {
	// 		...signal,
	// 		headers: { Authorization: `Bearer ${token}` }
	// 	})
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			if (data.success) {
	// 				setRows(data.data)
	// 			}
	// 		})

	// 	return () => controller.abort()

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [customer])

	return (
		<>
			{contacts ? (
				<ReactDataGrid
					columns={columns}
					rows={contacts}
					rowsCount={ROW_COUNT}
					enableCellAutoFocus={false}
					onGridSort={(sortColumn, sortDirection) =>
						setContacts(sortRows(initialRows, sortColumn, sortDirection))
					}
				/>
			) : (
				<p>Aucun contact associé à ce client</p>
			)}
		</>
	)
}

export default ContactDataList
