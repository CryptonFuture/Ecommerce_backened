const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    confirmPass: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        default: null 
    },

    address: {
        type: String,
        default: null 
    },

    role: {
        type: Number,
        enum: [0, 1], // user = 0, admin = 1
        default: 0
    },

    accessToken: {
        type: String,
        default: null
    },

    refreshToken: {
        type: String,
        default: null
    },

    resetToken: { 
        type: String, 
        default: null
    },

    resetTokenExpiry: { 
        type: Date,
         default: null 
    },

    image: {
        type: String,
        default: null
    },

    active: {
        type: Boolean,
        default: 0
    },

    is_admin: {
        type: Boolean,
        default: 0
    },

    is_login: {
        type: Boolean,
        default: 0
    },

    is_deleted: {
        type: Boolean,
        default: 0
    },

    created_by: {
        type: String,
        default: null
    },

    updated_by: {
        type: String,
        default: null
    },

    expiryAt: {
        type: Date
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', authSchema)

