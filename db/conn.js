const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('frases', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Conectamos ao banco com sucesso! - Aula 189')
} catch (err) {
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize