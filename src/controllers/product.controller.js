import { ProductService } from '../services/products.service.js'
import { 
    sendUserError, 
    sendServerError, 
    sendRequestError, 
    sendSuccess,
    createdSuccess
} from '../responseHelpers.js'

export const getProductsController = async (req, res) => {
    try {
        const result = await ProductService.getAll()
        return sendSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const getProductsByIdController = async (req, res) => {
    try {
        const pid = req.params.pid
        const result = await ProductService.getById(pid)
        if (!result) return sendRequestError(res, 'The product does not exist')
        return sendSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const addProductsController = async (req, res) => {
    try {
        if (!req.file) console.log('No image')
        if (!req.body) return sendUserError(res, 'Product no can be created without properties')

        let product = {
            title: req.body.title,
            description: req.body.description,
            price: parseFloat(req.body.price),
            thumbnails: [req?.file?.originalname] || [],
            code: req.body.code,
            category: req.body.category,
            stock: parseInt(req.body.stock),
        }

        const result = await ProductService.create(product)
        const products = await ProductService.getAll()
        req.app.get('socketio').emit('updatedProducts', products)
        return createdSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const updateProductsController = async (req, res) => {
    try {
        const pid = req.params.pid
        if (req.body._id === pid) return sendUserError(res, 'Cannot modify product id')
        const updated = req.body 
        const productFind = await ProductService.getById(pid)
        if (!productFind) return sendRequestError(res, 'The product does not exist')
        await ProductService.update(pid, updated)

        const products = await ProductService.getAll()
        req.app.get('socketio').emit('updatedProducts', products)
        return sendSuccess(res, products)

    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const deleteProductsController = async (req, res) => {
    try {
        const pid = req.params.pid 
        const result = await ProductService.delete(pid)
        if (!result) return sendRequestError(res, `No such product with id: ${pid}`)

        const products = await ProductService.getAll()
        req.app.get('socketio').emit('updatedProducts', products)

        return sendSuccess(res, products)

    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}