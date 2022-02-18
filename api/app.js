const express = require('express')
const app = express()
const port = 3000
const db = require('../database/db')

app.get('/', (req, res) => {
  
  var sql= "SELECT * FROM 'records'"

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