import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { PRIVATE_KEY, SIGNED_COOKIE_KEY } from '../config/config.js'
import { cookieExtractor } from '../config/passport.config.js'
import {
    sendSuccess,
    createdSuccess,
    sendServerError,
    sendUserError,
    authFailError,
    sendRequestError,
} from '../responseHelpers.js'

export default class appRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init() {
        // Métodos HTTP
        // const methods = ['get', 'post', 'put', 'delete']

        /* methods.forEach(method => {
            this[method] = (path, policies, ...callbacks) => {
                this.router[method](
                    path,
                    this.handlePolicies(policies),
                    this.generateCustomResponses,
                    this.applyCallbacks(callbacks)
                )
            }
        }) */
    }

    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    } 

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).json({ error })
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => sendSuccess(res, payload)
        res.createdSuccess = payload => createdSuccess(res, payload)
        res.sendServerError = error => sendServerError(res, error)
        res.sendUserError = error => sendUserError(res, error)
        res.authFailError = error => authFailError(res, error)
        res.sendRequestError = error => sendRequestError(res, error)
        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next()
        
        const authHeaders = req.signedCookies[SIGNED_COOKIE_KEY]
        if (!authHeaders) {
            return res.status(401).render('errors/errorPage', { status: 'error', error: 'Unauthorized' })
        }
        
        const token = cookieExtractor(req)
        let user = jwt.verify(token, PRIVATE_KEY)
        if (!policies.includes(user.user.role.toUpperCase())) {
            return res.status(403).render('errors/errorPage', { status: 'error', error: 'No authorized' })
        }
        req.user = user
        next()
    }
}
