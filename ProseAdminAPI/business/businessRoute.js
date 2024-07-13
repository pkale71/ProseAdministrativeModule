const express = require('express');
const businessRoute = express.Router();
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let uploads = require('../util/multerConfig.js');

///////Routes
businessRoute.use('/getBusinessPartnerTypes', require('../util/validateToken.js'), require('./business-partner-types.js'));
businessRoute.use('/getBusinessPartnerType', require('../util/validateToken.js'), require('./business-partner-type.js'));
businessRoute.use('/getCommissionTerms', require('../util/validateToken.js'), require('./commission-terms.js'));
businessRoute.use('/getCommercialTerms', require('../util/validateToken.js'), require('./commercial-terms.js'));
businessRoute.use('/getStudyCenterTypes', require('../util/validateToken.js'), require('./study-center-types.js'));
businessRoute.use('/getStudyCenterType', require('../util/validateToken.js'), require('./study-center-type.js'));
businessRoute.use('/getStudyCenterRewardTypes', require('../util/validateToken.js'), require('./study-center-reward-types.js'));

businessRoute.use('/getBusinessVerticals', require('../util/validateToken.js'), require('./business-verticals.js'));
businessRoute.use('/saveBusinessVertical', require('../util/validateToken.js'), require('./save-business-vertical.js'));
businessRoute.use('/updateBusinessVertical', require('../util/validateToken.js'), require('./update-business-vertical.js'));
businessRoute.use('/deleteBusinessVertical', require('../util/validateToken.js'), require('./delete-business-vertical.js'));

businessRoute.use('/getBusinessVerticalGroups', require('../util/validateToken.js'), require('./business-vertical-groups.js'));
businessRoute.use('/saveBusinessVerticalGroup', require('../util/validateToken.js'), require('./save-business-vertical-group.js'));
businessRoute.use('/updateBusinessVerticalGroup', require('../util/validateToken.js'), require('./update-business-vertical-group.js'));
businessRoute.use('/deleteBusinessVerticalGroup', require('../util/validateToken.js'), require('./delete-business-vertical-group.js'));

businessRoute.use('/getBusinessVerticalTypes', require('../util/validateToken.js'), require('./business-vertical-types.js'));
businessRoute.use('/saveBusinessVerticalType', require('../util/validateToken.js'), require('./save-business-vertical-type.js'));
businessRoute.use('/updateBusinessVerticalType', require('../util/validateToken.js'), require('./update-business-vertical-type.js'));
businessRoute.use('/deleteBusinessVerticalType', require('../util/validateToken.js'), require('./delete-business-vertical-type.js'));

businessRoute.use('/getCoaches', require('../util/validateToken.js'), require('./coaches.js'));
businessRoute.use('/saveCoach', require('../util/validateToken.js'), require('./save-coach.js'));
businessRoute.use('/updateCoach', require('../util/validateToken.js'), require('./update-coach.js'));
businessRoute.use('/deleteCoach', require('../util/validateToken.js'), require('./delete-coach.js'));

businessRoute.use('/getAcademyEnclosureDocuments', require('../util/validateToken.js'), require('./academy-enclosure-documents.js'));
businessRoute.use('/saveAcademyEnclosureDocument', require('../util/validateToken.js'), require('./save-academy-enclosure-document.js'));
businessRoute.use('/deleteAcademyEnclosureDocument', require('../util/validateToken.js'), require('./delete-academy-enclosure-document.js'));

businessRoute.use('/getCountries', require('../util/validateToken.js'), require('./countries.js'));
businessRoute.use('/saveCountry', require('../util/validateToken.js'), require('./save-country.js'));
businessRoute.use('/uploadCountries', uploads, require('../util/validateToken.js'), require('./upload-countries.js'));
businessRoute.use('/updateCountry', require('../util/validateToken.js'), require('./update-country.js'));
businessRoute.use('/deleteCountry', require('../util/validateToken.js'), require('./delete-country.js'));

businessRoute.use('/getStateRegions', require('../util/validateToken.js'), require('./state-regions.js'));
businessRoute.use('/saveStateRegion', require('../util/validateToken.js'), require('./save-state-region.js'));
businessRoute.use('/uploadStateRegions', uploads, require('../util/validateToken.js'), require('./upload-state-regions.js'));
businessRoute.use('/updateStateRegion', require('../util/validateToken.js'), require('./update-state-region.js'));
businessRoute.use('/deleteStateRegion', require('../util/validateToken.js'), require('./delete-state-region.js'));

businessRoute.use('/getDistricts', require('../util/validateToken.js'), require('./districts.js'));
businessRoute.use('/saveDistrict', require('../util/validateToken.js'), require('./save-district.js'));
businessRoute.use('/uploadDistricts', uploads, require('../util/validateToken.js'), require('./upload-districts.js'));
businessRoute.use('/updateDistrict', require('../util/validateToken.js'), require('./update-district.js'));
businessRoute.use('/deleteDistrict', require('../util/validateToken.js'), require('./delete-district.js'));

businessRoute.use('/getCities', require('../util/validateToken.js'), require('./cities.js'));
businessRoute.use('/saveCity', require('../util/validateToken.js'), require('./save-city.js'));
businessRoute.use('/uploadCities', uploads, require('../util/validateToken.js'), require('./upload-cities.js'));
businessRoute.use('/updateCity', require('../util/validateToken.js'), require('./update-city.js'));
businessRoute.use('/deleteCity', require('../util/validateToken.js'), require('./delete-city.js'));

businessRoute.use('/getBusinessPartners', require('../util/validateToken.js'), require('./business-partners.js'));
businessRoute.use('/getBusinessPartner', require('../util/validateToken.js'), require('./business-partner.js'));
businessRoute.use('/saveBusinessPartner', uploads, require('../util/validateToken.js'), require('./save-business-partner.js'));
businessRoute.use('/updateBusinessPartner', require('../util/validateToken.js'), require('./update-business-partner.js'));
businessRoute.use('/deleteBusinessPartner', require('../util/validateToken.js'), require('./delete-business-partner.js'));

businessRoute.use('/getBusinessPartnerContractHistories', require('../util/validateToken.js'), require('./business-partner-contract-histories.js'));
businessRoute.use('/saveBusinessPartnerContract', require('../util/validateToken.js'), require('./save-business-partner-contract.js'));
businessRoute.use('/deleteBusinessPartnerContract', require('../util/validateToken.js'), require('./delete-business-partner-contract.js'));

businessRoute.use('/getBusinessPartnerDocuments', require('../util/validateToken.js'), require('./business-partner-documents.js'));
businessRoute.use('/getBusinessPartnerDocumentFile', require('../util/validateToken.js'), require('./business-partner-document-file.js'));
businessRoute.use('/uploadBusinessPartnerDocument', uploads, require('../util/validateToken.js'), require('./upload-business-partner-document.js'));
businessRoute.use('/deleteBusinessPartnerDocument', require('../util/validateToken.js'), require('./delete-business-partner-document.js'));

businessRoute.use('/getBusinessPartnerCoaches', require('../util/validateToken.js'), require('./business-partner-coaches.js'));
businessRoute.use('/getBusinessPartnerCoach', require('../util/validateToken.js'), require('./business-partner-coach.js'));
businessRoute.use('/saveBusinessPartnerCoach', require('../util/validateToken.js'), require('./save-business-partner-coach.js'));
businessRoute.use('/deleteBusinessPartnerCoach', require('../util/validateToken.js'), require('./delete-business-partner-coach.js'));

businessRoute.use('/getTieUpSchools', require('../util/validateToken.js'), require('./tieup-schools.js'));
businessRoute.use('/getTieUpSchool', require('../util/validateToken.js'), require('./tieup-school.js'));
businessRoute.use('/saveTieUpSchool', uploads, require('../util/validateToken.js'), require('./save-tieup-school.js'));
businessRoute.use('/updateTieUpSchool', require('../util/validateToken.js'), require('./update-tieup-school.js'));
businessRoute.use('/deleteTieUpSchool', require('../util/validateToken.js'), require('./delete-tieup-school.js'));

businessRoute.use('/getTieUpSchoolContractHistories', require('../util/validateToken.js'), require('./tieup-school-contract-histories.js'));
businessRoute.use('/saveTieUpSchoolContract', require('../util/validateToken.js'), require('./save-tieup-school-contract.js'));
businessRoute.use('/deleteTieUpSchoolContract', require('../util/validateToken.js'), require('./delete-tieup-school-contract.js'));

businessRoute.use('/getTieUpSchoolDocuments', require('../util/validateToken.js'), require('./tieup-school-documents.js'));
businessRoute.use('/getTieUpSchoolDocumentFile', require('../util/validateToken.js'), require('./tieup-school-document-file.js'));
businessRoute.use('/uploadTieUpSchoolDocument', uploads, require('../util/validateToken.js'), require('./upload-tieup-school-document.js'));
businessRoute.use('/deleteTieUpSchoolDocument', require('../util/validateToken.js'), require('./delete-tieup-school-document.js'));

businessRoute.use('/getStudyCenters', require('../util/validateToken.js'), require('./study-centers.js'));
businessRoute.use('/getStudyCenter', require('../util/validateToken.js'), require('./study-center.js'));
businessRoute.use('/saveStudyCenter', uploads, require('../util/validateToken.js'), require('./save-study-center.js'));
businessRoute.use('/updateStudyCenter', require('../util/validateToken.js'), require('./update-study-center.js'));
businessRoute.use('/deleteStudyCenter', require('../util/validateToken.js'), require('./delete-study-center.js'));

businessRoute.use('/getStudyCenterDocuments', require('../util/validateToken.js'), require('./study-center-documents.js'));
businessRoute.use('/getStudyCenterDocumentFile', require('../util/validateToken.js'), require('./study-center-document-file.js'));
businessRoute.use('/uploadStudyCenterDocument', uploads, require('../util/validateToken.js'), require('./upload-study-center-document.js'));
businessRoute.use('/deleteStudyCenterDocument', require('../util/validateToken.js'), require('./delete-study-center-document.js'));

businessRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : errorCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = businessRoute