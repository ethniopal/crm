const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const path = require('path')
const { MONGOURI } = require('./server/keys')
const PORT = process.env.PORT || 5000

// require('dotenv').config()
app.use(helmet())
// app.use(cors())
// permet de télécharger des attachements du serveur
app.use(express.static(path.join(__dirname, 'server', 'uploads')))

// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
		limits: {
			fileSize: 8 * 1024 * 1024 * 1024 //4MB max file(s) size
		}
	})
)

//connecto to BD
mongoose.connect(MONGOURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})

mongoose.connection.on('connected', () => {
	console.log('connected to mongo')
})

mongoose.connection.on('error', err => {
	console.log('Error connecting', err)
})

//lists of models
require('./server/models/index')

app.use(express.json())

//les routes
const { routes } = require('./server/routes/index')

for (let route in routes) {
	app.use('/api', routes[route])
}

// Run this only in production environment
if (process.env.NODE_ENV == 'production') {
	// This to tell express that if it doen't recognize a given file, it should go check it out in the build folder
	app.use(express.static('client/build'))

	// return react build version of index.html when express doesn't recognize any of the above routes
	const path = require('path')
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

require('./server/tasks/index')

app.listen(PORT, () => console.log('server is running on ', PORT))
