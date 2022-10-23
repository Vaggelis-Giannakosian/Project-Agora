const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const {processBid} = require("./services/bidderService");

require('dotenv').config()

// Bid request is of type application/octet-stream
app.use(bodyParser.raw({type: 'application/octet-stream'}))

app.post('/api/bids', async (req, res) => {
    try{
        const {id, app, device} = JSON.parse(req.body)

        if (!id || !device || !app || !device.hasOwnProperty('geo')) throw new Error('You must provide bidId, deviceInfo and appInfo')

        const bidResponse = await processBid(id, device);
        return res.status(bidResponse ? 200 : 204).json(bidResponse)
    }catch (e) {
        return res.status(400).json({message: e.message})
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Bidder api listening on port ${process.env.PORT}`)
})

module.exports = app;
