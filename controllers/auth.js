const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('./helpers/jwt')

const createUser = async (req, res = response) => {

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        user = new User(req.body)

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt)

        await user.save();

        const token = await generateJWT(user.id, user.name)

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Si el problema persiste contactese con el administrador'
        })
    }

}

const userLogin = async (req, res = response) => {

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email'
            })
        }

        const validPassword = bcrypt.compareSync(password, user.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(user.id, user.name)

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Si el problema persiste contactese con el administrador'
        })
    }
}

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req

    const token = await generateJWT(uid, name)

    res.json({
        ok: true,
        uid, name,
        token
    })
}

module.exports = {
    createUser,
    userLogin,
    revalidateToken,
}