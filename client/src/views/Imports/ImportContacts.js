import React, { useState } from 'react'
import CustomerBreadcrumbs from '../../components/Breadcrumps/CustomerBreadcrumbs'
import ImportCSV from './ImportCSV'

const ImportCSVContact = () => {
	const [countUpdated, setCountUpdated] = useState(0)
	const [countNew, setCountNew] = useState(0)
	const [countSuccessfull, setCountSuccessfull] = useState(0)
	const [countFail, setCountFail] = useState(0)

	const updateDB = async row => {
		const abortController = new AbortController()
		const token = localStorage.getItem('jwt')

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/import/contacts`, {
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
			label: 'REF Entreprise',
			optional: false
		},
		{
			name: 'name',
			label: 'Nom',
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
			name: 'language',
			label: 'Langue',
			optional: true
		},
		{
			name: 'status',
			label: 'Status',
			optional: true
		}
	]
	const nextPageUrl = '/admin/customers'
	return (
		<>
			<CustomerBreadcrumbs lastOption="Importation des contacts" />

			<ImportCSV importedField={importedField} updateDB={updateDB} nextPageUrl={nextPageUrl} />
			<p>Transfert ajouté : {countNew}</p>
			<p>Transfert mis à jour : {countUpdated}</p>
			<p>Transfert total réussi : {countSuccessfull}</p>
			<p>Transfert Échoué: {countFail}</p>
		</>
	)
}

export default ImportCSVContact
