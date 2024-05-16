var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16);

  axios.get('http://localhost:16000/contratos')
    .then(dados => {
      res.render('contratos',{contratos: dados.data, d : date});
    })
    .catch(erro => {
      res.render('error', {error: erro})
    }); 
});

router.get('/:id', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16);

  axios.get('http://localhost:16000/contratos/' + req.params.id)
    .then(dados => {
      res.render('contrato',{contrato: dados.data, d : date});
    })
    .catch(erro => {
      res.render('error', {error: erro})
    });
});

router.get('/entidades/:id', function(req, res) {
  var data = new Date().toISOString().substring(0, 16);

  axios.get('http://localhost:16000/contratos?entidade=' + req.params.id)
    .then(dados => {
      var entidade = dados.data[0]["entidade_comunicante"];
      res.render('entidade', {nipc:req.params.id,entidade: entidade, contratos: dados.data, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro});
    });
});

module.exports = router;
