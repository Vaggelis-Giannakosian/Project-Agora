const path = require('path');
const app = require('express')();
const port = 4000;

const mockApiMiddleware = require('express-mock-api-middleware')(
    path.resolve(__dirname, 'mock'),
    { ignore: ['asm.js'] }
);

app.use('/', mockApiMiddleware);

app.listen(port,  error => {
    console.log(`Campaigns api listening on port ${port}`)
});

