const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const {processBid} = require("./services/bidderService");

require('dotenv').config()

// Bid request is of type application/octet-stream
app.use(bodyParser.raw({type: 'application/octet-stream'}))

app.post('/', async (req, res) => {
    const {id, device} = JSON.parse(req.body)
    const bidResponse = await processBid(id, device);

    return res.status(bidResponse ? 200 : 204).json(bidResponse)
})

app.listen(process.env.PORT, () => {
    console.log(`Bidder api listening on port ${process.env.PORT}`)
})
