import React, { useState, useEffect, useRef } from 'react'
// import { Link } from 'react-router-dom'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
// import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import NotInterestedIcon from '@material-ui/icons/NotInterested'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import LockIcon from '@material-ui/icons/Lock'
import EmailIcon from '@material-ui/icons/MailOutline'

import { Add } from '@material-ui/icons'

import { Button } from '@material-ui/core'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'

import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { flattenObject } from '../../utils/utils'
import { haveAccess, userPermission, userStatus } from '../../variables/user.js'
import FormPassword from './FormPassword.js'
import UserForm from './FormUser'

const { ADMIN } = userPermission

const token = localStorage.getItem('jwt')

const PhoneFormatters = rowData => {
	let phoneNumber = ''
	if (rowData) {
		if (rowData?.phone?.phone) {
			phoneNumber = rowData?.phone?.phone
			if (rowData?.phone?.ext) {
				phoneNumber += `, poste ${rowData?.phone?.ext}`
			}
		} else if (rowData?.phone?.mobile) {
			phoneNumber = rowData?.phone?.mobile
		}

		return <a href={`tel:${rowData?.phone?.phone}`}>{phoneNumber}</a>
	}
}

function DataGrid() {
	const [users, setUsers] = useState([])
	const [first, setFirst] = useState(0)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [selectedPermission, setSelectedPermission] = useState(null)
	const [selectedData, setSelectedData] = useState(null)
	const [user, setUser] = useState(null)
	const [changeStatusUserDialog, setChangeStatusUserDialog] = useState(false)
	const [changePasswordUserDialog, setChangePasswordUserDialog] = useState(false)
	const [updateUserDialog, setUpdateUserDialog] = useState(false)
	const [serverError, setServerError] = useState('')

	// const deleteUser = () => {
	// 	let _users = users.filter(val => val._id !== user._id)
	// 	setUsers(_users)
	// 	setDeleteUserDialog(false)
	// 	setUser(null)

	// 	toast.current.show({
	// 		severity: 'success',
	// 		summary: 'Réussi',
	// 		detail: 'Status modifier avec succès',
	// 		life: 3000
	// 	})
	// }

	const createUser = async postData => {
		const controller = new AbortController()
		const { signal } = controller

		const res = await fetch(`/api/user`, {
			method: 'POST',
			body: JSON.stringify(postData),
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			setUsers([...users, { ...postData, _id: data._id }])
			setUpdateUserDialog(false)
			setUser(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Utilisateur ajouté', life: 3000 })
		} else {
			setServerError(data.message)

			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
		}

		return () => controller.abort()
	}

	const updateUser = async postData => {
		const controller = new AbortController()
		const { signal } = controller

		const res = await fetch(`/api/user/${user._id}`, {
			method: 'PUT',
			body: JSON.stringify(postData),
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			setUsers(users.map(item => (item._id === user._id ? { ...user, ...postData } : item)))
			setUpdateUserDialog(false)
			setUser(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Utilisateur mis à jour', life: 3000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
		}

		return () => controller.abort()
	}

	/**
	 * Change Status
	 * @returns
	 */
	const updateStatus = async () => {
		const controller = new AbortController()
		const { signal } = controller

		const postData = {
			status: user.status === userStatus.ACTIVE ? userStatus.INACTIVE : userStatus.ACTIVE
		}

		const res = await fetch(`/api/user/status/${user._id}`, {
			method: 'PATCH',
			body: JSON.stringify(postData),
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			setUsers(users.map(item => (item._id === user._id ? { ...user, ...postData } : item)))
			setChangeStatusUserDialog(false)
			setUser(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Status mis à jour', life: 3000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: data.message, life: 3000 })
		}

		return () => controller.abort()
	}

	const hideChangeStatusUserDialog = () => {
		setChangeStatusUserDialog(false)
	}

	const confirmChangeStatusUser = user => {
		setUser(user)
		setChangeStatusUserDialog(true)
	}

	const changeStatusUserDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideChangeStatusUserDialog}>
				Non
			</Button>
			<Button
				label="Yes"
				icon="pi pi-check"
				className="p-button-text"
				onClick={updateStatus}
				style={{ color: 'red' }}
			>
				Oui
			</Button>
		</React.Fragment>
	)

	/**
	 * Change password
	 * @returns
	 */
	const updatePassword = async postData => {
		const controller = new AbortController()
		const { signal } = controller

		const res = await fetch(`/api/user/password/${user._id}`, {
			method: 'PATCH',
			body: JSON.stringify(postData),
			...signal,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
		const data = await res.json()

		if (data.success) {
			setUsers(users.map(item => (item._id === user._id ? { ...user, ...postData } : item)))
			setChangePasswordUserDialog(false)
			setUser(null)
			toast.current.show({
				severity: 'success',
				summary: 'Réussi',
				detail: 'Mot de passe mis à jour',
				life: 3000
			})
		} else {
			toast.current.show({ severity: 'error', summary: 'Échec', detail: 'Le mot de passe a échoué', life: 3000 })
		}

		return () => controller.abort()
	}

	const hideChangePasswordUserDialog = () => {
		setChangePasswordUserDialog(false)
	}

	const confirmChangePasswordUser = user => {
		setUser(user)
		setChangePasswordUserDialog(true)
	}

	const changePasswordUserDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideChangePasswordUserDialog}>
				Fermer
			</Button>
		</React.Fragment>
	)

	const hideEditUserDialog = () => {
		setUpdateUserDialog(false)
	}

	const confirmAddUserDialog = () => {
		setUser(null)
		setUpdateUserDialog(true)
	}

	const confirmEditUserDialog = user => {
		setUser(user)
		setUpdateUserDialog(true)
	}

	const dt = useRef(null)
	const toast = useRef(null)

	const statuses = Object.keys(userStatus).map(item => userStatus[item])
	const permissions = Object.keys(userPermission).map(item => userPermission[item])

	const exportCSV = selectionOnly => {
		dt.current.exportCSV({ selectionOnly })
	}

	const exportExcel = selectionOnly => {
		import('xlsx').then(xlsx => {
			const formatedData = selectedData.map(item => {
				// delete item['postedBy']._id
				return flattenObject(item)
			})

			const worksheet = xlsx.utils.json_to_sheet(formatedData)
			const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
			const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
			saveAsExcelFile(excelBuffer, 'customers')
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

	const onStatusChange = e => {
		dt.current.filter(e.value, 'status', 'equals')
		setSelectedStatus(e.value)
	}

	const statusBodyTemplate = rowData => {
		return (
			<React.Fragment>
				{/* <span className="p-column-title">Status</span> */}
				<span className={`user-badge status-${rowData.status}`}>{rowData.status}</span>
			</React.Fragment>
		)
	}

	const statusItemTemplate = option => {
		return <span className={`user-badge status-${option}`}>{option}</span>
	}

	const onPermissionChange = e => {
		dt.current.filter(e.value, 'permission', 'equals')
		setSelectedPermission(e.value)
	}

	const permissionBodyTemplate = rowData => {
		return (
			<React.Fragment>
				{/* <span className="p-column-title">Status</span> */}
				<span className={`user-badge permission-${rowData.permission}`}>{rowData.permission}</span>
			</React.Fragment>
		)
	}

	const permissionItemTemplate = option => {
		return <span className={`user-badge permission-${option}`}>{option}</span>
	}

	const actionBodyTemplate = rowData => {
		return (
			<>
				{haveAccess([ADMIN]) && (
					<Button
						className="p-button-rounded p-button-success p-mr-2"
						onClick={() => confirmEditUserDialog(rowData)}
					>
						<PermIdentityIcon />
					</Button>
				)}

				<a href={`mailto:${rowData.email}`}>
					<Button className={`p-button-rounded p-button-warning`}>
						<EmailIcon />
					</Button>
				</a>
				{haveAccess([ADMIN]) && (
					<Button
						className={`p-button-rounded p-button-warning`}
						onClick={() => confirmChangePasswordUser(rowData)}
					>
						<LockIcon />
					</Button>
				)}
				{haveAccess([ADMIN]) && rowData.status === userStatus.ACTIVE && (
					<Button
						className={`p-button-rounded p-button-warning status-${userStatus.INACTIVE}`}
						onClick={() => confirmChangeStatusUser(rowData)}
					>
						<NotInterestedIcon />
					</Button>
				)}
				{haveAccess([ADMIN]) && rowData.status === userStatus.INACTIVE && (
					<Button
						className={`p-button-rounded p-button-warning status-${userStatus.ACTIVE}`}
						onClick={() => confirmChangeStatusUser(rowData)}
					>
						<CheckCircleOutlineIcon />
					</Button>
				)}
			</>
		)
	}

	const statusFilter = (
		<Dropdown
			value={selectedStatus}
			options={statuses}
			onChange={onStatusChange}
			itemTemplate={statusItemTemplate}
			placeholder="Choisir un type"
			className="p-column-filter"
			showClear
		/>
	)
	const permissionFilter = (
		<Dropdown
			value={selectedPermission}
			options={permissions}
			onChange={onPermissionChange}
			itemTemplate={permissionItemTemplate}
			placeholder="Choisir une permission"
			className="p-column-filter"
			showClear
		/>
	)

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
			field: 'name',
			header: 'Nom'
		},
		{
			field: 'phone.phone',
			header: 'Téléphone',
			body: PhoneFormatters
		},
		{
			field: 'permission',
			header: 'Permission'
		},
		{
			field: 'status',
			header: 'Status'
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

		fetch(`/api/user`, {
			...signal,
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					setUsers(data.data)
					setSelectedData(data.data)
				}
			})

		return () => controller.abort()
	}, [])

	return (
		<>
			<Toast ref={toast} />
			{haveAccess([ADMIN]) && (
				<>
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

					<Button className="p-button-help" onClick={confirmAddUserDialog} style={{ float: 'right' }}>
						<Add /> Ajouter un utilisateur
					</Button>
				</>
			)}
			<DataTable
				ref={dt}
				value={users}
				paginator
				paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink LastPageLink"
				rows={20}
				first={first}
				onPage={e => setFirst(e.first)}
				onValueChange={filteredData => setSelectedData(filteredData)}
				{...defaultTableProperty}
			>
				{defaultColumns.map(column => {
					if (column.field === 'status') {
						return (
							<Column
								key={column.field}
								{...column}
								body={statusBodyTemplate}
								filter
								filterElement={statusFilter}
							></Column>
						)
					}
					if (column.field === 'permission') {
						return (
							<Column
								key={column.field}
								{...column}
								body={permissionBodyTemplate}
								filter
								filterElement={permissionFilter}
							></Column>
						)
					}
					return <Column key={column.field} {...column}></Column>
				})}
			</DataTable>
			<Dialog
				visible={changeStatusUserDialog}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={changeStatusUserDialogFooter}
				onHide={hideChangeStatusUserDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
					{user && (
						<span>
							Voulez-vous modifier le status de
							<b> {user.name}</b> pour le status "
							<b>{user.status === userStatus.ACTIVE ? userStatus.INACTIVE : userStatus.ACTIVE}</b>" ?
						</span>
					)}
				</div>
			</Dialog>

			<Dialog
				visible={changePasswordUserDialog}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={changePasswordUserDialogFooter}
				onHide={hideChangePasswordUserDialog}
			>
				<div className="confirmation-content">
					<i className="pi" style={{ fontSize: '2rem' }} />
					{user && (
						<>
							<FormPassword updatePassword={updatePassword} />
						</>
					)}
				</div>
			</Dialog>

			<Dialog
				// visible={true}
				visible={updateUserDialog}
				style={{ width: '950px' }}
				header={user ? "Édition de l'utilisateur" : "Ajout d'un utilisateur"}
				modal
				onHide={hideEditUserDialog}
			>
				<UserForm
					user={user}
					handleClose={hideEditUserDialog}
					createUser={createUser}
					updateUser={updateUser}
					serverError={serverError}
					setServerError={setServerError}
				/>
			</Dialog>
		</>
	)
}

export default DataGrid
