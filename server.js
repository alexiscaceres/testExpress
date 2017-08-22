// incluir paquetes necesarios
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var Registro = require('./src/model/pila');


// configurar app para obtener los datos de peticiones POST
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// conexion a la BD
mongoose.connect('mongodb://root:root@ds151163.mlab.com:51163/test_tads');

// rutas para la API
var router = express.Router();

router.use(function (req, res, next) {
    console.log('Procesando...');
    next();
})

router.get('/', function (req, res) {
    res.json({ message: 'welcome to API'});
})


router.route('/registros')
    // crear registros
    .post(function (req, res) {

        var registro = new Registro();
        console.log(req.body)
        registro.posicion = req.body.posicion;
        registro.nombre = req.body.nombre;

        registro.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'registro ' + registro.nombre + ' creado!' });
        } );

    })

    //obtener lista de registros
    .get(function (req, res){

        Registro.find( function (err, registros) {
            if (err)
                res.send(err);
            res.json(registros);
        });

    })


router.route('/registros/:registro_id')
    // obtener registro correspondiente a ID
    .get(function (req, res) {
        Registro.findById(req.params.registro_id, function (err, registro) {
            if (err)
                res.send(err);
            res.json(registro);
        });
    })

    // modificar un registro
    .put(function (req, res) {
        Registro.findById(req.params.registro_id, function (err, registro) {
            if (err)
                res.send(err);

            registro.nombre = req.body.nombre;
            registro.posicion = req.body.posicion;

            registro.save(function (err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Registro ' + registro.nombre + ' Actualizado'});
            })
        });
    })

    .delete(function (req, res) {
        Registro.remove({
            _id: req.params.registro_id
        }, function (err, registro) {
                if (err)
                    res.send(err);
                res.json({ message: 'Registro ' + req.params.registro_id + ' Eliminado' });
        });
    })

// registrar rutasas
app.use('/api', router);

app.listen(port);
console.log('Ejecutando servidor en puerto' + port);