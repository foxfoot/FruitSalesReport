const fruitHandler = require("../../controller/webapi/fruitHandler");
const express = require('express');
const router = express.Router();
const Joi = require('joi')

router.get("/fruit", async (req, res) => {
    console.log('fruit router get')
    const schema = Joi.object().keys({
        name : Joi.string().regex(/^[a-zA-Z]+$/)//alphanum().min(1).max(30).optional() //only accept name [1,30]
      });
    
    const {error} = Joi.validate(req.query, schema);
    if(error){
        res.status(400).send('Invalid parameter. Error: ' + error.details[0].message);
        return;
    }

    return await fruitHandler.get(req.query.name, res);
});

router.post("/fruit", async (req, res) => {
    console.log('fruit router post')
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

    return await fruitHandler.add(req.body, res);
});

router.put("/fruit", async (req, res) => {
    console.log('fruit router put')

    const querySchema = Joi.object().keys({
        name : Joi.string().alphanum().min(1).max(30).required()
      });
    
    const {queryError} = Joi.validate(req.query, querySchema);
    if(queryError){
        res.status(400).send('Invalid parameter. Error: ' + queryError.details[0].message);
        return;
    }

    const bodySchema = Joi.object().keys({
        name : Joi.string().alphanum().min(1).max(30).required(),
        price : Joi.number().min(0.01).required(),
        color : Joi.string().regex(/^[a-zA-Z]+$/).optional()
      });
    
    const {bodyError} = Joi.validate(req.body, bodySchema);
    if(bodyError){
        res.status(400).send('Invalid parameter. Error: ' + bodyError.details[0].message);
        return;
    }

    return await fruitHandler.modify(req.query, req.body, res);
});

router.delete("/fruit", async (req, res) => {
    const schema = Joi.object().keys({
        name : Joi.string().regex(/^[a-zA-Z]+$/).required()
      });
    
    const {error} = Joi.validate(req.query, schema);
    if(error){
        res.status(400).send('Invalid parameter. Error: ' + error.details[0].message);
        return;
    }

    return await fruitHandler.deleteFruit(req.query, res);
});

module.exports = router;