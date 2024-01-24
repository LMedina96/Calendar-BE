const { response } = require('express')
const Event = require('../models/Event')

const getEvents = async (req, res = response) => {

    const events = await Event.find()
        .populate('user', 'name')

    res.status(200).json({
        ok: true,
        events
    })
}

const createEvent = async (req, res = response) => {

    const event = new Event(req.body)

    try {

        event.user = req.uid

        const eventSaved = await event.save()

        res.json({
            ok: true,
            event: eventSaved
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Hubo un problema al crear el evento"
        })
    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id
    const uid = req.uid

    try {

        const event = await Event.findById(eventId)

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'ID de evento inexistente'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene acceso para editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, { new: true })

        res.json({
            ok: true,
            event: eventUpdated
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el evento'
        })
    }
}

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id
    const uid = req.uid

    try {

        const event = await Event.findById(eventId)

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'ID de evento inexistente'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene para eliminar este evento'
            })
        }

        await Event.findByIdAndDelete(eventId)

        res.json({
            ok: true,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el evento'
        })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}