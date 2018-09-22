const order_table = require('../../models/order_table');

async function generateSalesReport(params, res){
    try{
        const result = await order_table.generateSalesReport(params)
        if(result){
            if(res){
                res.status(200).send(result);
            }
            return true;
        }else{
            if(res){
                res.status(401).send("Incorrect parameters.");
            }
            return false;
        }
    }catch(e){
        res.status(500).send(e);
        return false;
    }
}

module.exports = {
    generateSalesReport
}