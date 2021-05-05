import React from 'react'

import DatagridCustomer from '../../components/Datagrid/DatagridCustomer2'
import CustomerBreadcrumbs from '../../components/Breadcrumps/CustomerBreadcrumbs'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

export default function CustomerPage() {
	return (
		<div className="row">
			<StyledHeaderOption>
				<CustomerBreadcrumbs lastOption="" />

				<Link to="/admin/customers/create">
					<Button variant="contained" color="secondary">
						+ Ajouter un client
					</Button>
				</Link>
			</StyledHeaderOption>
			<DatagridCustomer />
		</div>
	)
}

const StyledHeaderOption = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	justify-content: space-between;
	align-items: center;
`
