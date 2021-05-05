import React from 'react'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const CustomerBreadcrumbs = ({ lastOption }) => {
	return (
		<StyledBreadCrumbs>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link className="breadcrump-inherit" to="/admin/dashboard">
					Tableau de bord
				</Link>
				<Link className={!!lastOption ? 'breadcrump-inherit' : 'breadcrump-textPrimary'} to="/admin/customers">
					Liste de client
				</Link>
				{!!lastOption && <Typography color="textPrimary">{lastOption}</Typography>}
			</Breadcrumbs>
		</StyledBreadCrumbs>
	)
}

export default CustomerBreadcrumbs

const StyledBreadCrumbs = styled.div`
	margin-bottom: 1rem;
`
