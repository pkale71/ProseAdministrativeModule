const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let uuid;
//
let feeStructure;
let feeStructureInstallments;
let feeStructureFeeTypes;
let feeStructureDiscountTypes;
let feeStructureTotals;

module.exports = require('express').Router().get('/:uuid', async(req,res) =>
{
    try
    {
        uuid = req.params?.uuid;
        
        let finalJSON = [];
        feeStructure = await dbCommon.getFeeStructure(uuid);
        if(feeStructure.length > 0)
        {
    ////Final Fee Structure JSON
            finalJSON = buildJSON.feeStructures(feeStructure, 0);

            feeStructureInstallments = await dbCommon.getFeeStructureInstallments(feeStructure[0].id);
       /////Add In JSON     
            finalJSON['feeInstallments'] = buildJSON.feeStructureInstallments(feeStructureInstallments);

            feeStructureFeeTypes = await dbCommon.getFeeStructureFeeTypes(feeStructure[0].id);
        /////Add In JSON     
            finalJSON['feeTypes'] = buildJSON.feeStructureFeeTypes(feeStructureFeeTypes);

            feeStructureDiscountTypes = await dbCommon.getFeeStructureDiscountTypes(feeStructure[0].id);
        /////Add In JSON     
            finalJSON['discountTypes'] = buildJSON.feeStructureDiscountTypes(feeStructureDiscountTypes);

            feeStructureTotals = await dbCommon.getFeeStructureTotals(feeStructure[0].id);
        /////Add In JSON     
            finalJSON['totals'] = buildJSON.feeStructureTotals(feeStructureTotals);

            res.status(200)
            return res.json({
                "feeStructure" : finalJSON,
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            });
        }   
        else
        {
            res.status(200)
            return res.json({
                "feeStructure" : [],
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            });
        }   
    } 
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
});
