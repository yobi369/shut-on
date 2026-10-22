const express = require('express');
const path = require('path');
const app = require('./app');

app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Shuton Photography listening on port ' + port));
