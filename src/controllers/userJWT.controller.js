import { generateToken } from '../utils.js'
import { SIGNED_COOKIE_KEY } from '../config/config.js'
import { sendServerError } from '../responseHelpers.js'
import UserDTO from '../dto/users.dto.js'

export const userRegisterController = async (req, res) => {
    try {
        return res.redirect('/api/jwt/login')
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const failRegisterController = (req, res) => {
    res.render('errors/errorPage', { status: 'error', error: 'Failed Register!' })
}

export const viewRegisterController = (req, res) => {
    res.render('sessions/register')
}

export const userLoginController = (req, res) => {
    try {
        const user = req.user
        const access_token = generateToken(user)
        res.cookie(SIGNED_COOKIE_KEY, access_token, { signed: true }).redirect('/products')
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const failLoginController = (req, res) => {
    res.render('errors/errorPage', { status: 'error', error: 'Invalid Credentials' })
}

export const viewLoginController = (req, res) => {
    res.render('sessions/login')
}

export const loginGithubController = async (req, res) => {}

export const githubCallbackController = async (req, res) => {
    try {
        const access_token = req.authInfo.token
        res.cookie(SIGNED_COOKIE_KEY, access_token, { signed: true }).redirect('/products')
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const userLogoutController = (req, res) => {
    try {
        res.clearCookie(SIGNED_COOKIE_KEY).redirect('/api/jwt/login')
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const errorPageController = (req, res) => {
    res.render('errors/errorPage')
}

export const userCurrentController = (req, res) => {
    try {
        const user = new UserDTO(req.user)
        res.render('sessions/current', { user })
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}
