const order_table = require('../../models/order_table');

async function generateSalesReport(params, res){
    try{
        const result = await order_table.generateSalesReport(params)
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
    generateSalesReport
}