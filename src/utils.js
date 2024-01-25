import multer from 'multer'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { PRIVATE_KEY } from './config/config.js'
import handlebars from 'handlebars'
import shortid from 'shortid'
import moment from 'moment'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Definir mensajes de error 
const errorMessages = {
    noToken: 'Token not provided',
    noUserSession: 'There is no user with an active session',
    unauthorized: 'Unauthorized',
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
export const uploader = multer({ storage })

// Función para crear hash de contraseña
export const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Función para validar contraseña
export const isValidPassword = (user, password) =>
    bcrypt.compareSync(password, user.password)

// Generar token JWT
export const generateToken = user => jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })

// Middleware Passport genérico
export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (err) return next(err)
            if (info) {
                handlePassportInfo(info, res)
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

// Middleware Passport para la estrategia 'current'
export const passportCallCurrent = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (!user) {
                if (info) {
                    handlePassportInfo(info, res)
                } 
                return res.status(401).json({ status: 'error', error: errorMessages.unauthorized })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

// Función para generar un código único
export const generateUniqueCode = () => shortid.generate()

// Helper de Handlebars para formatear fechas
export const dateHelper = handlebars.registerHelper(
    'formatDate',
    function (date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
    }
)

// Función para manejar información de Passport
const handlePassportInfo = (info, res) => {
    if (info.message === 'Token not provided') {
        return res.status(401).json({ status: 'error', error: errorMessages.noToken })
    } else if (info.message === 'There is no user with an active session') {
        return res.status(401).json({ status: 'error', error: errorMessages.noUserSession })
    } else {
        return res.status(401).json({ status: 'error', error: errorMessages.unauthorized })
    }
}