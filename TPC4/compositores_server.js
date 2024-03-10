// alunos_server.js
// EW2024 : 04/03/2024
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var alunosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if((req.url == '/') || (req.url == '/compositores')){
                    axios.get('http://localhost:3000/compositores?_sort=nome')
                        .then(resp => {
                            var compositores = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.compositoresListPage(compositores, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Nao foi possivel obter lista de alunos</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })

                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/C[0-9]+$/i.test(req.url)){
                    var idCompositor = req.url.split("/")[2]

                    axios.get('http://localhost:3000/compositores/'+ idCompositor)
                        .then(resp => {
                            var compositor = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.compositorPage(compositor, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(504, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Nao foi possivel obter o registo do compositor</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                
                }
                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == '/compositores/registo'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.compositorFormPage(d))
                    res.end()
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]+$/.test(req.url)){
                    var idCompositor = req.url.split("/")[3];
                        axios.get('http://localhost:3000/compositores/' + idCompositor)
                            .then(resp => {
                                var compositor = resp.data;
                                res.writeHead(200, {'Content-Type': "text/html"});
                                res.write(templates.compositoresFormEditPage(compositor, d));
                                res.end();
                            })
                            .catch( erro => {
                                res.writeHead(521, {'Content-Type': "text/html"});
                                res.write(templates.errorPage(erro, d));
                                res.end();
                            });
                }
                //GET /compositores?periodo={periodo} --------------------------------------------------------------------
                else if(/\/compositores\?periodo=[A-Z]+$/i.test(req.url)){
                    var periodo = req.url.split("=")[1]
                    axios.get('http://localhost:3000/compositores?periodo=' + periodo)
                        .then(resp => {
                            var compositores = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.compositoresListPage(compositores, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Nao foi possivel obter lista de alunos</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                }
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/C[0-9]+$/i.test(req.url)){
                    var idCompositor = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/compositores/' + idCompositor)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.write(`<pre> ${JSON.stringify(resp.data)}<pre>`)
                        res.end()
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.write(templates.errorPage(erro, d))
                        res.end()
                    })

                }
                // GET /periodos --------------------------------------------------------------------
                else if(req.url == '/periodos'){
                    axios.get('http://localhost:3000/periodos')
                    .then(resp => {
                        var periodos = resp.data
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.write(templates.periodosListPage(periodos, d))
                        res.end()
                    })
                    .catch( erro => {
                        res.writeHead(520, {'Content-Type': "text/html"})
                        res.write(templates.errorPage(erro, d))
                        res.end()
                    })
                }
                // GET /periodos/:id --------------------------------------------------------------------
                else if(/\/periodos\/[0-9]+$/i.test(req.url)){
                    var periodo = req.url.split("/")[2]
                    axios.get('http://localhost:3000/periodos/' + periodo)
                    .then(resp => {
                        var periodo = resp.data
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.write(templates.periodoPage(periodo, d))
                        res.end()
                    })
                    .catch( erro => {
                        res.writeHead(520, {'Content-Type': "text/html"})
                        res.write(templates.errorPage(erro, d))
                        res.end()
                    })
                }
                // GET /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/registo'){
                    res.writeHead(200, {'Content-Type': "text/html"})
                    res.write(templates.periodoFormPage(d))
                    res.end()
                }
                // GET /periodos/edit/id --------------------------------------------------------------------
                else if (/\/periodos\/edit\/[0-9]+/.test(req.url)){
                    var idPeriodo = req.url.split("/")[3]
                    axios.get('http://localhost:3000/periodos/' + idPeriodo)
                    .then(resp => {
                        var periodo = resp.data
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.write(templates.periodosFormEditPage(periodo,d))
                        res.end()
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.write(templates.errorPage(erro, d))
                        res.end()
                    })
                }
                // GET /periodos/delete/:id --------------------------------------------------------------------
                else if(/\/periodos\/delete\/[0-9]+$/i.test(req.url)){
                    var idPeriodo = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/periodos/' + idPeriodo)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.write(`<pre> ${JSON.stringify(resp.data)}<pre>`)
                        res.end()
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.write(templates.errorPage(erro, d))
                        res.end()
                    })
                }
                // GET ? -> Lancar um erro
                else{
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write('<p> Metodo GET nao suportado: ' + req.url+ '</p>')
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if(req.url == '/compositores/registo'){
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.post('http://localhost:3000/compositores', result)
                                .then(resp => {
                                    console.log(resp.data)
                                    res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.end('<p>Registo inserido' + JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro => {
                                    res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write('<p> Erro: Nao foi possivel inserir o registo</p>')
                                    res.write('<p>' + erro + '</p>')
                                    res.end()
                                })
                        }
                        else{
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Erro: Nao foi possivel obter dados do body</p>')
                            res.end()
                        }
                    })
                }
                // POST /alunos/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.put('http://localhost:3000/compositores/'+ result.id, result)
                                .then(resp => {
                                    console.log(resp.data)
                                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.end('<p>Registo inserido' + JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro => {
                                    res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write('<p> Erro: Nao foi possivel atualizar o registo</p>')
                                    res.write('<p>' + erro + '</p>')
                                    res.end()
                                })
                        }
                        else{
                            res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Erro: Nao foi possivel obter dados do body</p>')
                            res.end()
                        }
                    })
                }

                // POST /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/registo'){
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.post('http://localhost:3000/periodos', result)
                                .then(resp => {
                                    console.log(resp.data)
                                    res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.end('<p>Registo inserido' + JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro => {
                                    res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write('<p> Erro: Nao foi possivel inserir o registo</p>')
                                    res.write('<p>' + erro + '</p>')
                                    res.end()
                                })
                        }
                        else{
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Erro: Nao foi possivel obter dados do body</p>')
                            res.end()
                        }
                    })
                }

                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.put('http://localhost:3000/periodos/'+ result.id, result)
                                .then(resp => {
                                    console.log(resp.data)
                                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.end('<p>Registo inserido' + JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro => {
                                    res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                                    res.write('<p> Erro: Nao foi possivel atualizar o registo</p>')
                                    res.write('<p>' + erro + '</p>')
                                    res.end()
                                })
                        }
                        else{
                            res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p> Erro: Nao foi possivel obter dados do body</p>')
                            res.end()
                        }
                    })
                }
                // POST ? -> Lancar um erro
                else{
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write('<p> Metodo POST nao suportado: ' + req.url+ '</p>')
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break;
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write('<p> Metodo nao suportado: ' + req.method+ '</p>')
                res.end()
                break;
        }
    }
})

alunosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



