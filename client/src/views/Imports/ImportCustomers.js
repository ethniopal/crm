import React, { useState } from 'react'
import CustomerBreadcrumbs from '../../components/Breadcrumps/CustomerBreadcrumbs'
import ImportCSV from './ImportCSV'
import { customerStatuses } from '../../variables/client.js'

const ImportCSVCustomer = () => {
	const [countUpdated, setCountUpdated] = useState(0)
	const [countNew, setCountNew] = useState(0)
	const [countSuccessfull, setCountSuccessfull] = useState(0)
	const [countFail, setCountFail] = useState(0)

	const [defaultValues, setDefaultValues] = useState({ status: customerStatuses[0] })

	const handleChangeSelectType = e => {
		setDefaultValues({ ...defaultValues, status: e.target.value })
	}

	const updateDB = async row => {
		const abortController = new AbortController()
		const token = localStorage.getItem('jwt')

		row.status = defaultValues.status
		// console.log(JSON.stringify(row))

		try {
			const response = await fetch(`/api/import/customers`, {
				signal: abortController.signal,
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'put',
				body: JSON.stringify(row)
			})
			const data = await response.json()

			if (data.success) {
				if (data.action === 'created') {
					setCountNew(prev => prev + 1)
				}
				if (data.action === 'updated') {
					setCountUpdated(prev => prev + 1)
				}
				setCountSuccessfull(prev => prev + 1)
			} else {
				setCountFail(prev => prev + 1)
			}
		} catch (error) {
			console.log(error)
			if (error.name === 'AbortError') {
				// Handling error thrown by aborting request
			}
			abortController.abort()
		}
	}
	const importedField = [
		{
			name: 'refNumber',
			label: 'REF',
			optional: false
		},
		{
			name: 'name',
			label: 'Companie',
			optional: false
		},
		{
			name: 'email',
			label: 'Email',
			optional: true
		},
		{
			name: 'phone.phone',
			label: 'Téléphone',
			optional: false
		},

		{
			name: 'phone.ext',
			label: 'Ext.',
			optional: true
		},
		{
			name: 'phone.mobile',
			label: 'Cellulaire',
			optional: true
		},
		{
			name: 'phone.fax',
			label: 'Fax',
			optional: true
		},
		{
			name: 'address.address',
			label: 'Adresse',
			optional: true
		},
		{
			name: 'address.city',
			label: 'Ville',
			optional: true
		},
		{
			name: 'address.province',
			label: 'Province',
			optional: true
		},
		{
			name: 'address.country',
			label: 'Pays',
			optional: true
		},
		{
			name: 'address.zip',
			label: 'Code Postal',
			optional: true
		},

		{
			name: 'website',
			label: 'Site web',
			optional: true
		},

		{
			name: 'mainContact.name',
			label: 'Nom du contact',
			optional: true
		},
		{
			name: 'mainContact.email',
			label: 'Email Contact',
			optional: true
		},
		{
			name: 'mainContact.function',
			label: 'Titre Contact',
			optional: true
		},
		{
			name: 'mainContact.phone.phone',
			label: 'Téléphone Contact',
			optional: true
		},
		{
			name: 'mainContact.phone.ext',
			label: 'Ext. du contact',
			optional: true
		},

		{
			name: 'mainContact.phone.mobile',
			label: 'Cellulaire Contact',
			optional: true
		},
		{
			name: 'language',
			label: 'Langue',
			optional: true
		}
	]
	const nextPageUrl = '/admin/customers'
	return (
		<>
			<CustomerBreadcrumbs lastOption="Importation des clients" />
			<div className="row">
				<div className=" col-md-6">
					<h4>Veuillez d'abord sélectionner le type</h4>
					<select
						value={defaultValues.status}
						onChange={handleChangeSelectType}
						style={{ padding: '0.5rem 1rem' }}
					>
						<option value="">Aucune</option>
						{customerStatuses.map(item => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
					</select>
				</div>
			</div>
			{defaultValues && (
				<>
					<ImportCSV importedField={importedField} updateDB={updateDB} nextPageUrl={nextPageUrl} />
					<div className="col-md-6">
						<p>Transfert ajouté : {countNew}</p>
						<p>Transfert mis à jour : {countUpdated}</p>
						<p>Transfert total réussi : {countSuccessfull}</p>
						<p>Transfert Échoué: {countFail}</p>
					</div>
				</>
			)}
		</>
	)
}

export default ImportCSVCustomer
