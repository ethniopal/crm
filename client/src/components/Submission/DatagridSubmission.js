import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import FilterListIcon from '@material-ui/icons/FilterList'

import { Button } from '@material-ui/core'
import { FormControl, FormControlLabel, Checkbox, RadioGroup, Radio } from '@material-ui/core'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { flattenObject } from '../../utils/utils'

import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'

import { haveAccess, userPermission } from '../../variables/user.js'
const { ADMIN, COLLABORATOR, SELLER, DISPATCHER } = userPermission
// import { Draggable } from 'react-data-grid-addons'
// const DraggableContainer = Draggable.Container

const token = localStorage.getItem('jwt')

function DataGrid(props) {
	const defaultQuery = {
		time: null,
		myAttribution: null
	}
	const [submissions, setSubmissions] = useState([])
	const [first, setFirst] = useState(0)
	const [selectedData, setSelectedData] = useState(null)
	const [submission, setSubmission] = useState(null)
	const [deleteDialog, setDeleteDialog] = useState(false)
	const [toggleFilter, setToggleFilter] = useState(null)
	const [filter, setFilter] = useState(defaultQuery)

	const deleteAction = async () => {
		const controller = new AbortController()
		const { signal } = controller

		const res = await fetch(`/api/submission/${submission._id}/`, {
			method: 'DELETE',
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			let _submissions = submissions.filter(val => val._id !== submission._id)
			setDeleteDialog(false)
			setSubmission(null)
			setSubmissions(_submissions)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 6000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
		}
	}

	const hideDeleteDialog = () => {
		setDeleteDialog(false)
	}

	const confirmDelete = submission => {
		setSubmission(submission)
		setDeleteDialog(true)
	}

	const deleteDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog}>
				Non
			</Button>
			<Button
				label="Yes"
				icon="pi pi-check"
				className="p-button-text"
				onClick={deleteAction}
				style={{ color: 'red' }}
			>
				Supprimer
			</Button>
		</React.Fragment>
	)

	const dt = useRef(null)
	const toast = useRef(null)

	const exportCSV = selectionOnly => {
		dt.current.exportCSV({ selectionOnly })
	}

	const exportExcel = selectionOnly => {
		import('xlsx').then(xlsx => {
			const formatedData = selectedData.map(item => {
				if (item['postedBy']) delete item['postedBy']._id
				return flattenObject(item)
			})

			if (formatedData) {
				const worksheet = xlsx.utils.json_to_sheet(formatedData)
				const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
				const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
				saveAsExcelFile(excelBuffer, 'submissions')
			}
		})
	}

	const saveAsExcelFile = (buffer, fileName) => {
		import('file-saver').then(FileSaver => {
			let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
			let EXCEL_EXTENSION = '.xlsx'
			const data = new Blob([buffer], {
				type: EXCEL_TYPE
			})
			FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION)
		})
	}

	const actionBodyTemplate = rowData => {
		return (
			<>
				<Link to={`/admin/submission/${rowData._id}`}>
					<Button className="p-button-rounded p-button-success p-mr-2">
						<EditIcon />
					</Button>
				</Link>

				{haveAccess([ADMIN, COLLABORATOR]) && (
					<>
						<Button className="p-button-rounded p-button-warning" onClick={() => confirmDelete(rowData)}>
							<DeleteSweepIcon />
						</Button>
					</>
				)}
			</>
		)
	}

	const sourceTemplate = option => {
		return (
			<span>
				{option.address.source.city}, {option.address.source.province}
			</span>
		)
	}

	const destinationTemplate = option => {
		return (
			<span>
				{option.address.destination.city}, {option.address.destination.province}
			</span>
		)
	}

	const handleFilterRadio = e => {
		setFilter({ ...filter, [e.target.name]: e.target.value })
	}

	const defaultTableProperty = {
		reorderableColumns: true,
		sortMode: 'multiple',
		scrollable: true,
		resizableColumns: true,
		columnResizeMode: 'expand'
	}

	const defaultColumnProperty = {
		sortable: true,
		filter: true,
		exportable: true,
		reorderable: true,
		headerStyle: { width: '250px' }
	}

	const defaultColumns = [
		{
			field: 'customer.name',
			header: 'Companie'
		},
		{
			field: 'source',
			header: 'Source',
			filter: false
		},
		{
			field: 'destination',
			header: 'Destination',
			filter: false
		},

		{
			field: 'options',
			header: 'Options',
			filter: false,
			sortable: false,
			body: actionBodyTemplate
		}
	].map(column => ({ ...defaultColumnProperty, ...column }))

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller
		let customerId = props?.match?.params?.customerId

		const url = customerId
			? `/api/customer/${customerId}/submission?`
			: `/api/submission?`
		fetch(`${url}`, {
			...signal,
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					setSubmissions(data.data)
					setSelectedData(data.data)
				}
			})

		return () => controller.abort()
	}, [])

	useEffect(() => {
		if (toggleFilter != null) {
			const controller = new AbortController()
			const { signal } = controller

			const esc = encodeURIComponent
			const query = Object.keys(filter)
				.map(k => esc(k) + '=' + esc(filter[k]))
				.join('&')

			let customerId = props?.match?.params?.customerId

			const url = customerId
				? `/api/customer/${customerId}/submission?`
				: `/api/submission?`

			fetch(`${url}${query}`, {
				...signal,
				headers: { Authorization: `Bearer ${token}` }
			})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						setSubmissions(data.data)
						setSelectedData(data.data)
					}
				})
			return () => controller.abort()
		}
	}, [toggleFilter, filter])

	/* Filters */
	const handleToggleFilter = () => {
		setToggleFilter(prev => {
			if (prev) {
				setFilter(defaultQuery)
			}
			return !prev
		})
	}

	const handleFilterCheckbox = e => {
		setFilter({ ...filter, [e.target.name]: e.target.checked })
	}

	return (
		<>
			<Toast ref={toast} />
			<Button
				type="button"
				icon="pi pi-file-excel"
				onClick={handleToggleFilter}
				className="p-button-success p-mr-2"
			>
				<FilterListIcon /> {toggleFilter ? 'Aucun filtre' : 'Filtre supplémentaire'}
			</Button>

			{toggleFilter && (
				<div className="filter-content">
					<RadioGroup
						aria-label="time"
						name="time"
						value={filter.time}
						onChange={e => {
							handleFilterRadio(e)
						}}
					>
						<FormControlLabel value="past" control={<Radio />} label="Passé" />
						<FormControlLabel value="incoming" control={<Radio />} label="À venir" />
					</RadioGroup>

					{haveAccess([ADMIN, COLLABORATOR]) && (
						<FormControl style={{ width: '100%' }} className="form-group">
							<FormControlLabel
								control={
									<Checkbox
										checked={filter.myAttribution}
										onChange={e => {
											handleFilterCheckbox(e)
										}}
										name="myAttribution"
									/>
								}
								label="Mes attributions"
							/>
						</FormControl>
					)}
				</div>
			)}
			{haveAccess([ADMIN, COLLABORATOR, SELLER, DISPATCHER]) && (
				<div>
					<span>Exporter les {selectedData?.length} résultats filtrés en </span>
					<Button
						type="button"
						icon="pi pi-file-o"
						onClick={() => exportCSV(false)}
						className="p-mr-2"
						data-pr-tooltip="CSV"
					>
						csv
					</Button>
					<span> ou </span>
					<Button
						type="button"
						icon="pi pi-file-excel"
						onClick={exportExcel}
						className="p-button-success p-mr-2"
						data-pr-tooltip="XLS"
					>
						excel
					</Button>
				</div>
			)}

			<DataTable
				ref={dt}
				value={submissions}
				scrollable
				paginator
				paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink LastPageLink"
				rows={20}
				first={first}
				onPage={e => setFirst(e.first)}
				onValueChange={filteredData => setSelectedData(filteredData)}
				{...defaultTableProperty}
			>
				{defaultColumns.map(column => {
					if (column.field === 'source') {
						return <Column key={column.field} {...column} body={sourceTemplate}></Column>
					}
					if (column.field === 'destination') {
						return <Column key={column.field} {...column} body={destinationTemplate}></Column>
					}
					return <Column key={column.field} {...column}></Column>
				})}
			</DataTable>
			<Dialog
				visible={deleteDialog}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={deleteDialogFooter}
				onHide={hideDeleteDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
					{submission && <span>Désirez vous supprimer cette soumission?</span>}
				</div>
			</Dialog>
		</>
	)
}

export default DataGrid
