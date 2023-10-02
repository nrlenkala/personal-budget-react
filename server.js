const express = require('express');
const fs = require('fs');
const cors = require('cors'); 
const app = express();
const port = 3000;

app.use(cors());

app.use('/', express.static('public'));


const budgetData = JSON.parse(fs.readFileSync('server.json', 'utf8'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    res.json(budgetData);
  });
  
  app.get('/budget-data', (req, res) => {
    res.json(budgetData);
  });

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});