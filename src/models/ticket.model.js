import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                _id: false,
                product: { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: Number,
            },
        ],
        default: [],
    }
})

ticketSchema.pre('findOne', function() {
    this.populate('products.product')
})

const ticketModel = mongoose.model('tickets', ticketSchema)

export default ticketModel