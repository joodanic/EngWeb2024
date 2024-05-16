var express = require('express');
var router = express.Router();
var Contrato = require('../controllers/contrato');

//get /contrato/entidades
router.get('/contratos/entidades', function(req, res, next) {
  Contrato.listEntidades()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

//get /contatos/tipos
router.get('/contratos/tipos', function(req, res, next) {
  Contrato.listTipos()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

//get /contratos
router.get('/contratos', function(req, res, next) {
  if(req.query.entidade){
    Contrato.findByEntidade(req.query.entidade)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
  }
  else if (req.query.tipo){
    Contrato.findByTipo(req.query.tipo)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
  }
  else{
    Contrato.list()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro));
  }
});

//get /contratos/:id
router.get('/contratos/:id', function(req, res, next) {
  Contrato.findById(req.params.id)
    .then(dados => {
      res.jsonp(dados)})
    .catch(erro => res.status(500).jsonp(erro));
});

// post /contratos
router.post('/contratos', function(req, res, next) {
  Contrato.insert(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

//delete /contratos/:id
router.delete('/contratos/:id', function(req, res, next) {
  Contrato.remove(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});

//put /contratos/:id
router.put('/contratos/:id', function(req, res, next) {
  Contrato.update(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro));
});


module.exports = router;
