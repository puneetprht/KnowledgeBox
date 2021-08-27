const sql = require('./db.js');

module.exports = {
  executeQuery: (queryString) => {
    return new Promise((resolve, reject) => {
      queryString = queryString.replace(/\n|\t|\r/g,'');
      queryString = queryString.replace(/\\n/g,'<br>');	
      sql.query(queryString, (err, results) => {
        if(err){
          return reject(err);
        }
        results = JSON.parse(JSON.stringify(results).replace(/<br>/g,'\\n'));	
        return resolve(results);
      })
    });
  }
};