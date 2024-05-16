var mongoose = require("mongoose");


var contratoSchema = new mongoose.Schema({
        _id : String,
        "nAnuncio": String,
        "tipoprocedimento": String,
        "objectoContrato": String,
        "dataPublicacao": Date,
        "dataCelebracaoContrato" : Date,
        "precoContratual": Number,
        "prazoExecucao": Number,
        "NIPC_entidade_comunicante": String,
        "entidade_comunicante": String,
        "fundamentacao": String
});

module.exports = mongoose.model('contrato', contratoSchema);
