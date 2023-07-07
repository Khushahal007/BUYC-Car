const mongoose = require("mongoose");



const inventoryModelSchema = mongoose.Schema({
    id: String,
    make: String,
    model: String,
    year: Number,
    kmOnOdometer: Number,
    majorScratches: Boolean,
    originalPaint: Boolean,
    accidentsReported: Number,
    previousBuyers: Number,
    registrationPlace: String
  
});

module.exports = mongoose.model("inventory", inventoryModelSchema);
