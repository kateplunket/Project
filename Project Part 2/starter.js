const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-Parser');
const crypto = require('crypto');
const pool = mysql.createpool({
    host:'localhost',
    user:'root',
    password:'Mickey2023!',
    database:'swollenfarm'
})

class Session {
    constructor
}

const HTTP_PORT = 8000;

var app = express();
app.use(cors());
app.use(exress.json());

app.listen(HTTP_PORT, () => {
    console.log('Our server is listening on port ' + HTTP_PORT);
})