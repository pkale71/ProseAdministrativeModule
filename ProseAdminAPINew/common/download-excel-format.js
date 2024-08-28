const buildJSON = require('./buildCommonJSONs.js');
const ExcelJS = require('exceljs');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
//////
let formatFor;
let validExcelFormatNames;
let excelFormatColumns = {
    "0": [
        {
            "names": "Topic Name"
        }
    ],
    "1": [
        {
            "names": "Country Name"
        }
    ],
    "2": [
        {
            "names": "State-Region Name"
        }
    ],
    "3": [
        {
            "names": "District Name"
        }
    ],
    "4": [
        {
            "names": "City Name"
        }
    ]
};

module.exports = require('express').Router().get('/:formatFor', async(req,res) =>
{
    try
    {
        validExcelFormatNames = [
            'Topic',
            'Country',
            'State-Region',
            'District',
            'City'
        ];
        formatFor = req.params.formatFor;
        if (validExcelFormatNames.includes(formatFor)) 
        {
            let index = validExcelFormatNames.indexOf(`${formatFor}`);
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(`${formatFor}`);
            // Define the columns
            for(let i=0;i<excelFormatColumns[index].length;i++)
            {
                let columnNames = excelFormatColumns[index][i].names.split("~");
                let columns = [];
                for(let k=0;k<columnNames.length;k++)
                {
                    columns.push({
                        header: columnNames[k],
                        width: 30
                    });
                }
                worksheet.columns = columns;
                worksheet.getRow(1).font = {bold: true };
                worksheet.views = [
                    {state: 'frozen', xSplit: 1, ySplit: 1}
                ];
            }
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename='+ formatFor + '.xlsx');
            await workbook.xlsx.write(res);
            res.end();              
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Invalid Excel Format Request For Download",
                "success" : false,
                "error" : errorCode.getStatus(500)
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
            "error" : e,
        });
    }
})
