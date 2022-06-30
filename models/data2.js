var mongoose = require('mongoose')
var data2Schema = mongoose.Schema({
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

module.exports = mongoose.model('data2',data2Schema)