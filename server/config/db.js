let mysql=require('mysql2');
require('dotenv').config();

//Mysql database connection block:-
let pool=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASENAME,
    waitForConnections:true,
    connectionLimit:15,
    queueLimit:0
});

//getconnections through pool:-
pool.getConnection((err,connection)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Databse connected successfully!");
        connection.release();
    }
});

module.exports=pool;