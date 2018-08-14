var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb').MongoClient,
    objectID = require('mongodb').ObjectId;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var dbName = 'instagram';
var mongoURL = 'mongodb://localhost:27017/' + dbName;

var connMongoDB = function (data) {
    mongodb.connect(mongoURL, { useNewUrlParser: true }, function (err, client) {
        var db = client.db(dbName);
        query(db, data);
        client.close();
    });
}

function query(db, data) {
    var collection = db.collection(data.collection);
    switch (data.operacao) {
        case 'atualizar':
            collection.update(data.where, data.set);
            break;
        case 'inserir':
            collection.insertOne(data.dados, data.callback);
            break;
        case 'pesquisar':
            collection.find(data.dados).toArray(data.callback);
            break;
        case 'remover':
            data.where._id = objectID(data.where._id);
            collection.remove(data.where, data.callback);
            break;
    }
}

console.log('Servidor HTTP escutando na porta ' + port);

app.get('/', function (req, res) {
    res.send({ msg: 'Olá' });
});
//POST (create)
app.post('/api', function (req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    var dados

    dados = req.body;
    res.send(dados)

    // var dados = {
    //     operacao: 'inserir',
    //     dados: data,
    //     collection: 'postagens',
    //     callback: function (err, records) {
    //         if (err) {
    //             res.json({ 'status': 0 });
    //         } else {
    //             res.json({ 'status': 1 });
    //         }
    //     }
    // }
    // connMongoDB(dados);
});

app.get('/api', function (req, res) {

    var dados = {
        operacao: 'pesquisar',
        // dados: data,
        collection: 'postagens',
        callback: function (err, records) {
            if (err) {
                res.json(err);
            } else {
                res.json(records)
            }
        }
    }
    connMongoDB(dados);
});

app.get('/api/:id', function (req, res) {

    var dados = {
        operacao: 'pesquisar',
        dados: (objectID(req.params.id)),
        collection: 'postagens',
        callback: function (err, records) {
            if (err) {
                res.json(err);
            } else {
                res.json(records)
            }
        }
    }
    connMongoDB(dados);
});


app.put('/api/:id', function (req, res) {
    var dados = {
        operacao: 'atualizar',
        where: { _id: objectID(req.params.id) },
        set: { $set: { titulo: req.body.titulo } },
        multi: {},
        collection: 'postagens',
        callback: function (err, records) {
            if (err) {
                res.json(err);
            } else {
                res.status(500).json(records);
            }
        }
    }
    connMongoDB(dados);
});

app.delete('/api/:id', function (req, res) {
    var dados = {
        operacao: 'remover',
        where: { _id: req.params.id },
        collection: 'postagens',
        callback: function (err, records) {
            if (err) {
                res.json(err);
            } else {
                res.json(records);
            }
        }
    }
    connMongoDB(dados);
});