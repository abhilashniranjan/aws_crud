var mongoose = require('mongoose')
var data1Schema = mongoose.Schema({
    a:{
        type:String
    },
    b:{
        type:String
    },
    c:{
        type:String
    },
    d:{
        type:String
    }
})

module.exports = mongoose.model('data1',data1Schema)