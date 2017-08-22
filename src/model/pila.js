var mongoose = require('mongoose');
var schema = mongoose.Schema;

var registroSchema = new schema({
    posicion: String,
    nombre: String,
});

module.exports = mongoose.model('registro', registroSchema);