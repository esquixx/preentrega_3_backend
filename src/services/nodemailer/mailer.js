import moment from 'moment'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import { NODEMAILER_PASS, NODEMAILER_USER } from '../../config/config.js'

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: NODEMAILER_USER,
            pass: NODEMAILER_PASS
        }
    })
}

const generateEmailContent = (ticket) => {
    const productsData = ticket.products.map(prod => ({
        item: prod.product.title,
        quantity: prod.quantity,
        price: `$ ${prod.product.price}`
    }))

    return {
        body: {
            name: ticket.purchaser,
            intro: 'Your order has been processed successfully',
            dictionary: {
                date: moment(ticket.purchase_datetime).format('DD/MM/YYYY HH:mm:ss')
            },
            table: {
                data: productsData,
                columns: {
                    customWidth: {
                        item: '70%',
                        price: '30%'
                    },
                    customAlignment: {
                        item: 'left',
                        price: 'right'
                    }
                }
            },
            outro: `Total: $ ${ticket.amount}`,
            signature: false,
        }
    }
}

export const sendEmail = async (userEmail, ticket) => {
    const transporter = createTransporter();

    const Mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Ecommerce',
            link: 'http://localhost:8080',
        }
    })

    const mail = Mailgenerator.generate(generateEmailContent(ticket))

    const message = {
        from: NODEMAILER_USER,
        to: userEmail,
        subject: 'Thanks for your purchase',
        html: mail
    }

    try {
        const email = await transporter.sendMail(message)
        return email
    } catch (error) {
        console.error(error)
        return Promise.reject(error)
    }
}




/* export const sendEmail = async (userEmail, ticket) => {
    let config = {
        service: 'gmail',
        auth: {
            user: NODEMAILER_USER,
            pass: NODEMAILER_PASS
        }
    }

    let transporter = nodemailer.createTransport(config)

    let Mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Ecommerce',
            link: 'http://localhost:8080',
        }
    })

    let productsData = ticket.products.map(prod => ({
        item: prod.product.title,
        quantity: prod.quantity,
        price: `$ ${prod.product.price}`
    }))

    let content = {
        body: {
            name: ticket.purchaser,
            intro: 'Your order has been processed successfully',
            dictionary: {
                date: moment(ticket.purchase_datetime).format('DD/MM/YYYY HH:mm:ss')
            },
            table: {
                data: productsData,
                columns: {
                    customWidth: {
                        item: '70%',
                        price: '30%'
                    },
                    customAlignment: {
                        item: 'left',
                        price: 'right'
                    }
                }
            },
            outro: `Total: $ ${ticket.amount}`,
            signature: false,
        }
    }

    let mail = Mailgenerator.generate(content)

    let message= {
        from: NODEMAILER_USER,
        to: userEmail,
        subject: 'Thanks for your purchase',
        html: mail
    }

    try {
        const email = await transporter.sendMail(message)
        return email
    } catch (error) {
        console.log(error)
        throw error
    }
} */