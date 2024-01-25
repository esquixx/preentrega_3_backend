import appRouter from './routes/router.js'
import ProductsRouter from './routes/products.router.js'
import CartsRouter from './routes/carts.router.js'
import ViewsProductsRouter from './routes/views.router.js'
import JWTRouter from './routes/jwt.router.js'
import messageModel from './models/message.model.js'
import { passportCall } from './utils.js'

const handleProductList = (io) => (data) => {
    io.emit('updatedProducts', data)
}

const handleCartList = (io) => (data) => {
    io.emit('updatedCarts', data)
}

const handleMessages = async (socket) => {
    const messages = (await messageModel.find()) || []

    socket.broadcast.emit('alerta')
    socket.emit('logs', messages)

    socket.on('message', (data) => {
        messages.push(data)
        messageModel.create(messages)
        io.emit('logs', messages)
    })
}

const setupSocketIO = (io) => {
    io.on('connection', async (socket) => {
        socket.on('productList', handleProductList(io))
        socket.on('cartList', handleCartList(io))

        await handleMessages(socket)
    })
}

const setupRoutes = (app) => {
    const productsRouter = new ProductsRouter()
    app.use('/api/products', productsRouter.getRouter())

    const cartsRouter = new CartsRouter()
    app.use('/api/carts', passportCall('jwt'), cartsRouter.getRouter())

    const jwtRouter = new JWTRouter()
    app.use('/api/jwt', jwtRouter.getRouter())

    const viewsProductsRouter = new ViewsProductsRouter()
    app.use('/products', passportCall('jwt'), viewsProductsRouter.getRouter())

    class Router extends appRouter {
        init() {
            this.get('/', ['PUBLIC'], (req, res) => {
                res.render('index', { name: 'Coderhouse' })
            })
        }
    }

    const indexRouter = new Router()
    app.use('/', indexRouter.getRouter())
}

const run = (io, app) => {
    // Middleware para agregar el objeto io a cada solicitud
    app.use((req, res, next) => {
        req.io = io
        next()
    })

    // Configuración de Socket.IO
    setupSocketIO(io)

    // Configuración de rutas
    setupRoutes(app)
}

export default run

