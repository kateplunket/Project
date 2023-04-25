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

const HTTP_PORT = 8000;

class Session {
    constructor(sessionID,startDate,userID){
        this.SessionID = sessionID,
        this.StartDate =startDate,
        this.UserID = userID
    }
}

var app = express();
app.use(cors());
app.use(exress.json());
app.use(bodyparser.urlencoded({
    extended: true
}))


