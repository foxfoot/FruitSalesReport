const dbConn = require('./db_conn')
const Sequelize = require('sequelize');

var fruit_table = dbConn.define(
    'fruit',//DB name
    {  //columns definitions
        id : {
            type:Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement: true
        },
        name : Sequelize.STRING(100),
        price : Sequelize.DECIMAL(10,2),
        color : Sequelize.STRING
    },
    {  //options
        timestamp : false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true  //do not change the table name
    }
);

fruit_table.sync({force : true})
    .then(function(){
    fruit_table.create({
       name : "apple",
       price : 1.99,
       color : 'red'
    });
    
    fruit_table.create({
        name : "pear",
        price : 0.59,
        color : 'yellow'
     });
     
    fruit_table.create({
        name : "orange",
        price : 2.00,
        color : 'orange'
     });
});


async function query(name){
    console.log("query the DB, name:" + name);
    const qryObj = name === undefined ?  {} : {
        where : {
            name : name,
            '$not' : [
                {'id' : null}
            ]
        }
    };
    return await fruit_table.findAll(qryObj);
}

async function add(params){
    console.log("Add into the DB");
    if(params===undefined){
        return false;
    }

    params.price = params.price ? parseFloat(params.price) : null;

    /*await fruit_table.create({
        id : Date.now(),
        name : params.name,
        price : params.price ? params.price : null,
        color : params.color ? params.color : null
    });*/
    let res = await fruit_table.create(params);
    console.log(res);
    return res;
}

async function modify(params){
    console.log("modify ");
    if(params===undefined || params.name === undefined){
        return false;
    }

    let res = await fruit_table.update(  
        params,  //value
        {        //options
            where : {name : params.name},
            returning: true  // return result
            /*,
            plain: true*/
        }).catch(e=>{
                console.log("modify exception: " + e);
            }
        );

    console.log(res);
    return res[1] > 0; // number of rows effected
}

async function deleteFruit(params){
    console.log("deleting");
    if(params===undefined || params.name === undefined){
        return false;
    }

    let res = await fruit_table.destroy(
        {
            where : params,
            returning : true
        }
    ).catch(e => console.log("delete error: " + e));

    console.log(res);
    return res>0; // number of rows effected
}

module.exports = {
    query,
    add,
    modify,
    deleteFruit
};
