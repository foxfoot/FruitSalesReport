const express = require('express');
const router = express.Router();
const Joi = require('joi');
const salesReportHandler = require('../../controller/webapi/salesReportHandler');


router.get('/salesReport', async (req, res) =>{
    await salesReportHandler.generateSalesReport(req.query, res);
});

module.exports = router;