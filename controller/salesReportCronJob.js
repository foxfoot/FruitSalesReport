const cron = require('node-cron');
const salesReportHandler = require('./webapi/salesReportHandler')
var moment = require('moment');


module.exports = function(){
    cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', async () => {
        const now = moment().format('YYYY-MM-DD');
        console.log('running a task every 5 seconds. Current time is: ' + now);

        try{
            let  salesReport = await salesReportHandler.generateSalesReport({
                start_date : now.toString(),
                end_date : now.toString(),
            });
            
            console.log('sales report is: ' + JSON.stringify(salesReport));
        }catch(e){
            console.error("Sales report cron job failed. Error: " + e);
        }
    });
}
