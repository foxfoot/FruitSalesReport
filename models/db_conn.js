const Sequelize = require('sequelize');

const connection = require('./connPasswd.json')

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