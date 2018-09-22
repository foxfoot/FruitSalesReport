const cron = require('node-cron');
const salesReportHandler = require('./webapi/salesReportHandler')
const moment = require('moment');
const order_table = require('../models/order_table');
const cachedDailySalesReport_table = require('../models/cachedDailySalesReport_table');

module.exports = function(){
    cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', async () => {
        const now = moment().format('YYYY-MM-DD');
        console.log('running a task every 5 seconds. Current time is: ' + now);

        try{
            // query the DB to get the "daily" report
            const todayReport = await order_table.generateSalesReport({
                start_date : now.toString(),
                end_date : now.toString(),
            });

            if(!todayReport || todayReport.length !== 1){
                console.error("Sales report cron job failed.");
                return ;
            }

            console.log("Sales report cron job succeeded. " + JSON.stringify(todayReport[0]));

            await cachedDailySalesReport_table.add({
                date : todayReport[0].start_date,
                order_count : todayReport[0].order_count,
                total_amount : todayReport[0].total_amount,
                total_price : todayReport[0].total_price
            });
        }catch(e){
            console.error("Sales report cron job failed. Error: " + e);
        }
    });
}
