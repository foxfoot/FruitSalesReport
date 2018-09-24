const cron = require('node-cron');
const moment = require('moment');
const order_table = require('../models/order_table');
const cachedDailySalesReport_table = require('../models/cachedDailySalesReport_table');
const firstline = require('firstline');

const testCronFileName = 'test/overridden_cron_job.config'; // for test
const testSubtractDay = 'test/subtractDay.config';  // for test only
const defaultCronConfig = '* * 3 * * *';   // Runn the cron job at 3:00 am every day

/**
 * @function startCronJob
 * Start the cron job to generate the sales report everyday at 3:00 am.
 *
 * @param config: String, the cron job string like "* * * * * *".
 * @return N/A
 */
async function startCronJob(config){
    if(typeof config !== 'string'){
        console.warn("Enter startCronJob. The input parameter is not string, use the default value.")
        config = defaultCronConfig;
    }else{
        console.log("Enter startCronJob. The configuration is " + config)
    }

    let subDayInt = 1;// by default it is yesterday.
    try{
        const subtractDay = await firstline(testSubtractDay);
        subDayInt = parseInt(subtractDay);
        console.debug("Read the overrdden date. Use the value " + subDayInt);
    }catch(e){
        console.debug("Unable to read the overrdden date. Use the default one.");
    }

    cron.schedule(config, async () => {
        console.log("Enter the salesReportCronJob.");
        const yesterday = moment().subtract(subDayInt, 'days').format('YYYY-MM-DD');
        console.log("Yesterday is " + yesterday);

        try{
            // query the DB to get the "daily" report
            const yesterdayReport = await order_table.generateSalesReport({
                start_date : yesterday.toString(),
                end_date : yesterday.toString(),
            });

            if(!yesterdayReport){
                console.error("Sales report cron job failed.");
                return ;
            }

            console.log("Sales report cron job succeeded. " + JSON.stringify(yesterdayReport));

            await cachedDailySalesReport_table.add({
                date : yesterdayReport.start_date,
                order_count : yesterdayReport.order_count,
                total_amount : yesterdayReport.total_amount,
                total_price : yesterdayReport.total_price
            });
        }catch(e){
            console.error("Sales report cron job failed. Error: " + e);
        }
    });
}

module.exports = function(){
    // Check if there is an overridden cron configuration file.
    firstline(testCronFileName)
        .then(startCronJob)
        .catch(()=>{
            console.debug("Unable to read the overrdden cron config. Use the default one.");
            startCronJob(defaultCronConfig);
        });
        
}
