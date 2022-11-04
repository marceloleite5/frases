const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Frase = db.define('Frase', {
    title: {
        type: DataTypes.STRING, 
        allowNull: false,
        require: true,
    },
})

Frase.belongsTo(User)
User.hasMany(Frase)

module.exports = Frase