import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import run from './run.js'
import { Server } from 'socket.io'
import { __dirname, dateHelper } from './utils.js'
import { PORT, SECRET_PASS, MONGO_URI, MONGO_DB_NAME } from './config/config.js'
import initializePassport from './config/passport.config.js'

const app = express()

// Configuración del middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

// Configuración de Handlebars
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: dateHelper
}))
app.set('views', __dirname + '/views')
app.set('view engine', '.hbs')

// Configuración de cookies y autenticación con Passport
app.use(cookieParser(SECRET_PASS))
initializePassport()
app.use(passport.initialize())

// Deshabilitar el modo estricto de consulta en Mongoose
mongoose.set("strictQuery", false)

// Conexión a la base de datos MongoDB
try {
    await mongoose.connect(`${MONGO_URI}${MONGO_DB_NAME}`)
    console.log('Mongoose connected to MongoDB 😎')

    const httpServer = app.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT} 🏃...`))

    const io = new Server(httpServer)
    app.set('socketio', io)
    run(io, app)
} catch (error) {
    console.error('DB connection error 😟: ', error.message)
    throw error
}
