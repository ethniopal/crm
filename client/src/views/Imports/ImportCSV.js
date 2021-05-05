import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
//https://github.com/beamworks/react-csv-importer
import { Importer, ImporterField } from 'react-csv-importer'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import 'react-csv-importer/dist/index.css'

const ImportCSV = ({ importedField, updateDB, nextPageUrl }) => {
	const [notification, setNotification] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'right',
		severity: 'success',
		message: ''
	})
	const [finish, setFinish] = useState(false)

	// const { severity, vertical, horizontal, message, open } = notification

	const handleCloseNotification = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}
		setNotification({
			...notification,
			open: false
		})
	}

	const showToastNotification = (file, fields) => {
		setNotification({
			...notification,
			open: true,
			message: `Le fichier ${file.name} a bien été importé.`
		})
	}
	const goToNextPage = () => {
		setFinish(true)
	}

	return (
		<>
			<Snackbar
				open={notification.open}
				autoHideDuration={4000}
				onClose={handleCloseNotification}
				anchorOrigin={{ vertical: notification.vertical, horizontal: notification.horizontal }}
				key={notification.vertical + notification.horizontal}
			>
				<Alert onClose={handleCloseNotification} severity="success">
					{notification.message}
				</Alert>
			</Snackbar>

			<Importer
				chunkSize={10000} // optional, internal parsing chunk size in bytes
				assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
				restartable={true} // optional, lets user choose to upload another file when import is complete
				processChunk={async rows => {
					for (let row of rows) {
						await updateDB(row)
						// console.log(row)
					}
				}}
				onComplete={({ file, fields }) =>
					// optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
					showToastNotification(file, fields)
				}
				onClose={() => {
					goToNextPage()
				}}
				// CSV options passed directly to PapaParse if specified:
				// delimiter={...}
				// newline={...}
				// quoteChar={...}
				// escapeChar={...}
				// comments="test"
				// skipEmptyLines={...}
				// delimitersToGuess={...}
			>
				{importedField.map(({ name, label, optional }, idx) =>
					optional ? (
						<ImporterField key={idx} name={name} label={label} optional />
					) : (
						<ImporterField key={idx} name={name} label={label} />
					)
				)}
			</Importer>

			{finish && <Redirect to={nextPageUrl} />}
		</>
	)
}

export default ImportCSV
