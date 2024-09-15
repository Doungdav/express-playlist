const { text } = require('express');
const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({

    role_name:{type:String, require:true, unique:true},
    description:{type:String}

});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;