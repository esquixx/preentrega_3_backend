import { CartService, purchaseService } from '../services/carts.service.js'
import { ProductService } from '../services/products.service.js'
import { 
    sendUserError, 
    sendServerError, 
    sendRequestError, 
    sendSuccess,
    createdSuccess
} from '../responseHelpers.js'

export const addCartController = async (req, res) => {
    try {
        const result = await CartService.addCart(req)
        return createdSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const addProductToCartController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const product = await ProductService.getById(pid)
        if (!product) {
            return sendRequestError(res, 'Invalid product')
        }
        const cart = await CartService.getCart(cid)
        if (!cart) {
            return sendRequestError(res, 'Invalid cart')
        }
        const existingProductIndex = cart.products.findIndex(item => item.product._id == pid)
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1
        } else {
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            cart.products.push(newProduct)
        }
        const result = await CartService.updatedCart({ _id: cid }, cart)
        return sendSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const getCartController = async (req, res) => {
    try {
        const cid = req.params.cid 
        const cart = await CartService.getCart(cid)
        if (!cart) {
            return sendRequestError(res, `The cart with id ${cid} doesn't exist`)
        }
        return sendSuccess(res, cart)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const updateProductToCartController = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await CartService.getCart(cid)
        if (!cart) {
            return sendRequestError(res, 'Invalid cart')
        }
        const existingProductIndex = cart.products.findIndex(item => item.product._id == pid)
        if (existingProductIndex === -1) {
            return sendRequestError(res, 'Invalid product')
        }
        const quantity = req.body.quantity 
        if (!Number.isInteger(quantity) || quantity < 0) {
            return sendUserError(res, 'Quantity must be a positive integer')
        }
        cart.products[existingProductIndex].quantity = quantity
        const result = await CartService.updatedCart({ _id: cid }, cart)
        return sendSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const updatedCartController = async (req, res) => {
    try {
        const cid = req.params.cid 
        const cart = await CartService.getCart(cid)
        if (!cart) {
            return sendRequestError(res, 'Invalid cart')
        }
        const products = req.body.products
        if (!Array.isArray(products)) {
            return sendUserError(res, 'The product array format is invalid')
        }
        cart.products = products
        const result = await CartService.updatedCart({ _id: cid }, cart)
        console.log(result.products)
        return sendSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const deleteCartController = async (req, res) => {
    try {
        const cid = req.params.cid 
        const result = await CartService.deleteCart(cid)
        if (!result) {
            return sendRequestError(res, 'Invalid cart')
        }
        return sendSuccess(res, result)
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const deleteProductInCartController = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await CartService.getCart(cid)
        if (!cart) {
            return sendRequestError(res, 'Invalid cart')
        }
        const existingProductIndex = cart.products.findIndex(item => item.product._id == pid)
        if (existingProductIndex === -1) {
            return sendRequestError(res, 'Invalid product')
        }
        cart.products.splice(existingProductIndex, 1)
        await CartService.updatedCart({ _id: cid}, cart)
        const updatedCart = await CartService.getCart(cid)
        return sendSuccess(res, updatedCart )
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}

export const getPurchaseController = async (req, res) => {
    try {
        const result = await purchaseService(req, res)
        return result
    } catch (error) {
        console.log(error)
        return sendServerError(res, error.message)
    }
}
