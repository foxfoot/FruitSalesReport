const express = require('express');
const router = express.Router();
const Joi = require('joi');
const orderHandler = require('../../controller/webapi/orderHandler');

router.post('/order', async (req, res) =>{
   console.log('fruit router post')

   const objSchema = Joi.object().keys({   // the object level
        fruit: Joi.string().regex(/^[a-zA-Z]+$/).required(),
        amount: Joi.number().integer().min(1).required()
    });

    // the object array level
    const arraySchema = Joi.array().items(objSchema).unique().required();

    // the top level
    const allSchema = Joi.object().keys({
        order: arraySchema,
        customer: Joi.string().regex(/^[a-zA-Z]+$/).required()
    }).with('order', 'customer')

    const {error} = Joi.validate(req.body, allSchema);
    if(error){
        res.status(400).send('Invalid parameter. Error: ' + error.details[0].message);
        return;
    }

    return await orderHandler.add(req.body, res);
})

router.get('/order', async (req, res) =>{
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
        return await orderHandler.query(req.query, res);
    })

module.exports = router;