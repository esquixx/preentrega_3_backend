import { Product } from '../dao/factory/products.factory.js'
import ProductRepository from '../repositories/product.repository.js'

export const ProductService = new ProductRepository(new Product())

export const getProductsService = async (req) => {
    const {
        limit = 10,
        page = 1,
        sort = '',
        category = '',
        stock: availability = '',
    } = req.query

    const filter = category ? { category } : {}
    if (availability) {
        filter.stock = parseInt(availability)
    }

    const sortOptions =
        sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOptions,
        lean: true,
    }

    const result = await ProductService.getAllPaginate(filter, options)

    const { totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result

    const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null
    const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null

    return {
        payload: result.docs,
        limit: result.limit,
        totalPages,
        prevPage,
        nextPage,
        currentPage: result.page, // Cambié nombre variable para evitar conflictos
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    }
}

