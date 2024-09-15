const mongoose = require('mongoose');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
    uuid:{type:String, require:true, default:uuid.v4},
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    is_verified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
