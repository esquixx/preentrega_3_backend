import { config } from 'dotenv'

try {
    config()
} catch (error) {
    console.error('Error loading .env file:', error.message)
    process.exit(1)
}

export const PORT = process.env.PORT || 8080

// Verificar la existencia de las variables necesarias
const requiredEnvVariables = [
    'MONGO_URI', 
    'MONGO_DB_NAME', 
    'JWT_CLIENT_ID', 
    'JWT_CLIENT_SECRET', 
    'SECRET_PASS', 
    'PRIVATE_KEY', 
    'SIGNED_COOKIE_KEY', 
    'ADMIN_EMAIL', 
    'ADMIN_PASSWORD', 
    'PERSISTENCE',
    'NODEMAILER_USER',
    'NODEMAILER_PASS'
]

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        console.error(`Error: ${variable} is missing in the .env file.`)
        process.exit(1)
    }
} 

// export const PORT = process.env.PORT || 8080
export const MONGO_URI = process.env.MONGO_URI
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME

export const JWT_CLIENT_ID = process.env.JWT_CLIENT_ID
export const JWT_CLIENT_SECRET = process.env.JWT_CLIENT_SECRET
export const SECRET_PASS = process.env.SECRET_PASS
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const SIGNED_COOKIE_KEY = process.env.SIGNED_COOKIE_KEY

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export const PERSISTENCE = process.env.PERSISTENCE

export const NODEMAILER_USER = process.env.NODEMAILER_USER
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS