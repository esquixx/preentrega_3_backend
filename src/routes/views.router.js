import appRouter from './router.js'
import {
    getProductsViewsController,
    getRealTimeProductsController,
    getChatController,
    getProductsByIdViewController,
    getCartViewController,
} from '../controllers/view.controller.js'

// Constantes para roles
const USER_ROLE = 'USER'
const ADMIN_ROLE = 'ADMIN'

export default class ViewsProductsRouter extends appRouter {
    init() {
        // Rutas
        const productsRoute = '/'
        const realTimeProductsRoute = '/realTimeProducts'
        const chatRoute = '/chat'
        const productByIdRoute = '/product/:pid'
        const cartRoute = '/carts/:cid'

        // Controladores
        const productsController = getProductsViewsController
        const realTimeProductsController = getRealTimeProductsController
        const chatController = getChatController
        const productByIdController = getProductsByIdViewController
        const cartController = getCartViewController

        // Definir rutas
        this.get(productsRoute, [USER_ROLE, ADMIN_ROLE], productsController)
        this.get(realTimeProductsRoute, [ADMIN_ROLE], realTimeProductsController)
        this.get(chatRoute, [USER_ROLE], chatController)
        this.get(productByIdRoute, [USER_ROLE, ADMIN_ROLE], productByIdController)
        this.get(cartRoute, [USER_ROLE, ADMIN_ROLE], cartController)
    }
}


/* export default class ViewsProductsRouter extends appRouter {
    init() {
        this.get('/', ['USER', 'ADMIN'], getProductsViewsController)

        this.get('/realTimeProducts', ['ADMIN'], getRealTimeProductsController)

        this.get('/chat', ['USER'], getChatController)

        this.get('/product/:pid', ['USER', 'ADMIN'], getProductsByIdViewController)

        this.get('/carts/:cid', ['USER', 'ADMIN'], getCartViewController)
    }
}
 */