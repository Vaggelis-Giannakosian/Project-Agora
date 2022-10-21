const path = require('path');
const app = require('express')();

const mockApiMiddleware = require('express-mock-api-middleware')(
    path.resolve(__dirname, 'mock'),
    { ignore: ['asm.js'] }
);

app.use('/', mockApiMiddleware);

const host = 'localhost';
const port = 4000;

app.listen(port, host, error => {
    if (error) {
        console.error(error);
        return;
    }
    console.info(`http://${host}:${port}`);
});

