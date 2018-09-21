const order_table = require('../../models/order_table');
const fruit_table = require('../../models/fruit_table');

//fruit_table.fruit_table.belongsToMany(order_table.order_table, {through : 'FruitOrder'});
//order_table.order_table.belongsToMany(fruit_table.fruit_table, {through : 'FruitOrder'});

async function add(params, res){
    console.log("orderHandler.add() + size=" + params.order.length);
    params.order.forEach(v => console.log("fruit=" + v.fruit + ", amount=" + v.amount));

    if(await order_table.add(params)){
        res.status(200).send();
    }else{
        res.status(401).send("Incorrect parameters");
    }
}

async function query(params, res){
    try{
        const result = await order_table.query(params)
        if(result){
            res.status(200).send(result);
        }else{
            res.status(401).send("Incorrect parameters.");
        }
    }catch(e){
        res.status(500).send(e);
    }
}

module.exports = {
    add,
    query
}