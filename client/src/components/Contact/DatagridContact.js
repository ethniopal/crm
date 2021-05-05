import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'

import { Add } from '@material-ui/icons'

import EmailIcon from '@material-ui/icons/MailOutline'
import EditIcon from '@material-ui/icons/Edit'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import { Button } from '@material-ui/core'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { flattenObject } from '../../utils/utils'

import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'

import ContactForm from './ContactForm'

import { haveAccess, userPermission } from '../../variables/user.js'
const { ADMIN, COLLABORATOR, SELLER, DISPATCHER } = userPermission

const token = localStorage.getItem('jwt')

const PhoneFormatters = rowData => {
	let phoneNumber = ''
	if (rowData.phone.phone) {
		phoneNumber = rowData.phone.phone
		if (rowData.phone.ext) {
			phoneNumber += `, poste ${rowData.phone.ext}`
		}
	} else if (rowData.phone.mobile) {
		phoneNumber = rowData.phone.mobile
	}

	return <a href={`tel:${rowData.phone.phone}`}>{phoneNumber}</a>
}

function DataGrid({ ...props }) {
	let { customerId } = props.match.params
	const [contacts, setContacts] = useState([])
	const [first, setFirst] = useState(0)
	const [selectedData, setSelectedData] = useState(null)
	const [contact, setContact] = useState(null)
	const [deleteContactDialog, setDeleteContactDialog] = useState(false)
	const [editContactDialog, setEditContactDialog] = useState(false)

	const [serverError, setServerError] = useState('')

	//action to server

	const createContact = async postData => {
		const config = {
			method: 'post',
			url: `${process.env.REACT_APP_API_URL}/api/customer/${customerId}/contact`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Contact ajouté', life: 3000 })
			setContacts([...contacts, { ...postData, _id: data._id }])
			setEditContactDialog(false)
			setContact(null)
		} else {
			toast.current.show({ severity: 'error', summary: 'Réussi', detail: data.message, life: 3000 })
			setServerError(data.message)
		}
	}

	const updateContact = async postData => {
		const config = {
			method: 'put',
			url: `${process.env.REACT_APP_API_URL}/api/contact/${contact._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data: postData
		}

		let res = await Axios(config)
		let { data } = res

		if (data.success) {
			setContacts(contacts.map(item => (item._id === contact._id ? { ...contact, ...postData } : item)))
			setEditContactDialog(false)
			setContact(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Contact mis à jour', life: 3000 })
		} else {
			toast.current.show({ severity: 'danger', summary: 'Échec', detail: data.message, life: 5000 })
		}
	}

	const deleteContact = async () => {
		const config = {
			method: 'DELETE',
			url: `${process.env.REACT_APP_API_URL}/api/contact/${contact._id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		}

		let res = await Axios(config)
		let { data } = res
		if (data.success) {
			let _contacts = contacts.filter(val => val._id !== contact._id)

			//ajouter requete serveur pour supprimer celui-ci
			setContacts(_contacts)
			setDeleteContactDialog(false)
			setContact(null)
			toast.current.show({ severity: 'success', summary: 'Réussi', detail: data.message, life: 3000 })
		} else {
			toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 })
		}
	}

	//Cacher les dialogs
	const hideEditContactDialog = () => {
		setEditContactDialog(false)
	}

	const hideDeleteContactDialog = () => {
		setDeleteContactDialog(false)
	}

	const confirmAddContactDialog = () => {
		setContact(null)
		setEditContactDialog(true)
	}

	const confirmEditContactDialog = contact => {
		setContact(contact)
		setEditContactDialog(true)
	}

	const confirmDeleteContact = contact => {
		setContact(contact)
		setDeleteContactDialog(true)
	}

	const deleteContactDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteContactDialog}>
				Non
			</Button>
			<Button
				label="Yes"
				icon="pi pi-check"
				className="p-button-text"
				onClick={deleteContact}
				style={{ color: 'red' }}
			>
				Oui
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
				delete item['postedBy']._id
				return flattenObject(item)
			})

			const worksheet = xlsx.utils.json_to_sheet(formatedData)
			const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
			const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
			saveAsExcelFile(excelBuffer, 'contacts')
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
				<a href={`mailto:${rowData.email}`}>
					<Button className="p-button-rounded p-button-success p-mr-2">
						<EmailIcon />
					</Button>
				</a>
				<Button
					className="p-button-rounded p-button-success p-mr-2"
					onClick={() => confirmEditContactDialog(rowData)}
				>
					<EditIcon />
				</Button>
				{haveAccess([ADMIN, COLLABORATOR, SELLER, DISPATCHER]) && (
					<Button className="p-button-rounded p-button-warning" onClick={() => confirmDeleteContact(rowData)}>
						<DeleteSweepIcon />
					</Button>
				)}
			</>
		)
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
		headerStyle: { width: '200px' }
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
			field: 'function',
			header: 'Poste'
		},
		{
			field: 'address.city',
			header: 'Ville'
		},
		{
			field: '',
			header: '',
			filter: false,
			sortable: false,
			body: actionBodyTemplate
		}
	].map(column => ({ ...defaultColumnProperty, ...column }))

	useEffect(() => {
		if (!customerId) return null
		const abortController = new AbortController()
		const token = localStorage.getItem('jwt')

		//récupère les data
		const fetchData = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/${customerId}/contact`, {
					signal: abortController.signal,
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success) {
					setContacts(data.data)
					setSelectedData(data.data)
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					// Handling error thrown by aborting request
				}
			}
		}
		fetchData()
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
				</>
			)}

			<Button className="p-button-help" onClick={confirmAddContactDialog} style={{ float: 'right' }}>
				<Add /> Ajouter un Contact
			</Button>

			<DataTable
				ref={dt}
				value={contacts}
				paginator
				scrollable
				paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink LastPageLink"
				rows={20}
				first={first}
				onPage={e => setFirst(e.first)}
				onValueChange={filteredData => setSelectedData(filteredData)}
				{...defaultTableProperty}
				style={{ clear: 'both' }}
			>
				{defaultColumns.map(column => {
					return <Column key={column.field} {...column}></Column>
				})}
			</DataTable>

			<Dialog
				visible={editContactDialog}
				style={{ width: '950px' }}
				header={contact ? 'Édition du contact' : "Ajout d'un contact"}
				modal
				onHide={hideEditContactDialog}
			>
				<ContactForm
					customer={customerId}
					contact={contact}
					handleClose={hideEditContactDialog}
					createContact={createContact}
					updateContact={updateContact}
					serverError={serverError}
					setServerError={setServerError}
				/>
			</Dialog>
			<Dialog
				visible={deleteContactDialog}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={deleteContactDialogFooter}
				onHide={hideDeleteContactDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
					{contact && (
						<span>
							Voulez-vous supprimer cet item : <b>{contact.name}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</>
	)
}

export default DataGrid
