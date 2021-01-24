const express = require('express');
const app = express();
const { json, urlencoded } = require('body-parser');

// BodyParser Middleware
app.use(urlencoded({ extended: false, limit: '10mb' }));
app.use(json({ limit: '10mb' }));

// connecting static files in public folder
app.use(express.static(path.join(__dirname + '/')));

module.exports = {
    app
}