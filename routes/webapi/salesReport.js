const express = require('express');
const router = express.Router();
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
const salesReportHandler = require('../../controller/webapi/salesReportHandler');


router.get('/salesReport', async (req, res) =>{
    const schema = Joi.object().keys({
        start_date : Joi.date().format('YYYY-MM-DD').raw(),
        end_date : Joi.date().format('YYYY-MM-DD').min(Joi.ref('start_date')).raw()
    });
    
    const {error} = Joi.validate(req.query, schema);
    if(error){
        res.status(400).send('Invalid parameter. Error: ' + error.details[0].message);
        return;
    }

    await salesReportHandler.getSalesReport(req.query, res);
});

module.exports = router;