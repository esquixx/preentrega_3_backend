import passport from 'passport'
import appRouter from './router.js'
import { passportCallCurrent } from '../utils.js'
import {
    userRegisterController,
    failRegisterController,
    viewRegisterController,
    userLoginController,
    failLoginController,
    viewLoginController,
    loginGithubController,
    githubCallbackController,
    userLogoutController,
    errorPageController,
    userCurrentController,
} from '../controllers/userJWT.controller.js'

// Constantes para roles
const PUBLIC_ROLE = 'PUBLIC'

export default class JWTRouter extends appRouter {
    init() {
        // Rutas
        const registerRoute = '/register'
        const failRegisterRoute = '/failRegister'
        const viewRegisterRoute = '/register'
        const loginRoute = '/login'
        const failLoginRoute = '/failLogin'
        const viewLoginRoute = '/login'
        const githubRoute = '/github'
        const githubCallbackRoute = '/githubcallback'
        const logoutRoute = '/logout'
        const errorRoute = '/error'
        const currentRoute = '/current'

        // Definir rutas
        this.post(registerRoute, [PUBLIC_ROLE], passport.authenticate('register', {
            session: false,
            failureRedirect: failRegisterRoute,
        }), userRegisterController)

        this.get(failRegisterRoute, [PUBLIC_ROLE], failRegisterController)

        this.get(viewRegisterRoute, [PUBLIC_ROLE], viewRegisterController)

        this.post(loginRoute, [PUBLIC_ROLE], passport.authenticate('login', {
            session: false,
            failureRedirect: failLoginRoute,
        }), userLoginController)

        this.get(failLoginRoute, [PUBLIC_ROLE], failLoginController)

        this.get(viewLoginRoute, [PUBLIC_ROLE], viewLoginController)

        this.get(githubRoute, [PUBLIC_ROLE], passport.authenticate('github', { scope: ['user:email'] }), loginGithubController)

        this.get(githubCallbackRoute, [PUBLIC_ROLE], passport.authenticate('github', { session: false }), githubCallbackController)

        this.get(logoutRoute, [PUBLIC_ROLE], userLogoutController)

        this.get(errorRoute, [PUBLIC_ROLE], errorPageController)

        this.get(currentRoute, [PUBLIC_ROLE], passportCallCurrent('current'), userCurrentController)
    }
}


/* export default class JWTRouter extends appRouter {
    init() {
        this.post(
            '/register',
            ['PUBLIC'],
            passport.authenticate('register', {
                session: false,
                failureRedirect: '/api/jwt/failRegister',
            }),
            userRegisterController
        )

        this.get('/failRegister', ['PUBLIC'], failRegisterController)

        this.get('/register', ['PUBLIC'], viewRegisterController)

        this.post(
            '/login',
            ['PUBLIC'],
            passport.authenticate('login', {
                session: false,
                failureRedirect: '/api/jwt/failLogin',
            }),
            userLoginController
        )

        this.get('/failLogin', ['PUBLIC'], failLoginController)

        this.get('/login', ['PUBLIC'], viewLoginController)

        this.get(
            '/github',
            ['PUBLIC'],
            passport.authenticate('github', { scope: ['user:email'] }),
            loginGithubController
        )

        this.get(
            '/githubcallback',
            ['PUBLIC'],
            passport.authenticate('github', { session: false }),
            githubCallbackController
        )

        this.get('/logout', ['PUBLIC'], userLogoutController)

        this.get('/error', ['PUBLIC'], errorPageController)

        this.get(
            '/current',
            ['PUBLIC'],
            passportCallCurrent('current'),
            userCurrentController
        )
    }
}
 */