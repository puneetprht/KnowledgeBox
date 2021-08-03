const sql = require('../models/db.js');

module.exports = {
  executeQuery: (query) => {
    return new Promise((resolve, reject) => {
      console.log("in service");
      sql.query(query, (err, results) => {
        if(err){
          return reject(err);
        }
        return resolve(results);
      })
    });
  }
};