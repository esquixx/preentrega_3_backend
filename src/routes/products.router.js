import appRouter from './router.js'
import { uploader } from '../utils.js'
import {
    getProductsController,
    getProductsByIdController,
    addProductsController,
    updateProductsController,
    deleteProductsController,
} from '../controllers/product.controller.js'

// Constantes para roles
const USER_ROLE = 'USER'
const ADMIN_ROLE = 'ADMIN'

export default class ProductsRouter extends appRouter {
    init() {
        // Rutas
        const productsRoute = '/'
        const productByIdRoute = '/:pid'

        // Controladores
        const getProducts = getProductsController
        const getProductById = getProductsByIdController
        const addProduct = addProductsController
        const updateProduct = updateProductsController
        const deleteProduct = deleteProductsController

        // Definir rutas
        this.get(productsRoute, [USER_ROLE, ADMIN_ROLE], getProducts)
        this.get(productByIdRoute, [USER_ROLE, ADMIN_ROLE], getProductById)
        this.post(productsRoute, [ADMIN_ROLE], uploader.single('file'), addProduct)
        this.put(productByIdRoute, [ADMIN_ROLE], updateProduct)
        this.delete(productByIdRoute, [ADMIN_ROLE], deleteProduct)
    }
}



/* export default class ProductsRouter extends appRouter {
    init() {
        this.get('/', ['USER', 'ADMIN'], getProductsController)

        this.get('/:pid', ['USER', 'ADMIN'], getProductsByIdController)

        this.post('/', ['ADMIN'], uploader.single('file'), addProductsController)

        this.put('/:pid', ['ADMIN'], updateProductsController)

        this.delete('/:pid', ['ADMIN'], deleteProductsController)
    }
}
 */