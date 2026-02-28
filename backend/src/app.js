const express = require('express')
const cors = require('cors')
const controller = require('./controller/controller')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/check', controller.checkUserInput)
app.use('/api/scores', controller.getLeaderboard)
app.use('/api/new/scores', controller.addToLeaderboard)

app.get('/', (_req, res)=> {
    res.send("API Running")
})

app.use((err, _req, res) => {
    res.status(500).send(`Server error: ${err}`)
})

module.exports = app