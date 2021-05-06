import React, { useState, useEffect } from 'react'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import axios from 'axios'
// import { reducer } from './reducers/userReducer'
// core components
import Admin from './layouts/Admin.js'
import LoginForm from './components/LoginForm/LoginForm'
import NotFound from './views/Errors/NotFound'

import routes from './routes.js'
import GlobalStyles from './assets/GlobalStyles'

// const hist = createBrowserHistory()
// const token = localStorage.getItem('jwt')

const AuthRouting = () => {
	const location = useLocation()
	return (
		<Admin>
			<Switch location={location} key={location.pathname}>
				<Route path="/" exact render={() => <Redirect to="/admin/dashboard" />} />
				{routes.map((prop, key) => {
					if (prop.exact) {
						return <Route exact path={prop.path} component={prop.component} key={key} />
					}
					return <Route path={prop.path} component={prop.component} key={key} />
				})}

				<Route path="*" component={NotFound} />
			</Switch>
		</Admin>
	)
}

const GuessRouting = () => {
	const location = useLocation()
	return (
		<Switch location={location} key={location.pathname}>
			<Route path="/login" exact component={LoginForm} />
			<Route path="*" component={LoginForm} />

			<Route render={() => <Redirect to="/login" />} />
		</Switch>
	)
}

const App = () => {
	const [isLoaded, setIsLoaded] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const token = localStorage.getItem('jwt')
	const controller = new AbortController()
	const { signal } = controller

	useEffect(() => {
		axios.get('/api/test').then(response => console.log('proxy working', response))
	}, [])

	useEffect(() => {
		try {
			fetch(`/api/auth/login`, {
				...signal,
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
				.then(res => res.json())
				.then(data => {
					setIsLoggedIn(data.success || false)
				})
		} catch (e) {
			setIsLoggedIn(false)
		}

		setIsLoaded(true)

		return () => controller.abort()
	}, [])

	return (
		<div className="app">
			<GlobalStyles />
			{isLoaded && (isLoggedIn ? <AuthRouting /> : <GuessRouting />)}
		</div>
	)
}

export default App
