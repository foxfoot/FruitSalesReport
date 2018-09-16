const fruitHandler = require("../../controller/webapi/fruitHandler");
const express = require('express');
const router = express.Router();

router.get("/fruit", async (req, res) => {
    console.log('fruit Router')
    try{
        const fruitList =  await fruitHandler.get(req.query.name);
        return res.json(fruitList);
    }catch(e){
        return res.status(406).send("Unable to get fruit list.");
    }
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
                if(await fruitHandler.deleteFruit(request.query)){
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