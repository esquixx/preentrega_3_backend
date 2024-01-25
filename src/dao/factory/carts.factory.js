import { opts } from '../../config/commander.js';
import CartDAO from '../carts.mongo.dao.js';

export let Cart = CartDAO

switch (opts.persistence) {
    case "MONGO":
        const { default: CartDAO } = await import(
        "../carts.mongo.dao.js"
        )
        Cart = CartDAO
        break
        
    default:
        break
}

/* import { PERSISTENCE } from '../../config/config.js'

export let Cart

switch (PERSISTENCE) {
    case "MONGO":
        const { default: CartDAO } = await import("../carts.mongo.dao.js")
        Cart = CartDAO
        break

    default:
        break
} */