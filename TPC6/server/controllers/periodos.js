const mongoose = require('mongoose')
const { modelName } = require("../models/periodos")
var Periodos = require("../models/periodos")
const periodos = require('../models/periodos')

module.exports.list = () => {
    return Periodos
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Periodos
        .findOne({_id : id})
        .exec()
}

module.exports.insert = periodos => {periodos
    if((Periodos.find({_id : periodos._id}).exec()).length != 1){
        var newPeriodo = new Periodos(periodos)
        return newPeriodo.save()
    }
}

module.exports.update = (id, periodos) => {
    return Periodos
        .findByIdAndUpdate(id, periodos, {new : true})
        .exec()
}

module.exports.remove = id => {
    return Periodos
        .findByIdAndDelete(id)
        .exec()
}