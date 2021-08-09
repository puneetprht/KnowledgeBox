const sql = require('./db.js');

module.exports = {
  executeQuery: (queryString) => {
    return new Promise((resolve, reject) => {
      queryString = queryString.replace(/\n|\t|\r/g,'');	
      sql.query(queryString, (err, results) => {
        if(err){
          return reject(err);
        }
        return resolve(results);
      })
    });
  }
};