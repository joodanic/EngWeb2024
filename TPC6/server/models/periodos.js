var mongoose = require("mongoose")

var periodosSchema = new mongoose.Schema({
    _id : String,
    nome : String,
}, { versionKey: false })

module.exports = mongoose.model('periodos', periodosSchema, 'periodos')