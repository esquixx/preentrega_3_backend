import messageModel from '../models/message.model.js'

export default class ChatDAO {
    getMessages = async () => await messageModel.find().lean().exec()
}