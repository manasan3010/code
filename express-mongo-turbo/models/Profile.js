const mongoose = require('mongoose')

const Profile = new mongoose.Schema({
    firstName: {type:String,uppercase:true, trim:true, default:null},
    lastName: {type:String,uppercase:true, trim:true, default:null},
    age: {type:Number, max:1000, default:0},
    team: {type:String, trim:true, default:null},
    position: {type:String, trim:true, default:null},

})

module.exports = mongoose.model('Profile', Profile)