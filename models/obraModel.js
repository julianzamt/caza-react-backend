const mongoose = require('../bin/mongodb');
const errorMessages = require('../utils/errorMessages')

const obraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, errorMessages.GENERAL.required],
        maxlength: [30, errorMessages.GENERAL.maxlength]
    },
    year: Date,
    mainImage: {
        type: String,
        required: [true, errorMessages.GENERAL.required],
        maxlength: [280, errorMessages.GENERAL.maxlength280]
    },
    text: {
        type: String,
        required: [true, errorMessages.GENERAL.required],
        maxlength: [280, errorMessages.GENERAL.maxlength280]
    },
    hidden: Boolean
})

module.exports = mongoose.model('Obra', obraSchema)


