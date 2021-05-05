import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'

import EditIcon from '@material-ui/icons/Edit'

import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import { Add } from '@material-ui/icons'
import FilterListIcon from '@material-ui/icons/FilterList'
import {
	Button,
	FormControl,
	FormControlLabel,
	Checkbox,
	RadioGroup,
	Radio,
	Input,
	InputLabel,
	Select,
	MenuItem,
	ListItemText
} from '@material-ui/core'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { flattenObject, formatDate } from '../../utils/utils'

import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'

import ActivityForm from './ActivityForm'

import { haveAccess, userPermission } from '../../variables/user.js'
const { ADMIN, COLLABORATOR } = userPermission

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
}
// import { Draggable } from 'react-data-grid-addons'
// const DraggableContainer = Draggable.Container

const { REACT_APP_API_URL } = process.env
const token = localStorage.getItem('jwt')

function DataGrid({ ...props }) {
	let { customerId } = props.match.params

	const [activities, setActivities] = useState([])
	const [first, setFirst] = useState(0)
	const [selectedType, setSelectedType] = useState(null)
	const [selectedResponse, setSelectedResponse] = useState(null)
	// const [selectedNegatif, setSelectedNegatif] = useState(null)
	const [selectedData, setSelectedData] = useState(null)
	const [activity, setActivity] = useState(null)
	const [deleteActivityDialog, setDeleteActivityDialog] = useState(false)
	const [editActivityDialog, setEditActivityDialog] = useState(false)
	const [serverError, setServerError] = useState('')

	const [toggleFilter, setToggleFilter] = useState(null)
	const [filter, setFilter] = useState({ time: '', users: [] })
	const [users, setUsers] = useState([])

	const createActivity = async postData => {
		const config = {
			method: 'post',
			url: `${process.env.REACT_APP_API_URL}/api/customer/${customerId}/activity`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			setActivities([...activities, { ...postData, _id: data._id }])
			setEditActivityDialog(false)
			setActivity(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 3000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Réussi', detail: data.message, life: 3000 })
			setServerError(data.message)
		}
	}

	const updateActivity = async postData => {
		const config = {
			method: 'put',
			url: `${process.env.REACT_APP_API_URL}/api/activity/${activity._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res

		if (data.success) {
			console.log(data)
			setActivities(activities.map(item => (item._id === activity._id ? { ...activity, ...postData } : item)))
			setEditActivityDialog(false)
			setActivity(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Activité mis à jour', life: 3500 })
		} else {
			toast.current.show({ severity: 'danger', summary: 'Échec', detail: data.message, life: 5000 })
		}
	}

	const deleteActivity = async () => {
		const config = {
			method: 'DELETE',
			url: `${process.env.REACT_APP_API_URL}/api/activity/${activity._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			let _activities = activities.filter(val => val._id !== activity._id)

			//ajouter requete serveur pour supprimer celui-ci

			setActivities(_activities)

			setDeleteActivityDialog(false)
			setActivity(null)

			toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 3000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 })
		}
	}
	const hideDeleteActivityDialog = () => {
		setDeleteActivityDialog(false)
	}

	const hideEditActivityDialog = () => {
		setEditActivityDialog(false)
	}

	const confirmAddActivityDialog = () => {
		setActivity(null)
		setEditActivityDialog(true)
	}

	const confirmEditActivityDialog = activity => {
		setActivity(activity)
		setEditActivityDialog(true)
	}

	const confirmDeleteCustomer = activity => {
		setActivity(activity)
		setDeleteActivityDialog(true)
	}

	const deleteActivityDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteActivityDialog}>
				Non
			</Button>
			<Button
				label="Yes"
				icon="pi pi-check"
				className="p-button-text"
				onClick={deleteActivity}
				style={{ color: 'red' }}
			>
				Oui
			</Button>
		</React.Fragment>
	)

	const dt = useRef(null)
	const toast = useRef(null)

	const responses = [
		'À laissé un message en directe',
		'À laissé un message vocal',
		'Pas de réponse',
		"En attente d'une réponse",
		'Terminer',
		'À schéduler',
		'Connecté',
		'Occupé',
		'Non planifier',
		'Mauvais numéro',
		'Annuler',
		'Non planifier',
		'Confirmer'
	]

	const types = ['Un appel', 'Un courriel', 'Un rendez-vous', 'Une vidéo-conférence']

	// const negatifs = ['Tous', 'Négatif seulement', 'Positif seulement']

	const exportCSV = selectionOnly => {
		dt.current.exportCSV({ selectionOnly })
	}

	const exportExcel = selectionOnly => {
		import('xlsx').then(xlsx => {
			const formatedData = selectedData.map(item => {
				delete item['postedBy']._id
				return flattenObject(item)
			})

			const worksheet = xlsx.utils.json_to_sheet(formatedData)
			const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
			const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
			saveAsExcelFile(excelBuffer, 'activities')
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

	//FILTER template item
	const responseBodyTemplate = rowData => {
		return (
			<React.Fragment>
				<span className={`activity-badge typeResponse-${rowData.typeResponse}`}>{rowData.typeResponse}</span>
			</React.Fragment>
		)
	}

	// const negatifBodyTemplate = rowData => {
	// 	return (
	// 		<React.Fragment>
	// 			<span className={`activity-badge isNegatif-${rowData.isNegatif}`}>{rowData.isNegatif}</span>
	// 		</React.Fragment>
	// 	)
	// }

	const typeBodyTemplate = rowData => {
		return (
			<React.Fragment>
				<span className={`activity-badge interactionType-${rowData.interactionType}`}>
					{rowData.interactionType}
				</span>
			</React.Fragment>
		)
	}

	//Filter Change
	const onResponseChange = e => {
		dt.current.filter(e.value, 'typeResponse', 'equals')
		setSelectedResponse(e.value)
	}

	const onTypeChange = e => {
		dt.current.filter(e.value, 'interactionType', 'equals')
		setSelectedType(e.value)
	}

	// const onNegatifChange = e => {
	// 	dt.current.filter(e.value, 'isNegatif', 'equals')
	// 	setSelectedNegatif(e.value)
	// }

	//FILTER ITEM TEMPLATE
	const typeItemTemplate = option => {
		return <span className={`activity-badge interactionType-${option}`}>{option}</span>
	}

	const responseItemTemplate = option => {
		return <span className={`activity-badge typeResponse-${option}`}>{option}</span>
	}

	const dateItemTemplate = rowData => {
		return <>{formatDate(rowData.date)}</>
	}

	// const negatifItemTemplate = option => {
	// 	return <span className={`activity-badge isNegatif-${option}`}>{option}</span>
	// }

	const actionBodyTemplate = rowData => {
		const userAccess = localStorage.getItem('user') === rowData?.postedBy?._id

		return (
			<>
				{(haveAccess([ADMIN, COLLABORATOR]) || userAccess) && (
					<Button
						className="p-button-rounded p-button-success p-mr-2"
						onClick={() => confirmEditActivityDialog(rowData)}
					>
						<EditIcon />
					</Button>
				)}
				{(haveAccess([ADMIN, COLLABORATOR]) || userAccess) && (
					<Button
						className="p-button-rounded p-button-warning"
						onClick={() => confirmDeleteCustomer(rowData)}
					>
						<DeleteSweepIcon />
					</Button>
				)}
			</>
		)
	}

	const isNegatifBodyTemplate = rowData => {
		return (
			<>
				<Checkbox checked={rowData.isNegatif} readOnly inputProps={{ 'aria-label': 'primary checkbox' }} />
			</>
		)
	}

	//DROPDOWN FILTER
	const typesFilter = (
		<Dropdown
			value={selectedType}
			options={types}
			onChange={onTypeChange}
			itemTemplate={typeItemTemplate}
			placeholder="Choisir un type"
			className="p-column-filter"
			showClear
		/>
	)

	const responsesFilter = (
		<Dropdown
			value={selectedResponse}
			options={responses}
			onChange={onResponseChange}
			itemTemplate={responseItemTemplate}
			placeholder="Choisir une réponse"
			className="p-column-filter"
			showClear
		/>
	)

	// const negatifFilter = (
	// 	<Dropdown
	// 		value={selectedNegatif}
	// 		options={negatifs}
	// 		onChange={onNegatifChange}
	// 		itemTemplate={negatifItemTemplate}
	// 		placeholder="Positif et Négatif"
	// 		className="p-column-filter"
	// 		showClear
	// 	/>
	// )

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
		headerStyle: { minWidth: '160px' }
	}

	const defaultColumns = [
		{
			field: 'date',
			header: 'Date',
			body: dateItemTemplate
		},
		{
			field: 'interactionType',
			header: 'Type'
		},
		{
			field: 'typeResponse',
			header: 'Réponse'
		},
		{
			field: 'descriptionResponse',
			header: 'Description'
		},
		{
			field: 'isNegatif',
			header: 'Retour Négatif?',
			filter: false,
			body: isNegatifBodyTemplate
		},
		{
			field: 'descriptionResponseNegatif',
			header: 'Description négative'
		},
		{
			field: 'options',
			header: 'Options',
			filter: false,
			sortable: false,
			body: actionBodyTemplate
		}
	].map(column => ({ ...defaultColumnProperty, ...column }))

	//récupèr les data initial
	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		fetch(`${process.env.REACT_APP_API_URL}/api/customer/${customerId}/activity`, {
			...signal,
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					setActivities(data.data)
					setSelectedData(data.data)
				}
			})
		return () => controller.abort()
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller
		if (toggleFilter != null) {
			//construit la requete a intégré dans l'url
			const esc = encodeURIComponent
			const query = Object.keys(filter)
				.map(k => {
					if (Array.isArray(filter[k])) {
						return esc(k) + '=' + filter[k].map(o => esc(o)).join(',')
					}
					return esc(k) + '=' + esc(filter[k])
				})
				.join('&')

			console.log(query)
			//met à jour la grid
			fetch(`${REACT_APP_API_URL}/api/customer/${customerId}/activity?${query}`, {
				...signal,
				headers: { Authorization: `Bearer ${token}` }
			})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						setActivities(data.data)
						setSelectedData(data.data)
					}
				})

			//récupère la liste des utilisateurs
			if (toggleFilter) {
				fetch(`${process.env.REACT_APP_API_URL}/api/user/`, {
					...signal,
					headers: { Authorization: `Bearer ${token}` }
				})
					.then(res => res.json())
					.then(data => {
						if (data.success) {
							setUsers(data.data)
						}
					})
			}
		}
		return () => controller.abort()
	}, [toggleFilter, filter])

	/* Filters */
	const handleToggleFilter = () => {
		setToggleFilter(prev => {
			if (prev) {
				setFilter({ time: '', users: [] })
			}
			return !prev
		})
	}

	const handleFilterRadio = e => {
		setFilter({ ...filter, [e.target.name]: e.target.value })
	}

	const handleFilterSelectMultiple = e => {
		setFilter({ ...filter, [e.target.name]: e.target.value })
	}
	return (
		<>
			<Toast ref={toast} />
			<Button
				type="button"
				icon="pi pi-file-excel"
				onClick={handleToggleFilter}
				className="p-button-success p-mr-2"
				data-pr-tooltip="XLS"
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
						<FormControl>
							<InputLabel id="filterUser-label">Utilisateur(s)</InputLabel>
							<Select
								labelId="filterUser-label"
								id="filterUser"
								multiple
								name="users"
								value={filter.users}
								onChange={handleFilterSelectMultiple}
								input={<Input />}
								renderValue={selected => {
									var filtered = users
										.filter(item => selected.includes(item['_id']))
										.map(item => item['name'])
									return filtered.join(', ')
								}}
								MenuProps={MenuProps}
							>
								{users.map(person => (
									<MenuItem key={person._id} value={person._id}>
										<Checkbox checked={filter.users.includes(person._id)} />
										<ListItemText primary={person.name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</div>
			)}

			{haveAccess([ADMIN]) && (
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
					<Button className="p-button-help" onClick={confirmAddActivityDialog} style={{ float: 'right' }}>
						<Add /> Ajouter une Activité
					</Button>
				</div>
			)}
			<DataTable
				ref={dt}
				value={activities}
				paginator
				paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink LastPageLink"
				rows={20}
				first={first}
				onPage={e => setFirst(e.first)}
				onValueChange={filteredData => setSelectedData(filteredData)}
				{...defaultTableProperty}
			>
				{defaultColumns.map(column => {
					if (column.field === 'interactionType') {
						return (
							<Column
								key={column.field}
								{...column}
								body={typeBodyTemplate}
								filter
								filterElement={typesFilter}
							></Column>
						)
					}
					if (column.field === 'typeResponse') {
						return (
							<Column
								key={column.field}
								{...column}
								body={responseBodyTemplate}
								filter
								filterElement={responsesFilter}
							></Column>
						)
					}
					// if (column.field === 'isNegatif') {
					// 	return (
					// 		<Column
					// 			key={column.field}
					// 			{...column}
					// 			body={negatifBodyTemplate}
					// 			filter
					// 			filterElement={negatifFilter}
					// 		></Column>
					// 	)
					// }
					return <Column key={column.field} {...column}></Column>
				})}
			</DataTable>

			<Dialog visible={editActivityDialog} style={{ width: '950px' }} modal onHide={hideEditActivityDialog}>
				<ActivityForm
					customer={customerId}
					activity={activity}
					handleClose={hideEditActivityDialog}
					createActivity={createActivity}
					updateActivity={updateActivity}
					serverError={serverError}
					setServerError={setServerError}
				/>
			</Dialog>

			<Dialog
				visible={deleteActivityDialog}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={deleteActivityDialogFooter}
				onHide={hideDeleteActivityDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
					{activity && (
						<span>
							Voulez-vous supprimer cet item : <b>{activity.descriptionResponse}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</>
	)
}

export default DataGrid
