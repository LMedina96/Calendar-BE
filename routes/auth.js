/*
    Rutas e Usuarios / Auth
    host * /api/auth
*/

const { Router } = require('express')
const { createUser, userLogin, revalidateToken } = require('../controllers/auth')
const { check } = require('express-validator')
const { fieldValidates } = require('../middlewares/field-validators')
const { validateJWT } = require('../middlewares/validate-jwt')
const router = Router()

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe contener al menos 6 caracteres').isLength({ min: 6 }),
        fieldValidates
    ],
    createUser,
)

router.post(
    '/',
    [
        check('password', 'La contraseña debe contener al menos 6 caracteres').isLength({ min: 6 }),
        check('email', 'El email no puede estar vacio').isEmail(),
        fieldValidates
    ],
    userLogin
)

router.get('/renew', validateJWT , revalidateToken)

module.exports = router;