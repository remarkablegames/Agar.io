const express = require('express');
const { resolve } = require('path');

const app = express();
app.use(express.static(resolve(__dirname, '../../public')));
app.use(express.static(resolve(__dirname, '../../build/client')));

module.exports = app;
