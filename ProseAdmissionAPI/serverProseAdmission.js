let host = "localhost";
let port = "3001";
const apiBaseUrl = `http://${host}:${port}`;
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let commonFunction = require('./util/commonFunctions.js');
let uploads = require('./util/multerConfig.js');
let dbConn = require('./util/dbConnection.js');
let errorCodes = require('./util/errorCodes');
let errorCode = new errorCodes();
// let https = require('https');

////////Create Server
let app = express();
app.use(cors());
app.use(bodyParser.json({limit: '100mb', "uploads" : uploads}));
app.use(bodyParser.urlencoded({limit: '100mb',extended : true}));

/////////Routings
app.use('/api/common', require('./common/commonRoute.js'));

app.use('/api/',(req,res,next) =>
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : errorCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})

if(dbConn)
{
///////Check Database Connection 
    try
    {
        let sql = `SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%m:%s') AS startedOn FROM DUAL`
        dbConn.query(sql,(error, result) => 
        {
            if(error)
            {
                let failedOn = (new Date().toISOString().split('T').join(" ")).split(".")[0];
                console.log("Database Connection Failed, Failed On : " + failedOn);
                return;
            }  
            else
            {
                let sql0 = `SET SESSION sql_mode='NO_ENGINE_SUBSTITUTION'`
                dbConn.query(sql0,(error0, result0) => 
                {
                    console.log("Sql Mode : NO_ENGINE_SUBSTITUTION");
                    
                    let sql1 = `SET SESSION group_concat_max_len = 1000000`;
                    dbConn.query(sql1,(error1, result1) => 
                    {
                        console.log("group_concat_max_len = 1000000");    
                        
                        let sql2 = `SELECT api_url AS apiUrl FROM app_base ab LIMIT 1`;
                        dbConn.query(sql2,(error2, result2) => 
                        {
                            global.adminPortalAPIUrl = result2[0].apiUrl;
                            ///////Start Server  
                            if(global.adminPortalAPIUrl != "")
                            {    
                                app.listen(port, host, () => {
                                    commonFunction.createRequiredDir(process.cwd());
                                    console.log(`Server is running on ${apiBaseUrl}, Started On : ` + result[0].startedOn);
                                });
                            }
                            else
                            {
                                console.log("Admin Portal API Url Not Found In app_base table");
                            }
                        });
                    });
                });
            }
        });
    }
    catch(e)
    {
        throw e
    }
}