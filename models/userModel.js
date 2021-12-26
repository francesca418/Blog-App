const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        // required: true
    },
    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/cis557/image/upload/v1639598269/maple_avatar_mmgm2l.png'
    },
    role: {type: String, default: 'user'},
    gender: {type: String, default: 'male'},
    mobile: {type: String, default: ''},
    address: {type: String, default: ''},
    //followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    //following: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    groups: [{type: mongoose.Types.ObjectId, ref: 'group'}]
}, {
    timestamps: true
})


module.exports = mongoose.model('user', userSchema)