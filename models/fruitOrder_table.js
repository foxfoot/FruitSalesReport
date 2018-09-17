const Sequelize = require('sequelize')
const db_conn = require('./db_conn')


var fruitOrder_table = db_conn.define('fruitOrder',
    {
        amount : Sequelize.BIGINT,
        fruitId : Sequelize.INTEGER
    },
    {  //options
        timestamp : true,
        createdAt: true,
        updatedAt: false,
        freezeTableName: true  //do not change the table name
    }
);


module.exports = fruitOrder_table