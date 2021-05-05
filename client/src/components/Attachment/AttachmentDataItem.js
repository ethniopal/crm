import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Avatar from '@material-ui/core/Avatar'
import { Image, PictureAsPdf, FileCopy } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { haveAccess, userPermission } from '../../variables/user.js'
const { ADMIN, COLLABORATOR } = userPermission

const download = require('downloadjs')

const AttachmentDataItem = ({ attachment, setAttachments, attachments, handleOpenNotification }) => {
	const { _id: id, title, mimetype, original: filename, createdAt } = attachment
	const token = localStorage.getItem('jwt')
	let date = ''
	const d = new Date(createdAt)
	const year = d.getFullYear()
	const month = (d.getMonth() + 1 + '').padStart(2, '0')
	const day = (d.getDate() + '').padStart(2, '0')
	const hour = d.getHours()
	const minutes = (d.getMinutes() + '').padStart(2, '0')

	date = `${year}/${month}/${day} ${hour}:${minutes}`

	//permet de downloader les fichiers
	const handleClickDownload = (e, id, filename) => {
		const fetchDownload = async (id, filename) => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/attachment/${id}`, {
					headers: { Authorization: `Bearer ${token}` }
				})
				const blob = await response.blob()
				download(blob, filename)
			} catch (error) {
				if (error.name === 'AbortError') {
					// Handling error thrown by aborting request
				}
			}
		}

		fetchDownload(id, filename)
	}

	//permet de supprimer les fichiers
	const handleClickDelete = (e, id) => {
		const fetchDelete = async id => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/attachment/${id}`, {
					method: 'delete',
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success) {
					setAttachments(attachments.filter(item => item._id !== id))
					handleOpenNotification({ open: true, severity: 'success', message: data.message })
				} else {
					handleOpenNotification({ open: true, severity: 'error', message: data.message })
				}
			} catch (error) {
				console.log(error)
			}
		}

		fetchDelete(id)
	}

	const Icon = checkMimeType(mimetype)

	const userAccess = localStorage.getItem('user') === attachment?.postedBy?._id

	return (
		<ListItem>
			<ListItemAvatar onClick={e => handleClickDownload(e, id, filename)} style={{ cursor: 'pointer' }}>
				<Avatar>{Icon}</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={title}
				secondary={date}
				onClick={e => handleClickDownload(e, id, filename)}
				style={{ cursor: 'pointer' }}
			/>
			{(haveAccess([ADMIN, COLLABORATOR]) || userAccess) && (
				<ListItemSecondaryAction>
					<IconButton
						edge="end"
						aria-label="delete"
						color="secondary"
						onClick={e => handleClickDelete(e, id)}
					>
						<DeleteIcon />
					</IconButton>
				</ListItemSecondaryAction>
			)}
		</ListItem>
	)
}

function checkMimeType(mimetype) {
	if (!mimetype) return <></>

	const [type, doc] = mimetype.split('/')

	switch (type) {
		case 'image':
			return <Image />
		case 'video':
			return <Image />
		case 'application':
			if (doc === 'pdf') {
				return <PictureAsPdf />
			}
			return <FileCopy />

		default:
			return <FileCopy />
	}
}

export default AttachmentDataItem
