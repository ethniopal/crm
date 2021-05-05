import React from 'react'
import List from '@material-ui/core/List'

import NoteItem from './NoteItem'

const noteDataList = ({ customer, notes, setNotes, handleOpenNotification }) => {
	return (
		<>
			<List
				style={{
					width: '100%',
					maxWidth: '1200px'
				}}
			>
				{notes &&
					notes.map(item => (
						<NoteItem
							note={item}
							key={item._id}
							notes={notes}
							setNotes={setNotes}
							handleOpenNotification={handleOpenNotification}
						/>
					))}
			</List>
			{!notes && <p>Aucune notes associé à ce client</p>}
		</>
	)
}
export default noteDataList
