const express = require('express')
const bodyParser = require('body-parser')
const port = 3000
const db = require('../database/db')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));


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

app.get('/es2', (req, res) => {
  
  var sql= "SELECT W.id,W.name,avg(capital_gain) as capitale_medio FROM records R join workclasses W on W.id= R.occupation_id group by W.name"

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

app.get('/es3/:offset/:count', (req, res) => {
  
  var sql= "SELECT R.*,EL.name as education_level,MS.name as marital_status ,O.name as occupation,RA.name as race,S.name as sex,C.name as country "+
            "FROM records R join workclasses W on W.id = R.occupation_id "+
            "join education_levels EL on EL.id = R.education_level_id "+
            "join marital_statuses MS on MS.id = R.marital_status_id "+
            "join occupations O on O.id = R.occupation_id "+
            "join races RA on RA.id = R.race_id "+
            "join sexes S on S.id = R.sex_id "+
            "join countries C on C.id = R.country_id "+
            "order by R.id LIMIT ?,?"
            
  var parametri = [req.params.offset,req.params.count]
  db.all(sql, parametri, (err, rows) => {
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


app.post('/es4', (req, res) => {
  var aggregationType = req.body.aggregationType;
  var aggregationValue = req.body.aggregationValue;

  if (aggregationType === undefined || aggregationValue === undefined) {
      res.status(400).json({"error":"Per favore inserisci i campi richiesti."});
      return;
  }

  if (aggregationType !== "age" && aggregationType !== "education_level_id" && aggregationType !== "occupation_id"){
      res.status(400).json({"error":"Il campo "+ aggregationType +" non è supportato"});
      return;
  }
  
  var sql = "SELECT sum(capital_gain) as capital_gain_sum, avg(capital_gain) as capital_gain_avg, sum(capital_loss) as capital_loss_sum, avg(capital_loss) as capital_loss_avg,"+
          "count ((CASE WHEN over_50k = 1 THEN id END )) as over_50k_count, "+
          "count((CASE WHEN over_50k = 0 THEN id  END )) as under_50k_count "+
          "from records where "+aggregationType+" = ?"

            

  db.all(sql, [aggregationValue], (err, rows) => {
    if (err) {
      //In caso di errore torna il messaggio di debug di Sqlite
      res.status(400).json({"error":err.message});ß
      return;
    }
    //Parsing json
    res.json({
        "aggregationType" : aggregationType,
        "aggregationValue" : aggregationValue,
        "capital_gain_sum" : rows[0].capital_gain_sum,
        "capital_gain_avg" : rows[0].capital_gain_avg,
        "capital_loss_sum" : rows[0].capital_loss_sum,
        "capital_loss_avg" : rows[0].capital_loss_avg,
        "over_50k_count" : rows[0].over_50k_count,
        "under_50k_count" : rows[0].under_50k_count,
     
    })
  });
})


app.listen(port, () => {
  console.log(`Porta di ascolto ${port}`)
})