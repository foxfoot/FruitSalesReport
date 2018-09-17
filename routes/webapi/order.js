const express = require('express');
const router = express.Router();
const Joi = require('joi');
const orderHandler = require('../../controller/webapi/orderHandler');

router.post('/order', async (req, res) =>{
/* TODO   console.log('fruit router post')
    const schema = Joi.object().keys({
        name : Joi.string().alphanum().min(1).max(30).required(),
        price : Joi.number().min(0.01).required(),
        color : Joi.string().regex(/^[a-zA-Z]+$/).optional()
      });
    
    const {error} = Joi.validate(req.body, schema);
    if(error){
        res.status(400).send('Invalid parameter. Error: ' + error.details[0].message);
        return;
    }
*/
    return await orderHandler.add(req.body, res);
})

/*module.exports = [
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

module.exports = router;