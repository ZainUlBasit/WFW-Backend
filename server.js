require("dotenv").config();
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const Router = require('./web/routes');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

global.rootDirectory = path.resolve(__dirname);

const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOption));

app.use(cookieParser());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.mongooseUrl, {
    useUnifiedTopology: true
}).then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
})

app.use('/api', Router);
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})