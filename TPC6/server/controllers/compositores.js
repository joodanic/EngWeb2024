const mongoose = require('mongoose')
const { modelName } = require("../models/compositores")
var Compositores = require("../models/compositores")
const compositores = require('../models/compositores')

module.exports.list = () => {
    return Compositores
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Compositores
        .findOne({_id : id})
        .exec()
}

module.exports.insert = compositores => {compositores
    if((Compositores.find({_id : compositores._id}).exec()).length != 1){
        var newCompositor = new Compositores(compositores)
        return newCompositor.save()
    }
}

module.exports.update = (id, compositores) => {
    return Compositores
        .findByIdAndUpdate(id, compositores, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Compositores
        .findByIdAndDelete(id)
        .exec()
}