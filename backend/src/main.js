const cors = require('cors');
const { Database } = require('./database');
const { EndpointCore } = require('./endpoints');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.json({ error: '[ParsingError] '+err.message }).status(400); // Bad request
    }
    next();
});

let db = new Database();


(async () => {
    await db.connect();
    await db.loadModels();

    let endpoints = new EndpointCore({app});
    await endpoints.loadEndpoints();

    // fallback route
    app.get('*', function(req, res){
        res.json({
            error: 'Not found'
        }).status(404);
    });

    app.listen(port, host, () =>
        console.log(`Server listens http://${host}:${port}`)
    )
})();