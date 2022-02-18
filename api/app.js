const express = require('express')
const app = express()
const port = 3000
const db = require('../database/db')



app.get('/es1', (req, res) => {
  
  var sql= "SELECT count(*) FROM records where age < 30 and over_50k = 1"

  db.all(sql, [], (err, rows) => {
    if (err) {
      //In caso di errore torna il messaggio di debug di Sqlite
      res.status(400).json({"error":err.message});
      return;
    }
    //Parsing json
    res.json({
        "records":rows
    })
  });
})



app.listen(port, () => {
  console.log(`Porta di ascolto ${port}`)
})