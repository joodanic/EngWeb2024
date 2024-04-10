var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa');

router.get('/', function (req, res, next) {
	var modalidades = [];
	Pessoa.list()
		.then(data => {
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < data[i].desportos.length; j++) {
                    let modalidade = data[i].desportos[j];
                    if (modalidades.indexOf(modalidade) == -1) modalidades.push(modalidade);
                }
			}
			res.jsonp(modalidades.sort());
		})
		.catch(erro => res.jsonp(erro));
});

router.get('/:modalidade', function (req, res, next) {
	var pessoas = [];
	Pessoa.list()
		.then(data => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].desportos.indexOf(req.params.modalidade) != -1) pessoas.push(data[i]);
			}
			res.jsonp(pessoas.sort());
		})
		.catch(erro => res.jsonp(erro));
});

module.exports = router;