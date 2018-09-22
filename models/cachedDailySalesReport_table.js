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

async function query(date){
}

module.exports = {
    query,
    add
};
