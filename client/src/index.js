/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
//redux
// import { Provider } from 'react-redux'
// import store from './store'

// core components
import App from './App.js'

//styles
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import 'assets/css/bootstrap-grid.min.css'
import 'assets/css/material-dashboard-react.css?v=1.9.0'

// var noOp = function () {}

// window.console = {
// 	log: noOp,
// 	dir: noOp
// }

ReactDOM.render(
	<>
		{/* <Provider store={store}> */}

		<BrowserRouter>
			<App />
		</BrowserRouter>
		{/* </Provider> */}
	</>,

	document.getElementById('root')
)
