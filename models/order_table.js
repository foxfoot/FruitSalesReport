const dbConn = require('./db_conn');
const Sequelize = require('sequelize');
const fruitOrder_table = require('./fruitOrder_table');
const fruit_table = require('./fruit_table');

let order_table =  dbConn.define(
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
//fruitOrder_table.hasOne(fruit_table, {foreignKey: 'fruit', targetKey: 'name'});  //??

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

    const orderObj = {
        customer : params.customer
    }

    try{
        const oneOrder = await order_table.create(orderObj);
    
        params.order.forEach(async v => {
            //convert the fruit name to fruit id
            if(!v.fruit || !v.amount){
                throw Error('Incorrect in body parameters.');
            }
            
            const fruitArr = await fruit_table.query(v.fruit);
            if(!fruitArr || fruitArr.length === 0){
                throw Error('Cannot find the price of ' + v.fruit + '.');
            }

            const oneFruitOrder = {
                fruit : v.fruit,
                amount : v.amount,
                unitPrice : fruitArr[0].price
            };

            await oneOrder.createFruitOrder(oneFruitOrder);  //createFruitOrder is added to order_table by "hasMany"
    
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


async function generateSalesReport(params){
    if(params === undefined){
        console.log('order table generateSalesReport, the params is null');
    }

    let salesRes = {};

    const rawQuery = "select  \
        count(distinct `order`.`id`) as order_count, \
        IFNULL(sum(`amount`), 0) as total_amount, \
        IFNULL(sum(`amount`*`unitPrice`), 0) as total_price, \
        '"+ params.start_date + "' as start_date, \
        '"+ params.end_date + "' as end_date \
        from `order` \
        left join `fruitorder` on `order`.`id` = `fruitorder`.`orderId` \
        where `order`.`createdAt` >= '" + params.start_date + " 00:00:00.000' \
        and `order`.`createdAt` <= '" + params.end_date + " 23:59:59.999'";

    try{
        salesRes = await dbConn.query(rawQuery, {type: dbConn.QueryTypes.SELECT});

        console.log('sales report: ' + JSON.stringify(salesRes));

    }catch(e){
        console.log('failed to query the order table. Error: ' + e);
    }

    return salesRes[0] || {};
}


module.exports = {
    add,
    query,
    generateSalesReport
}

