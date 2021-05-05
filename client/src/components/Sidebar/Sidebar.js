/*eslint-disable*/
import React, { useState } from 'react'

import { NavLink } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { menu } from './menu'
import { hasChildren, haveAccess } from '../../utils/utils'

const checkActive = (match, location) => {
	//some additional logic to verify you are in the home URI
	if (!location) return false
	const { pathname } = location
	// console.log(pathname)
	return pathname === '/'
}

export default function Sidebar({ image, color, open }) {
	return (
		<div
			className={`sidebar-menu ${open ? 'open' : ''}`}
			style={{
				position: 'fixed',
				minHeight: '100%',
				width: '100%',
				maxWidth: '260px',
				overflowY: 'auto',
				backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(' + image + ')',
				paddingTop: '70px',
				backgroundRepear: 'no-repeat',
				top: '0',
				left: '0',
				width: '100%',
				height: 'calc(100% -70px)',
				display: 'block',
				zIndex: '9999',
				position: 'absolute',
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
				color: '#fff'
			}}
		>
			{menu.map((item, key) => (
				<MenuItem key={key} item={item} />
			))}
		</div>
	)
}

const MenuItem = ({ item }) => {
	const Component = hasChildren(item) ? MultiLevel : SingleLevel
	return <>{haveAccess(item?.permission) && <Component item={item} />}</>
}

const SingleLevel = ({ item }) => {
	const link = item.link

	return (
		<>
			{haveAccess(item?.permission) && (
				<NavLink to={link} activeClassName="active" isActive={checkActive}>
					<ListItem button>
						<ListItemIcon style={{ color: 'white' }}>{item.icon}</ListItemIcon>
						<ListItemText primary={item.title} />
					</ListItem>
				</NavLink>
			)}
		</>
	)
}

const MultiLevel = ({ item }) => {
	const { items: children } = item
	const [open, setOpen] = useState(false)

	const handleClick = () => {
		setOpen(prev => !prev)
	}

	return (
		<>
			{haveAccess(item) && (
				<div>
					<ListItem button onClick={handleClick}>
						<ListItemIcon style={{ color: 'white' }}>{item.icon}</ListItemIcon>
						<ListItemText primary={item.title} />
						{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</ListItem>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							{children.map((child, key) => {
								const link = child.link || '/admin'
								return <MenuItem key={key} item={child} />
							})}
						</List>
					</Collapse>
				</div>
			)}
		</>
	)
}
