const cron = require('node-cron');
const salesReportHandler = require('./webapi/salesReportHandler')
const moment = require('moment');
const order_table = require('../models/order_table');
const cachedDailySalesReport_table = require('../models/cachedDailySalesReport_table');

const defaultCronConfig = '0,30 * * * * *'; 

let cronConfig = defaultCronConfig;

module.exports = function(){
    cron.schedule(cronConfig, async () => {
        const now = moment().format('YYYY-MM-DD');
        console.log('running a task every 5 seconds. Current time is: ' + now);

        try{
            // query the DB to get the "daily" report
            const todayReport = await order_table.generateSalesReport({
                start_date : now.toString(),
                end_date : now.toString(),
            });

            if(!todayReport){
                console.error("Sales report cron job failed.");
                return ;
            }

            console.log("Sales report cron job succeeded. " + JSON.stringify(todayReport));

            await cachedDailySalesReport_table.add({
                date : todayReport.start_date,
                order_count : todayReport.order_count,
                total_amount : todayReport.total_amount,
                total_price : todayReport.total_price
            });
        }catch(e){
            console.error("Sales report cron job failed. Error: " + e);
        }
    });
}
