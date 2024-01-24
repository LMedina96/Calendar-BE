/*
    Rutas e Usuarios / Events
    host * /api/events
*/

const { Router } = require('express')
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events")
const { validateJWT } = require('../middlewares/validate-jwt')
const { check } = require('express-validator')
const { fieldValidates } = require('../middlewares/field-validators')
const { isDate } = require('../controllers/helpers/isDate')
const router = Router()

router.use(validateJWT)

//getEvents
router.get('/', getEvents)

//createEvent
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de finalización es obligatoria').custom(isDate),
    fieldValidates
], createEvent)

//updateEvent
router.put('/:id', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de finalización es obligatoria').custom(isDate),
    fieldValidates
], updateEvent)

//deleteEvent
router.delete('/:id', deleteEvent)

module.exports = router