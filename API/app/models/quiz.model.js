const sql = require('./db.js');

const Quiz = function(quiz) {
	
};

Quiz.getCategoryListForUser = (id, result) => {
    sql.query(`select count(*) as Count,categoryname,statename from subject s 
    inner join category c on c.hmy = s.fcategory inner join 
    state st on c.fstate = st.hmy inner join categoryxref cx on c.hmy = cx.fcategory 
    and cx.fuser = ${id} group by c.hmy`, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }

        if (res.length) {
            //console.log('found user: ', res[0]);
            result(null, res[0]);
            return;
        }

        // not found user with the id
        result({ message: 'No Quiz' }, null);
    });
};

module.exports = Quiz;
