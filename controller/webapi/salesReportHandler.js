const order_table = require('../../models/order_table');
const cachedDailySalesReport_table = require('../../models/cachedDailySalesReport_table');

async function getSalesReport(params, res){
    console.log("Enter getSalesReport");
    //1. Fetch the cache table
    try{
        const cachedResult = await cachedDailySalesReport_table.query(params.start_date, params.end_date);
        if(cachedResult){
            if(res){
                res.status(200).send(cachedResult);
            }
            console.log("Get sales report from cached table");
            return true;
        }
    }catch(e){
        console.log("Failed. Error: " + e);
    }

    //2. If not exists, call generateSalesReport
    return await generateSalesReport(params, res);
}

async function generateSalesReport(params, res){
    console.log("Enter generateSalesReport");
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
    getSalesReport,
    generateSalesReport
}