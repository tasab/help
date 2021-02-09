const { Schema, model, Types} = require("mongoose")

const Message = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    text: { type: String},
    chat: {type: Schema.Types.ObjectId, ref: 'Chat'}
},
{
    timestamps: { type: Boolean, default: false}
}
)

module.exports = model('Message', Message);