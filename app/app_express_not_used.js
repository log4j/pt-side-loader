module.exports = () => {

    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var cors = require('cors');
    app.use(cors({
        origin: true,
        credentials: true
    }));
    //set all Post data into req.body
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
        res.send('Hello World!')
    });

    return app;
}