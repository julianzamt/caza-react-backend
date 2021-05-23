const obraModel = require('../models/obraModel')

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const obras = await obraModel.find()
            res.json(obras)
        } catch (e) {
            e.status = 400
            console.log("culo")
            next(e) // Generic error Handler in app.js
        }
    },
    create: async function (req, res, next) {
        try {
            const document = new obraModel({
                name: req.body.name,
                year: req.body.date,
                mainImage: req.body.mainImage,
                text: req.body.text,
                hidden: req.body.hidden
            })
            const newObra = await document.save()
            res.json(newObra)
        } catch (e) {
            e.status = 400
            next(e)
        }
    },
    getById: async function (req, res, next) {
        try {
            const obra = await obraModel.findById(req.params.id)
            res.json(obra)
        } catch (e) {
            e.status = 400
            next(e)
        }
    }
}