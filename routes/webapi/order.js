/*const orderHandler = require('../controller/webapi/orderHandler');

module.exports = [
    {
        method : 'POST',
        path : "/order",
        handler : async function (request, h){
            try{
                let res = await orderHandler.add(request.query);
                if(res){
                    console.log('Add an order is successful.');
                    return 'Add an order is successful.';
                }else{
                    console.log('Add an order is failed.');
                }
            }catch(e){
                console.log('Add an order is failed. Error: ' + e)
            };

            return 'Add an order is failed.';
        }
    },
    {
        method : "GET",
        path : "/order",
        handler : async function(request, h){
            try{
                return await orderHandler.query(request.query);
            }catch(e){
                return "Cannot get the order";
            }
        }
    }
];*/