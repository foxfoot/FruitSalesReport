'use strict'

var order_table = require('../../models/order_table');
var fruit_table = require('../../models/fruit_table');

//fruit_table.fruit_table.belongsToMany(order_table.order_table, {through : 'FruitOrder'});
//order_table.order_table.belongsToMany(fruit_table.fruit_table, {through : 'FruitOrder'});

async function add(params){
    console.log("orderHandler.add()");
    //convert the fruit name to fruit id
    if(params.fruit_name === undefined){
        throw Error('Unable to fetch the fruit name from query parameters.');
        return;
    }

    try{
        var res = await fruit_table.getIDFromName(params.fruit_name);
        if(res!==undefined){
            params.fruitId = res.id;
            console.log("orderHandler.add() fruit_id=" + res.id);
        }
    }catch(e){
        throw e;
    }

    console.log("typeof params.fruit_amount is " + (typeof params.fruit_amount));

    if(typeof params.fruit_amount === 'string'){
        params.amount = parseInt(params.fruit_amount);
        console.log("params is ", params);
    }

    return await order_table.add(params);
}

async function query(params){
    return await order_table.query(params);
}

module.exports = {
    add,
    query
}