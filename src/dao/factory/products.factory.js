import { opts } from '../../config/commander.js';
import ProductDAO from '../products.mongo.dao.js';

export let Product = ProductDAO

switch (opts.persistence) {
    case "MONGO":
        const { default: ProductDAO } = await import(
        "../products.mongo.dao.js"
        )
        Product = ProductDAO
        break
        
    default:
        break
}


/* import { PERSISTENCE } from '../../config/config.js'

export let Product

switch (PERSISTENCE) {
    case "MONGO":
        const { default: ProductDAO } = await import(
        "../products.mongo.dao.js"
        )
        Product = ProductDAO
        break
        
    default:
        break
} */


