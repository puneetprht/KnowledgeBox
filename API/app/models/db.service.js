const sql = require('./db.js');

module.exports = {
  executeQuery: (query) => {
    return new Promise((resolve, reject) => {
      sql.query(query, (err, results) => {
        if(err){
          return reject(err);
        }
        return resolve(results);
      })
    });
  }
};