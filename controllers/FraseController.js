const Frase = require('../models/Frase')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class FraseController {
    static async showFrases(req, res) {
        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        }else {
            order = 'DESC'
        }

        const frasesData = await Frase.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%`},
            },
            order: [['createdAt', order]],
        })

          //exibindo dados da tabela frases
          const frases = frasesData.map((result) => result.get({ plain: true }))

          let frasesQty = frases.length

          if (frasesQty === 0) {
            frasesQty = false
          }

        res.render('frases/home', { frases, search, frasesQty })
    }

    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Frase,
            plain: true,
        })

        //checar se usuário existe
        if (!user) {
            res.redirect('/login')
        }

        //exibindo dados da tabela frases
        const frases = user.Frases.map((result) => result.dataValues)

        let emptyFrases = false

        if (frases.length === 0) {
            emptyFrases = true
        }
 
        //console.log(frases)

        res.render('frases/dashboard', { frases, emptyFrases })
    }

    static async createFrase(req, res){
        res.render('frases/create')
    }

    static async createFraseSave(req, res){

        const frase = {
            title: req.body.title,
            UserId: req.session.userid
        }

        req.flash('message', 'Frase criada com sucesso')

        await Frase.create(frase)

        try {
            req.session.save(() => {
                res.redirect('/frases/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um erro ao tentar salvar a frase' + error)
        }
    }

    static async removeFrase(req, res) {

        const id = req.body.id
        const UserId = req.session.userid

       try {
        await Frase.destroy({ where: { id: id, UserId: UserId }})

        req.flash('message', 'Frase removida com sucesso!')

        req.session.save(() => {
            res.redirect('/frases/dashboard')
        })

       } catch (error) {
        console.log('Aconteceu um erro ao tentar excluir a frase' + error)
       }
    }

    static async updateFrase(req, res) {
        const id = req.params.id

        const frase = await Frase.findOne({ where: { id: id }, raw: true })

        res.render('frases/edit', { frase })
    }

    static async updateFraseSave(req, res) {

        const id = req.body.id

        const frase = {
            title: req.body.title
        }

        try {
            await Frase.update(frase, {where: { id: id } })
        req.flash('message', 'Frase atualizada com sucesso!')

        req.session.save(() => {
            res.redirect('/frases/dashboard')
        })
        } catch (error) {
          console.log('Algo deu errado na atualização: ' + error)  
        }

    }
}