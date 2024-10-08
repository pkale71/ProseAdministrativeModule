const express = require('express');
const commonRoute = express.Router();
let errorCodes = require('../util/errorCodes');
let errorCode = new errorCodes();
let uploads = require('../util/multerConfig.js');

commonRoute.use('/updateStatus', require('../util/validateToken.js'), require('./update-status.js'));

///Masters
commonRoute.use('/getTaxTypes', require('../util/validateToken.js'), require('./tax-types.js'));
commonRoute.use('/saveTaxType', require('../util/validateToken.js'), require('./save-tax-type.js'));
commonRoute.use('/updateTaxType', require('../util/validateToken.js'), require('./update-tax-type.js'));
commonRoute.use('/deleteTaxType', require('../util/validateToken.js'), require('./delete-tax-type.js'));

commonRoute.use('/getTaxRates', require('../util/validateToken.js'), require('./tax-rates.js'));
commonRoute.use('/getTaxRate', require('../util/validateToken.js'), require('./tax-rate.js'));
commonRoute.use('/saveTaxRate', require('../util/validateToken.js'), require('./save-tax-rate.js'));
commonRoute.use('/updateTaxRate', require('../util/validateToken.js'), require('./update-tax-rate.js'));
commonRoute.use('/deleteTaxRate', require('../util/validateToken.js'), require('./delete-tax-rate.js'));

commonRoute.use('/getFeeTypes', require('../util/validateToken.js'), require('./fee-types.js'));
commonRoute.use('/saveFeeType', require('../util/validateToken.js'), require('./save-fee-type.js'));
commonRoute.use('/updateFeeType', require('../util/validateToken.js'), require('./update-fee-type.js'));
commonRoute.use('/deleteFeeType', require('../util/validateToken.js'), require('./delete-fee-type.js'));

commonRoute.use('/getDiscountTypes', require('../util/validateToken.js'), require('./discount-types.js'));
commonRoute.use('/saveDiscountType', require('../util/validateToken.js'), require('./save-discount-type.js'));
commonRoute.use('/updateDiscountType', require('../util/validateToken.js'), require('./update-discount-type.js'));
commonRoute.use('/deleteDiscountType', require('../util/validateToken.js'), require('./delete-discount-type.js'));

commonRoute.use('/getFeeCategories', require('../util/validateToken.js'), require('./fee-categories.js'));
commonRoute.use('/saveFeeCategory', require('../util/validateToken.js'), require('./save-fee-category.js'));
commonRoute.use('/updateFeeCategory', require('../util/validateToken.js'), require('./update-fee-category.js'));
commonRoute.use('/deleteFeeCategory', require('../util/validateToken.js'), require('./delete-fee-category.js'));

commonRoute.use('/getStudentDocuments', require('../util/validateToken.js'), require('./student-documents.js'));
commonRoute.use('/saveStudentDocument', require('../util/validateToken.js'), require('./save-student-document.js'));
commonRoute.use('/deleteStudentDocument', require('../util/validateToken.js'), require('./delete-student-document.js'));

commonRoute.use('/getExitReasonTypes', require('../util/validateToken.js'), require('./exit-reason-types.js'));

commonRoute.use('/getCourseExitReasons', require('../util/validateToken.js'), require('./course-exit-reasons.js'));
commonRoute.use('/saveCourseExitReason', require('../util/validateToken.js'), require('./save-course-exit-reason.js'));
commonRoute.use('/updateCourseExitReason', require('../util/validateToken.js'), require('./update-course-exit-reason.js'));
commonRoute.use('/deleteCourseExitReason', require('../util/validateToken.js'), require('./delete-course-exit-reason.js'));

commonRoute.use('/getGradeSections', require('../util/validateToken.js'), require('./grade-sections.js'));
commonRoute.use('/saveGradeSection', require('../util/validateToken.js'), require('./save-grade-section.js'));
commonRoute.use('/deleteGradeSection', require('../util/validateToken.js'), require('./delete-grade-section.js'));

commonRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : errorCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = commonRoute