var fruit_table = require('../../models/fruit_table');

async function get(name, res){
    console.log(__dirname + "/" + __filename + " get()");

    try{
        const fruitList =  await fruit_table.query(name);
        return res.json(fruitList);
    }catch(e){
        return res.status(500).send("Unable to get fruit list. " + e);
    }
}

async function add(params, res){
    console.log(__dirname + "/" + __filename + " get()");

    if(params ===undefined || params.name===undefined){
        throw new Error("Wrong input");
    }

    try{
        const result = await fruit_table.add(params);
        return res.json(result);
    }catch(e){
        return res.status(500).send("Unable to add a new fruit. " + e);
    }
}

async function modify(query, params, res){
    if(query===undefined || params === undefined || query.name === undefined){
        throw new Error("name is empty.");
    }

    try{
        const result = await fruit_table.modify(query.name, params);
        if(result)//true or false
            return res.status(200).send();
        else
            res.status(501).send("Unable to modify fruit " + query.name + ". ");
    }catch(e){
        return res.status(500).send("Unable to modify fruit " + query.name + ". " + e);
    }
}

var deleteFruit = async (params, res) => {
    if(params === undefined || params.name===undefined || res === undefined){
        return false;
    }

    const result = await fruit_table.deleteFruit(params.name);
    if(result){
        return res.status(200).send();
    }else{
        return res.status(500).send("Unable to delete fruit " + params.name);
    }
}

module.exports = {
    get,
    add,
    modify,
    deleteFruit
};
