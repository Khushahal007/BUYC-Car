const mongoose = require('mongoose')

const oemSchema= new mongoose.Schema({

    id: String,
    image:String,
    make: String,
    model: String,
    year: Number,
    listPrice: Number,
    colors: [String],
    mileage: Number,
    power: Number,
    maxSpeed: Number
      
})

module.exports=mongoose.model('oemSchema', oemSchema)