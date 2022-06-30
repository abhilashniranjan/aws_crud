var mongoose = require('mongoose')
var dataSchema = mongoose.Schema({
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
    },
    f:{
        type:String
    },
    g:{
        type:String
    },
    h:{
        type:String
    },
    i:{
        type:String
    }
})

module.exports = mongoose.model('data',dataSchema)