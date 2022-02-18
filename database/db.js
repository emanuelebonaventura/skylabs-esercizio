const sqlite3 = require('sqlite3');


let db = new sqlite3.Database('./database/exercise01.sqlite',(err) =>{
    if (err){
        console.log("Errore apertura database")
        throw err
    }
    else {
        console.log("Connesso correttamente al database")
    }

} )

module.exports = db