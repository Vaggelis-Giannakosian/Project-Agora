const path = require('path');
const app = require('express')();
require('dotenv').config()

const mockApiMiddleware = require('express-mock-api-middleware')(
    path.resolve(__dirname, 'mock'),
    { ignore: ['asm.js'] }
);

app.use('/', mockApiMiddleware);

app.listen(process.env.PORT,  error => {
    console.log(`Campaigns api listening on port ${process.env.PORT}`)
});

