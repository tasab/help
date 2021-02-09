const { Schema, model, Types} = require("mongoose")

const Chat = new Schema({
    name: { type: String, required: true},
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
},
{
    timestamps: { type: Boolean, default: false}
}
)

module.exports = model('Chat', Chat);