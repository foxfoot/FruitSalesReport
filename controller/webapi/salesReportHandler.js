const order_table = require('../../models/order_table');
const cachedDailySalesReport_table = require('../../models/cachedDailySalesReport_table');

/**
 * @function getDateDifference
 * Get the date difference.
 *
 * @param start_date: string, start date.
 * @param end_date: string, end date.
 * @return number, the date difference.
 */
function getDateDifference(start_date, end_date){
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diff = (end-start)/(24*3600*1000);
    console.debug("Days diff is " + diff);
    return diff;
}

/**
 * @function getSalesReport
 * Get the sales report. Fetch the catched table first. If not found, call generateSalesReport()
 *
 * @param params: Object, must include two properties: start_date, end_date which are string.
 * @param res: Optional, the response message.
 * @return true, if the report is got; false, if the report is not got
 */
async function getSalesReport(params, res){
    console.log("Enter getSalesReport");

    //1. Fetch the cache table
    try{
        const cachedResult = await cachedDailySalesReport_table.query(params.start_date, params.end_date);
        // check the days involved equal start date to end date
        if(cachedResult && 
            cachedResult.numOfDays === 1 + getDateDifference(params.start_date, params.end_date)){
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

/**
 * @function generateSalesReport
 * Generate the sales report which may has multiple LEFT JOINs
 *
 * @param params: Object, must include two properties: start_date, end_date which are string.
 * @param res: Optional, the response message.
 * @return true, if the report is got; false, if the report is not got
 */
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
        if(res){
            res.status(500).send(e);
        }
        return false;
    }
}

module.exports = {
    getSalesReport,
    generateSalesReport
}