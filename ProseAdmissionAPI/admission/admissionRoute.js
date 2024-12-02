const express = require('express');
const admissionRoute = express.Router();
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let uploads = require('../util/multerConfig.js');

///Masters
admissionRoute.use('/getApplicationTypes', require('../util/validateToken.js'), require('./application-types.js'));
admissionRoute.use('/getPaymentMethods', require('../util/validateToken.js'), require('./payment-methods.js'));
admissionRoute.use('/getApplicationStatuses', require('../util/validateToken.js'), require('./application-statuses.js'));
admissionRoute.use('/getGenders', require('../util/validateToken.js'), require('./genders.js'));
admissionRoute.use('/getLeadStudentTypes', require('../util/validateToken.js'), require('./lead-student-types.js'));
admissionRoute.use('/getMarketLeadTypes', require('../util/validateToken.js'), require('./market-lead-types.js'));
admissionRoute.use('/getWalkInModes', require('../util/validateToken.js'), require('./walk-in-modes.js'));
admissionRoute.use('/getSiblingTypes', require('../util/validateToken.js'), require('./sibling-types.js'));
admissionRoute.use('/getStudentProfileCompletions', require('../util/validateToken.js'), require('./student-profile-completions.js'));
admissionRoute.use('/getParentUndertakings', require('../util/validateToken.js'), require('./parent-undertakings.js'));
admissionRoute.use('/getApplicationStudents', require('../util/validateToken.js'), require('./application-students.js'));
admissionRoute.use('/getApplicationForms', require('../util/validateToken.js'), require('./application-forms.js'));
admissionRoute.use('/getApplicationStudentProfile', require('../util/validateToken.js'), require('./application-student-profile.js'));
admissionRoute.use('/getApplicationParentProfile', require('../util/validateToken.js'), require('./application-parent-profile.js'));
admissionRoute.use('/getApplicationSubjectGroup', require('../util/validateToken.js'), require('./application-subject-group.js'));
admissionRoute.use('/getApplicationSportEngagement', require('../util/validateToken.js'), require('./application-sport-engagement.js'));
admissionRoute.use('/getApplicationUndergoneEducation', require('../util/validateToken.js'), require('./application-undergone-education.js'));
admissionRoute.use('/getApplicationUndertakingDocument', require('../util/validateToken.js'), require('./application-undertaking-document.js'));
admissionRoute.use('/getApplicationStudentDocuments', require('../util/validateToken.js'), require('./application-student-documents.js'));
admissionRoute.use('/getApplicationFeeStructure', require('../util/validateToken.js'), require('./application-fee-structure.js'));
admissionRoute.use('/getApplicationFeePayments', require('../util/validateToken.js'), require('./application-fee-payments.js'));
admissionRoute.use('/saveB2CApplicationForm1', require('../util/validateToken.js'), require('./save-b2c-application-form-1.js'));
admissionRoute.use('/saveB2CApplicationForm2', require('../util/validateToken.js'), require('./save-b2c-application-form-2.js'));
admissionRoute.use('/saveB2CApplicationForm3', require('../util/validateToken.js'), require('./save-b2c-application-form-3.js'));
admissionRoute.use('/saveApplicationForm4', uploads, require('../util/validateToken.js'), require('./save-application-form-4.js'));
admissionRoute.use('/saveB2CApplicationForm5', uploads, require('../util/validateToken.js'), require('./save-b2c-application-form-5.js'));
admissionRoute.use('/saveApplicationStudentDocs', uploads, require('../util/validateToken.js'), require('./save-application-student-docs.js'));
admissionRoute.use('/saveB2BApplicationForm1', require('../util/validateToken.js'), require('./save-b2b-application-form-1.js'));
admissionRoute.use('/saveB2BApplicationForm2', require('../util/validateToken.js'), require('./save-b2b-application-form-2.js'));
admissionRoute.use('/deleteApplicationDoc', require('../util/validateToken.js'), require('./delete-application-doc.js'));
admissionRoute.use('/downloadApplicationDoc', require('../util/validateToken.js'), require('./download-application-doc.js'));

admissionRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : errorCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = admissionRoute