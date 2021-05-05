import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'

import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import { formatDate } from '../../utils/utils'
import { haveAccess, userPermission } from '../../variables/user.js'
const { ADMIN, COLLABORATOR } = userPermission

const useStyles = makeStyles(() => ({
	listItemText: {
		maxWidth: '75ch'
	},
	row: {
		display: 'flex',
		maxWidth: 'calc(100% - 5.5rem)'
	},
	inline: {
		display: 'block'
	},
	action: {
		minWidth: '5rem'
	}
}))

export default function NoteData({ note, notes, setNotes, handleOpenNotification }) {
	const {
		_id: id,
		title,
		createdAt,
		description,
		postedBy: { name }
	} = note

	const token = localStorage.getItem('jwt')
	const date = formatDate(createdAt)

	const classes = useStyles()
	let history = useHistory()
	const { pathname } = history.location
	const userAccess = localStorage.getItem('user') === note?.postedBy?._id

	//permet de supprimer les fichiers
	const handleClickDelete = (e, id) => {
		const fetchDelete = async id => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, {
					method: 'delete',
					headers: { Authorization: `Bearer ${token}` }
				})
				const data = await response.json()

				if (data.success) {
					setNotes(
						notes.filter(item => {
							return item._id !== id
						})
					)
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

	return (
		<>
			<ListItem alignItems="flex-start" className={classes.row}>
				<ListItemAvatar>{name && <Avatar>{name[0].toUpperCase()}</Avatar>}</ListItemAvatar>
				<ListItemText
					className={classes.listItemText}
					primary={
						<Typography component="small" variant="body2" className={classes.inline} color="textPrimary">
							{date}
						</Typography>
					}
					secondary={
						<>
							<Typography
								component="span"
								variant="subtitle1"
								className={classes.inline}
								color="textPrimary"
							>
								{title}
							</Typography>
							<span style={{ whiteSpace: 'pre-wrap' }}>{description}</span>
						</>
					}
				/>
				{(haveAccess([ADMIN, COLLABORATOR]) || userAccess) && (
					<ListItemSecondaryAction className={classes.action}>
						<Link to={`${pathname}/${id}`}>
							<IconButton edge="end" aria-label="delete" color="secondary">
								<EditIcon />
							</IconButton>
						</Link>
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
			<Divider variant="inset" component="li" />
		</>
	)
}
