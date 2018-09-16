const fruitHandler = require("../../controller/webapi/fruitHandler");
const express = require('express');
const router = express.Router();
const Joi = require('joi')

router.get("/fruit", async (req, res) => {
    console.log('fruit Router')
    const schema = Joi.object().keys({
        name : Joi.string().alphanum().min(1).max(30).optional() //only accept name [1,30]
      });
    
    const {error} = Joi.validate(req.query, schema);
    if(error){
        res.status(400).send('Invalid parameter. Error: ' + error.details[0].message);
        return;
    }

    return await fruitHandler.get(req.query.name, res);
});

/*
{
        method : "GET",
        path : "/fruit",
        handler : async (request, h) => {
            console.log(request.query);
            try{
                var data = await fruitHandler.get(request.query.name);
                console.log("typeof data=" + typeof data);
                return data;
            }catch(e){
                return "error: " + e;
            }
        }
    },
    {
        method : "POST",
        path : "/fruit",
        handler : async (request, h) => {
            console.log(request.query);
            try{
                let rc = await fruitHandler.add(request.query);
                if(rc){
                    return h.response("Success.");
                }else{
                    return h.response("Failed to add.").code(503);
                }
            }catch(e){
                return h.response("Unable to set fruitHandler list. " + e).code(501);
            }
        }
    },
    {
        method : 'PUT',
        path : "/fruit",
        handler : async function(request, h){
            try{
                if(await fruitHandler.modify(request.query)){
                    return "Success";
                }else{
                    return h.response("Can not find it.").code(504);
                }
            }catch(e){
                return h.response("Can not modify Error:" + e).code(504);
            }
        }
    },
    {
        method : "DELETE",
        path : "/fruit",
        handler : async (request, h) => {
            try{
                if(await fruitHandler.delete(request.query)){
                    return h.response("Success").code(200);
                }else{
                    return h.response("Failed to delete").code(505);
                }
            }catch(e){
                return h.response("Can not delete. Error:" + e);
            }
        }
    }
];*/

module.exports = router;