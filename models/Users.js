const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');

const Users = mongoose.Schema({
    nom:{type:String , require :true},
    prenom:{type:String, require:true},
    email:{type:String , require :true,unique:true},
    password:{type:String , require :true},
})

    Users.plugin(uniqueValidator)

module.exports = mongoose.model('Users',Users)