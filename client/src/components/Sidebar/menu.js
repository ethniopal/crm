import React from 'react'
import { Assignment, Person, Dashboard } from '@material-ui/icons'
import { userPermission } from '../../variables/user.js'
const { ADMIN, COLLABORATOR, SELLER, DISPATCHER } = userPermission

export const menu = [
	{
		icon: <Dashboard />,
		title: 'Tableau de bord',
		link: '/admin/dashboard',
		items: []
	},
	{
		icon: <Assignment />,
		title: 'Client',
		items: [
			{
				title: 'Liste des clients',
				link: '/admin/customers'
			},
			{
				title: 'Ajouter un client',
				link: '/admin/customers/create',
				permission: [ADMIN, COLLABORATOR, SELLER, DISPATCHER]
			},

			{
				title: 'Importer des clients',
				link: '/admin/import/customers',
				permission: [ADMIN]
			},
			{
				title: 'Importer des contacts',
				link: '/admin/import/contacts',
				permission: [ADMIN]
			}
		]
	},
	{
		icon: <Assignment />,
		title: 'Soumissions',
		items: [
			{
				title: 'Toutes les soumissions',
				link: '/admin/submissions'
			},
			{
				title: 'Ajouter une soumissions',
				link: '/admin/submission/create'
			}
		]
	},
	/*
	{
		icon: <BubbleChart />,
		title: 'Rapports',
		items: [
			{
				title: 'Prospect',
				link: '/chart'
			},
			{
				title: 'Clients sans attribution',
				link: '/admin'
			},
			{
				title: 'Clients sans activités',
				link: '/trendlines'
			}
		]
	},*/
	{
		icon: <Person />,
		title: 'Utilisateurs',
		items: [
			{
				title: 'Liste des utiliteurs',
				link: '/admin/users'
			},
			{
				title: 'Votre profil',
				link: '/admin/users/profile'
			}
		]
	}
]
