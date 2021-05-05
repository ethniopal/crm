// core components/views for Admin layout
import DashboardPage from './views/Dashboard/Dashboard.js'
import UserProfile from './views/User/UserProfile.js'
import CardUser from './components/Users/CardUser.js'
import CustomersList from './views/Customers/Customers.js'
import CustomersOptions from './views/Customers/CustomersOptions.js'
import SubmissionAdd from './views/Submission/SubmissionAdd'
import SubmissionList from './views/Submission/SubmissionList'

import NotificationsPage from './views/Notifications/Notifications.js'
import ImportCustomer from './views/Imports/ImportCustomers.js'
import ImportContact from './views/Imports/ImportContacts.js'

const adminRoutes = [
	{
		path: '/admin/dashboard',
		component: DashboardPage,
		name: 'Dashboard',
		exact: true
	},
	{
		path: '/admin/users',
		component: CardUser,
		name: 'Listes des utilisateurs',
		exact: true
	},
	{
		path: '/admin/users/create',
		component: UserProfile,
		name: 'Utilisteur',
		exact: true
	},
	{
		path: '/admin/users/update/:id',
		component: UserProfile,
		name: 'Utilisteur',
		exact: false
	},
	{
		path: '/admin/users/view/:id',
		component: UserProfile,
		name: 'Utilisteur',
		exact: false
	},
	{
		path: '/admin/users/profile',
		component: UserProfile,
		name: 'Utilisteur',
		exact: false
	},
	{
		path: '/admin/customers/create',
		component: CustomersOptions,
		name: 'Client',
		exact: true
	},
	{
		path: '/admin/customers/:customerId',
		component: CustomersOptions,
		name: 'Client',
		exact: true
	},
	{
		path: '/admin/customers/:customerId/:option',
		component: CustomersOptions,
		name: 'Client',
		exact: true
	},
	{
		path: '/admin/customers/:customerId/:option/:id',
		component: CustomersOptions,
		name: 'Client',
		exact: true
	},
	{
		path: '/admin/customers',
		component: CustomersList,
		name: 'Client',
		exact: true
	},

	{
		path: '/admin/submissions',
		component: SubmissionList,
		name: 'Soumission',
		exact: true
	},
	{
		path: '/admin/submission/create',
		component: SubmissionAdd,
		name: 'Soumission',
		exact: true
	},
	{
		path: '/admin/submission/:id',
		component: SubmissionAdd,
		name: 'Soumission',
		exact: false
	},

	{
		path: '/admin/notifications',
		component: NotificationsPage,
		name: 'Notifications',
		exact: true
	},
	{
		path: '/admin/import/customers',
		component: ImportCustomer,
		name: 'Importation des clients',
		exact: true
	},
	{
		path: '/admin/import/contacts',
		component: ImportContact,
		name: 'Importation des contacts',
		exact: true
	}
]

export default adminRoutes
