const Sequelize = require('sequelize');

var connection = {
    dbType : 'mysql',
    database : "test_js",
    username : "root",
    password : "Root000",
    host : "127.0.0.1",
    port : 3306
};

var sequelize = new Sequelize(
    connection.database,
    connection.username,
    connection.password,
    {
        host : connection.host,
        dialect : connection.dbType,
        dialectOptions: {
            insecureAuth: true
        },
        pool : {
            max : 5,
            min : 0,
            idle : 300
        }
    }
);

module.exports = sequelize;