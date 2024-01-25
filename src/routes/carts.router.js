import appRouter from './router.js'
import {
    addCartController,
    addProductToCartController,
    getCartController,
    getPurchaseController,
    updateProductToCartController,
    updatedCartController,
    deleteCartController,
    deleteProductInCartController,
} from '../controllers/cart.controller.js'

// Constantes para roles
const USER_ROLE = 'USER'
const ADMIN_ROLE = 'ADMIN'

export default class CartsRouter extends appRouter {
    init() {
        // Definir rutas
        const baseRoute = '/';
        const cartProductRoute = '/:cid/product/:pid';
        const cartRoute = '/:cid';
        const purchaseRoute = '/:cid/purchase';

        // Configurar rutas
        this.post(baseRoute, [USER_ROLE, ADMIN_ROLE], addCartController);

        this.post(cartProductRoute, [USER_ROLE], addProductToCartController)

        this.get(cartRoute, [USER_ROLE, ADMIN_ROLE], getCartController)

        this.put(cartProductRoute, [USER_ROLE, ADMIN_ROLE], updateProductToCartController)

        this.put(cartRoute, [USER_ROLE, ADMIN_ROLE], updatedCartController)

        this.delete(cartRoute, [USER_ROLE, ADMIN_ROLE], deleteCartController)

        this.delete(cartProductRoute, [USER_ROLE], deleteProductInCartController)

        this.get(purchaseRoute, [USER_ROLE], getPurchaseController)
    }
}



/* export default class CartsRouter extends appRouter {
    init() {
        this.post('/', ['USER', 'ADMIN'], addCartController)

        this.post('/:cid/product/:pid', ['USER'], addProductToCartController)

        this.get('/:cid', ['USER', 'ADMIN'], getCartController)

        this.put('/:cid/product/:pid', ['USER', 'ADMIN'], updateProductToCartController)

        this.put('/:cid', ['USER', 'ADMIN'], updatedCartController)

        this.delete('/:cid', ['USER', 'ADMIN'], deleteCartController)

        this.delete('/:cid/product/:pid', ['USER'], deleteProductInCartController)

        this.get('/:cid/purchase', ['USER'], getPurchaseController)
    }
}
 */