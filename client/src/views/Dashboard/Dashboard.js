import React from 'react'
// // react plugin for creating charts
// import ChartistGraph from 'react-chartist'
// // @material-ui/core
// import { makeStyles } from '@material-ui/core/styles'
// import Icon from '@material-ui/core/Icon'
// // @material-ui/icons
// import Store from '@material-ui/icons/Store'

// import AccessTime from '@material-ui/icons/AccessTime'
// import Accessibility from '@material-ui/icons/Accessibility'
// import BugReport from '@material-ui/icons/BugReport'
// import Code from '@material-ui/icons/Code'
// import Cloud from '@material-ui/icons/Cloud'
// // core components
// import GridItem from 'components/Grid/GridItem.js'
// import GridContainer from 'components/Grid/GridContainer.js'
// import Table from 'components/Table/Table.js'
// import Tasks from 'components/Tasks/Tasks.js'
// import CustomTabs from 'components/CustomTabs/CustomTabs.js'
// import Card from 'components/Card/Card.js'
// import CardHeader from 'components/Card/CardHeader.js'
// import CardIcon from 'components/Card/CardIcon.js'
// import CardBody from 'components/Card/CardBody.js'
// import CardFooter from 'components/Card/CardFooter.js'

// import { bugs, website, server } from 'variables/general.js'

// import { completedTasksChart } from 'variables/charts.js'

// import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js'

// styles.cardIcon = {
// 	width: '70px',
// 	height: '70px',
// 	display: 'flex',
// 	justifyContent: 'center',
// 	alignItems: 'center'
// }

// const useStyles = makeStyles(styles)

// export default function Dashboard() {
// 	const classes = useStyles()
// 	return (
// 		<div>
// 			<GridContainer>
// 				<GridItem xs={12} sm={6} md={6} lg={3}>
// 					<Card>
// 						<CardHeader color="warning" stats icon>
// 							<CardIcon className={classes.cardIcon} color="warning">
// 								<Icon>content_copy</Icon>
// 							</CardIcon>
// 							<p className={classes.cardCategory}>Clients</p>
// 							<h3 className={classes.cardTitle}>850</h3>
// 						</CardHeader>
// 					</Card>
// 				</GridItem>

// 				<GridItem xs={12} sm={6} md={6} lg={3}>
// 					<Card>
// 						<CardHeader color="success" stats icon>
// 							<CardIcon className={classes.cardIcon} color="success">
// 								<Store />
// 							</CardIcon>
// 							<p className={classes.cardCategory}>Soumissions</p>
// 							<h3 className={classes.cardTitle}>34,245</h3>
// 						</CardHeader>
// 					</Card>
// 				</GridItem>

// 				<GridItem xs={12} sm={6} md={6} lg={3}>
// 					<Card>
// 						<CardHeader color="info" stats icon>
// 							<CardIcon className={classes.cardIcon} color="info">
// 								<Accessibility />
// 							</CardIcon>
// 							<p className={classes.cardCategory}>Activités</p>
// 							<h3 className={classes.cardTitle}>135000</h3>
// 						</CardHeader>
// 					</Card>
// 				</GridItem>

// 				<GridItem xs={12} sm={6} md={6} lg={3}>
// 					<Card>
// 						<CardHeader color="info" stats icon>
// 							<CardIcon className={classes.cardIcon} color="danger">
// 								<Accessibility />
// 							</CardIcon>
// 							<p className={classes.cardCategory}>Utilisateurs</p>
// 							<h3 className={classes.cardTitle}>75</h3>
// 						</CardHeader>
// 					</Card>
// 				</GridItem>
// 			</GridContainer>

// 			<GridContainer>
// 				<GridItem xs={12} sm={12} md={12}>
// 					<CustomTabs
// 						title="Dernières entrés:"
// 						headerColor="primary"
// 						tabs={[
// 							{
// 								tabName: 'Soumissions',
// 								tabIcon: BugReport,
// 								tabContent: <Tasks checkedIndexes={[0, 3]} tasksIndexes={[0, 1, 2, 3]} tasks={bugs} />
// 							},
// 							{
// 								tabName: 'Clients ',
// 								tabIcon: Code,
// 								tabContent: <Tasks checkedIndexes={[0]} tasksIndexes={[0, 1]} tasks={website} />
// 							},
// 							{
// 								tabName: 'Activités',
// 								tabIcon: Cloud,
// 								tabContent: <Tasks checkedIndexes={[1]} tasksIndexes={[0, 1, 2]} tasks={server} />
// 							}
// 						]}
// 					/>
// 				</GridItem>
// 			</GridContainer>
// 			<GridContainer>
// 				<GridItem xs={12} sm={12} md={6}>
// 					<Card chart>
// 						<CardHeader color="danger">
// 							<ChartistGraph
// 								className="ct-chart"
// 								data={completedTasksChart.data}
// 								type="Line"
// 								options={completedTasksChart.options}
// 								listener={completedTasksChart.animation}
// 							/>
// 						</CardHeader>
// 						<CardBody>
// 							<h4 className={classes.cardTitle}>Soumission complété</h4>
// 							<p className={classes.cardCategory}></p>
// 						</CardBody>
// 						<CardFooter chart>
// 							<div className={classes.stats}>
// 								<AccessTime /> Pour le courant de l'année
// 							</div>
// 						</CardFooter>
// 					</Card>
// 				</GridItem>
// 				<GridItem xs={12} sm={12} md={6}>
// 					<Card>
// 						<CardHeader color="warning">
// 							<h4 className={classes.cardTitleWhite}>Statistique des employés</h4>
// 							<p className={classes.cardCategoryWhite}>Statistique de l'année en cours</p>
// 						</CardHeader>
// 						<CardBody>
// 							<Table
// 								tableHeaderColor="warning"
// 								tableHead={['Nom', 'Nb clients', 'Activités', 'Soumissions']}
// 								tableData={[
// 									['Dakota Rice', '50', '1250', '1250'],
// 									['Minerva Hooper', '25', '1250', '1250'],
// 									['Sage Rodriguez', '33', '1250', '1250'],
// 									['Philip Chaney', '12', '1250', '1250']
// 								]}
// 							/>
// 						</CardBody>
// 					</Card>
// 				</GridItem>
// 			</GridContainer>
// 		</div>
// 	)
// }

export default function Dashboard() {
	return <>Section à venir</>
}
