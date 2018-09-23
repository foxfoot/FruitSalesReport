const dbConn = require('./db_conn')
const Sequelize = require('sequelize');

var cachedDailySalesReport_table = dbConn.define(
    'cachedDailySalesReport',//DB name
    {  //columns definitions
        date : {
            type: Sequelize.DATEONLY,
            primaryKey : true
        },
        order_count : Sequelize.INTEGER,
        total_amount : Sequelize.INTEGER,
        total_price : Sequelize.DECIMAL(10, 2)
    },
    {  //options
        timestamp : false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true  //do not change the table name
    }
);

cachedDailySalesReport_table.sync(/*{force : true}*/)
.then(()=>{
    console.log('cachedDailySalesReport table sync succeeded')
})
.catch((e)=>{
    console.error('cachedDailySalesReport table sync failed. Error: ' + e)
});


async function add(params){
    if(params.date === undefined || params.order_count === undefined 
        || params.total_amount === undefined || params.total_price === undefined){
            console.warn(__filename + " incorrect parameters.");
            return false;
    }

    try{
        let oneRow = await cachedDailySalesReport_table.findOne({
            where : {
                    date : params.date
                } 
            });
        
        if(oneRow) { // update
            await oneRow.update(params);
        } else { // insert
            await cachedDailySalesReport_table.create(params);
        }                    
        return true;

    }catch(e){
        console.log("Cannot create/update the cachedDailySalesReport_table. Error: " + e)
    }

    return false;
}

async function query(start_date, end_date){
    if(start_date === undefined || end_date === undefined){
        console.log('cachedDailySalesReport_table query, the params is null');
    }

    let salesRes = {};

    const rawQuery = "select sum(`order_count`) as order_count, \
                    sum(`total_amount`) as total_amount, \
                    sum(`total_price`) as total_price, \
                    '"+ start_date + "' as start_date, \
                    '"+ end_date + "' as end_date \
                    from `cachedDailySalesReport` \
                    where `date` >= '" + start_date + " 00:00:00.000' \
                    and `date` <= '" + end_date + " 23:59:59.999'";

    try{
        salesRes = await dbConn.query(rawQuery, {type: dbConn.QueryTypes.SELECT});

        console.log('sales report: ' + JSON.stringify(salesRes));

    }catch(e){
        console.log('failed to query the order table. Error: ' + e);
    }

    return salesRes[0] || {};
}

module.exports = {
    query,
    add
};
