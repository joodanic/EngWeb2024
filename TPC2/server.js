var http = require('http')
var axios = require('axios')

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    if(req.url === '/'){
        axios.get('http://localhost:3000/alunos?_sort=nome')
            .then((response) => {

                var cabecalho = `
                <!DOCTYPE html>
                <html lang="pt-PT">
                <head>
                    <title>Alunos</title>
                    <meta charset="utf-8">
                </head>
                <body>
                `
                
                res.write(cabecalho)
                res.write('<h1>Alunos</h1>')
                res.write('<ul>')
                response.data.forEach((aluno) => {
                    res.write(`<li><a href="/alunos/${aluno.id}">${aluno.nome}</a></li>`);
                })
                res.write('</ul>')
                res.end()
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }
    else if(req.url.startsWith('/alunos/')){
        var id = req.url.split('/')[2]
        axios.get(`http://localhost:3000/alunos/${id}`)
            .then((response) => {

                var cabecalho = `
                <!DOCTYPE html>
                <html lang="pt-PT">
                <head>
                    <title>${response.data.nome}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                `
                
                res.write(cabecalho)
                res.write(`<h1>Nome: ${response.data.nome}</h1>`)
                res.write(`<p>Data Nascimento: ${response.data.dataNasc}</p>`)
                res.write(`<p>Curso: ${response.data.curso}</p>`)
                res.write(`<p>AnoCurso: ${response.data.anoCurso}</p>`)
                res.write(`<p>Instrumento: ${response.data.instrumento}</p>`)
                res.write(`<a href="/">Voltar</a>`)
                res.end()
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }
}).listen(7000)