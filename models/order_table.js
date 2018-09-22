const dbConn = require('./db_conn');
const Sequelize = require('sequelize');
const fruitOrder_table = require('./fruitOrder_table');

var order_table =  dbConn.define(
    'order',
    {
        id : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        customer : Sequelize.STRING(64)
    },
    {
        freezeTableName : true
    }
);

order_table.hasMany(fruitOrder_table);  // must put before the sync()
//fruitOrder_table.belongsTo(order_table);

order_table.sync(/*{force : true}*/).then(()=>{
    console.log('order table sync succeed');

    fruitOrder_table.sync(/*{force : true}*/)
        .then(()=>{
            console.log('fruitOrder table sync succeeded')
        })
        .catch((e)=>{
            console.log('fruitOrder table sync failed. Error: ' + e)
        });

}).catch(e => console.log('order table sync failed. Error: ' + e));

async function add(params){
    console.log('order table add.')
    if(params === undefined){
        console.log('order table add failed.')
        return false;
    }

    const orderObj= {
        customer : params.customer
    }

    try{
        const oneOrder = await order_table.create(orderObj);
    
        params.order.forEach(async v => {
            //convert the fruit name to fruit id
            if(!v.fruit || !v.amount){
                throw Error('Incorrect in body parameters.');
            }
            await oneOrder.createFruitOrder(v);  //createFruitOrder is added to order_table by "hasMany"
    
        });

    }catch(e){
        console.log("Unable to add one order. " + e);
        return false;
    }

    return true;
}

async function query(params){
    if(params === undefined){
        console.log('order table query, the params is null');
    }

    let resOrders = {};
    try{
        //Executing (default): SELECT `order`.`id`, `order`.`customer`, `fruitOrders`.`id` AS 
        // `fruitOrders.id`, `fruitOrders`.`amount` AS `fruitOrders.amount`, `fruitOrders`.`fruit` 
        // AS `fruitOrders.fruit`, `fruitOrders`.`orderId` AS `fruitOrders.orderId` 
        // FROM `order` AS `order` LEFT OUTER JOIN `fruitOrder` AS `fruitOrders`
        // ON `order`.`id` = `fruitOrders`.`orderId` WHERE `order`.`customer` = 'Teresa';
        resOrders = await order_table.findAll({
            include : fruitOrder_table/*,  //left join the fruitOrder table
            where : params*/
        });
    }catch(e){
        console.log('failed to query the order table');
    }

    return resOrders;
}



module.exports = {
    add,
    query
}

