# Teste

## Aluno

Nome: João Carvalho

Numero: A94015

## Setup mongodb

Para fazer o setup da base de dados Mongo, tivemos de fazer um mongoimport do ficheiro que nos foi fornecido, mas antes disso tivemos de efetuar o tratamento deste ficheiro que se encontrava num formato CSV. Para isto, fizemos uma conversão deste ficheiro para JSON usando um script de Python. De seguida, modificámos o campo "id" do ficheiro para "_id" para estar em conformidade com o Mongo e, de seguida, fizemos os seguintes comandos para importar o dataset. Estes comandos foram feitos com o Mongo já a correr:

1. **Comando para importar os dados no Mongodb**
    ```shell
    docker cp contratos2024.json mongoEW:/tmp
    docker exec -it mongoEW bash
    mongoimport -d contratos -c contratos /tmp/contratos2024.json --jsonArray

## Persistencia dos dados

A persistencia dos dados sera feita atraves da utilizacao do mongodb como foi referido acima para guardar os nossos dados. Sendo assim sempre que desligarmos a aplicacao nao iremos perder as alteracoes feitas aos dados.

## Exercicio 1

1. **Quantos registos estão na base de dados:**
   ```shell
   db.contratos.count()
2. **Quantos registos de contratos têm o tipo de procedimento com valor "Ajuste Direto Regime Geral":**
    ```shell
    db.contratos.countDocuments({ tipoprocedimento: "Ajuste Direto Regime Geral" })

3. **Qual a lista de entidades comunicantes (ordenada alfabeticamente e sem repetições):**
    ```shell
    db.contratos.distinct("entidade_comunicante").sort()

4. **Qual a distribuição de contratos por tipo de procedimento (quantos contratos tem cada tipo de procedimento):**
    ```shell
    db.contratos.aggregate([{ $group: { _id: "$tipoprocedimento", count: { $sum: 1 } } },{ $sort: { _id: 1 } }])

5. **Qual o montante global por entidade comunicante (somatório dos contratos associados a uma entidade):**
    ```shell
    db.contratos.aggregate([{
        $addFields: {
            precoContratualStr: {
                $replaceAll: {
                    input: "$precoContratual",
                    find: ",",
                    replacement: "."
                }
            }
        }
    },
    {
        $addFields: {
            precoContratualNum: {
                $convert: {
                    input: "$precoContratualStr",
                    to: "double",
                    onError: 0,
                    onNull: 0
                }
            }
        }
    },
    {
        $group: {
            _id: "$entidade_comunicante",
            totalAmount: { $sum: "$precoContratualNum" }
        }
    },
    {
        $sort: { _id: 1 }
    }])


## Como correr o programa

1. **api:**
    ```shell
    cd ex1
    cd api
    npm i
    npm start

2. **interface:**
    ```shell
    cd ex2
    cd interface
    npm i
    npm start
