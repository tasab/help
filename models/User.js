const { Schema, model, Types} = require("mongoose")

const user = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, requred: true},
    fullName: {type: String, requred: true},
    avatar: { type: String, required: false},
    confirmed: { type: String, required: false},
    confirm_hash: { type: String, required: false},
    last_seen: { type: Date, required: false},
    chat: [{ type: Schema.Types.ObjectId, ref: 'Chat', require: false}],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', require: false }]
},
{
    timestamps: { type: Boolean, default: false}
}
)

module.exports = model('User', user);