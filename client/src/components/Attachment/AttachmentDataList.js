import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import AttachmentDataItem from './AttachmentDataItem'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	}
}))

const AttachmentDataList = ({ attachments, setAttachments, handleOpenNotification }) => {
	const classes = useStyles()
	return (
		<>
			<List className={classes.root}>
				{attachments &&
					attachments.map(item => (
						<AttachmentDataItem
							attachment={item}
							key={item._id}
							attachments={attachments}
							setAttachments={setAttachments}
							handleOpenNotification={handleOpenNotification}
						/>
					))}
			</List>
			{!attachments && <p>Aucune pièce jointe associé à ce client</p>}
		</>
	)
}

export default AttachmentDataList
