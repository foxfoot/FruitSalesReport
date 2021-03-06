const dbConn = require('./db_conn')
const Sequelize = require('sequelize');

var fruit_table = dbConn.define(
    'fruit',//DB name
    {  //columns definitions
        name : {
            type: Sequelize.STRING(64),
            primaryKey : true
        },
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

fruit_table.sync(/*{force : true}*/)
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
            name : name
        }
    };
    return await fruit_table.findAll(qryObj);
}

async function add(params){
    console.log("Add into the DB");
    if(params===undefined){
        return {};
    }

    //params.price = params.price ? parseFloat(params.price) : null;
    params.color = params.color || "unknown";
    let res = await fruit_table.create(params);
    console.log(res);
    return res;
}

/*
 * @return true -- if succeeded; false -- if failed
 */
async function modify(name, params){
    console.log("modify ");
    if(params===undefined || name === undefined){
        return false;
    }

    const res = await fruit_table.update(  
        params,  //value
        {        //options
            where : {name : name},
            returning: true  // return result
            /*,
            plain: true*/
        }).catch(e=>{
                console.log("Modify exception: " + e);
            }
        );

    //console.log(res.get({'plain': true}));
    return res.length>0; // number of rows effected
}

async function deleteFruit(name){
    console.log("deleting");
    if(name === undefined){
        return false;
    }

    let res = await fruit_table.destroy(
        {
            where : {
                name : name
            },
            returning : true
        }
    ).catch(e => console.log("delete error: " + e));

    //console.log(res);
    return res>0; // number of rows effected
}

module.exports = {
    query,
    add,
    modify,
    deleteFruit
};
