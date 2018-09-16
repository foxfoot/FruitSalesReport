'use strict'

var fruit_table = require('../../models/fruit_table');

async function get(name, res){
    console.log(__dirname + "/" + __filename + " get()");

    try{
        const fruitList =  await fruit_table.query(name);
        return res.json(fruitList);
    }catch(e){
        return res.status(406).send("Unable to get fruit list. " + e);
    }
}

async function add(params){
    if(params ===undefined || params.name===undefined){
        throw new Error("Wrong input");
    }

    const found = await fruit_table.count(params.name);
    if(found > 0){
        throw new Error(""+params.name + " exits!");
    }

    return await fruit_table.add(params);
}

async function modify(params){
    if(params === undefined || params.name === undefined){
        throw new Error("name is empty.");
    }

    return await fruit_table.modify(params);
}

var deleteFruit = async params => {
    if(params === undefined || params.name===undefined){
        return false;
    }

    return await fruit_table.deleteFruit(params);
}

module.exports = {
    get,
    add,
    modify,
    deleteFruit
};
