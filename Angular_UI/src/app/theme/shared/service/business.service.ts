import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
providedIn: 'root'
})
export class BusinessService {

    constructor(private apiService: ApiService) { }

    // Business Partner Types
    getBusinessPartnerTypes()
    {
        return this.apiService.get('/business/getBusinessPartnerTypes');
    }

    // Business Partner Type
    getBusinessPartnerType(id : number)
    {
        return this.apiService.get(`/business/getBusinessPartnerType/${id}`);
    }

    // Commission Terms
    getCommissionTerms()
    {
        return this.apiService.get('/business/getCommissionTerms');
    }

    // Commercial Terms
    getCommercialTerms()
    {
        return this.apiService.get('/business/getCommercialTerms');
    }

    // academy enclosure document
    saveAcademyEnclosureDocument(academyEnclosureDocument : any) 
    {
        return this.apiService.post('/business/saveAcademyEnclosureDocument', academyEnclosureDocument);
    }

    getAcademyEnclosureDocuments(action : string) 
    {
        return this.apiService.get('/business/getAcademyEnclosureDocuments/' + action);
    }

    deleteAcademyEnclosureDocument(academyEnclosureDocument : any) 
    {
        return this.apiService.post('/business/deleteAcademyEnclosureDocument', academyEnclosureDocument);
    }

    // business vertical
    saveBusinessVertical(businessVertical : any) 
    {
        return this.apiService.post('/business/saveBusinessVertical', businessVertical);
    }

    getBusinessVerticals(action : string) 
    {
        return this.apiService.get('/business/getBusinessVerticals/' + action);
    }

    deleteBusinessVertical(businessVertical : any) 
    {
        return this.apiService.post('/business/deleteBusinessVertical', businessVertical);
    }

    updateBusinessVertical(businessVertical : any) 
    {
        return this.apiService.post('/business/updateBusinessVertical', businessVertical);
    }

    //business vertical group
    saveBusinessVerticalGroup(businessVerticalGroup : any) 
    {
        return this.apiService.post('/business/saveBusinessVerticalGroup', businessVerticalGroup);
    }

    getBusinessVerticalGroups(businessVerticalId : number, action : string) 
    {
        return this.apiService.get('/business/getBusinessVerticalGroups/' + businessVerticalId + '/' + action);
    }

    updateBusinessVerticalGroup(businessVerticalGroup : any) 
    {
        return this.apiService.post('/business/updateBusinessVerticalGroup', businessVerticalGroup);
    }

    deleteBusinessVerticalGroup(businessVerticalGroup : any) 
    {
        return this.apiService.post('/business/deleteBusinessVerticalGroup', businessVerticalGroup);
    }

    //business vertical type
    saveBusinessVerticalType(businessVerticalType : any) 
    {
        return this.apiService.post('/business/saveBusinessVerticalType', businessVerticalType);
    }

    getBusinessVerticalTypes(businessVerticalId : number, businessVerticalGroupId : number, action : string) 
    {
        return this.apiService.get('/business/getBusinessVerticalTypes/' + businessVerticalId + '/' + businessVerticalGroupId + '/' + action);
    }

    updateBusinessVerticalType(businessVerticalType : any) 
    {
        return this.apiService.post('/business/updateBusinessVerticalType', businessVerticalType);
    }

    deleteBusinessVerticalType(businessVerticalType : any) 
    {
        return this.apiService.post('/business/deleteBusinessVerticalType', businessVerticalType);
    }

    //coach
    saveCoach(coach : any) 
    {
        return this.apiService.post('/business/saveCoach', coach);
    }

    getCoaches(businessVerticalTypeId : number, action : string) 
    {
        return this.apiService.get('/business/getCoaches/' + businessVerticalTypeId + '/' + action);
    }

    updateCoach(coach : any) 
    {
        return this.apiService.post('/business/updateCoach', coach);
    }

    deleteCoach(coach : any) 
    {
        return this.apiService.post('/business/deleteCoach', coach);
    }

    // country
    saveCountry(country : any) 
    {
        return this.apiService.post('/business/saveCountry', country);
    }

    uploadCountries(countries : any)
    {
        return this.apiService.post('/business/uploadCountries', countries);
    }

    getCountries(action : string) 
    {
        return this.apiService.get('/business/getCountries/' + action);
    }

    deleteCountry(country : any) 
    {
        return this.apiService.post('/business/deleteCountry', country);
    }

    updateCountry(country : any) 
    {
        return this.apiService.post('/business/updateCountry', country);
    }
    
    // state region
    saveStateRegion(stateRegion : any) 
    {
        return this.apiService.post('/business/saveStateRegion', stateRegion);
    }

    uploadStateRegions(stateRegions : any)
    {
        return this.apiService.post('/business/uploadStateRegions', stateRegions);
    }

    getStateRegions(countryId : number, action : string) 
    {
        return this.apiService.get('/business/getStateRegions/' + countryId + '/' + action);
    }

    deleteStateRegion(stateRegion : any) 
    {
        return this.apiService.post('/business/deleteStateRegion', stateRegion);
    }

    updateStateRegion(stateRegion : any) 
    {
        return this.apiService.post('/business/updateStateRegion', stateRegion);
    }

    // district
    saveDistrict(district : any) 
    {
        return this.apiService.post('/business/saveDistrict', district);
    }

    uploadDistricts(district : any)
    {
        return this.apiService.post('/business/uploadDistricts', district);
    }

    getDistricts(countryId : number, stateRegionId : number, action : string) 
    {
        return this.apiService.get('/business/getDistricts/' + countryId + '/' + stateRegionId + '/' + action);
    }

    deleteDistrict(district : any) 
    {
        return this.apiService.post('/business/deleteDistrict', district);
    }

    updateDistrict(district : any) 
    {
        return this.apiService.post('/business/updateDistrict', district);
    }

    // city
    saveCity(city : any) 
    {
        return this.apiService.post('/business/saveCity', city);
    }

    uploadCities(city : any)
    {
        return this.apiService.post('/business/uploadCities', city);
    }

    getCities(countryId : number, stateRegionId : number, districtId : number, action : string) 
    {
        return this.apiService.get('/business/getCities/' + countryId + '/' + stateRegionId + '/' + districtId + '/' + action);
    }

    deleteCity(city : any) 
    {
        return this.apiService.post('/business/deleteCity', city);
    }

    updateCity(city : any) 
    {
        return this.apiService.post('/business/updateCity', city);
    }

    //business partner
    getBusinessPartners(businessPartnerTypeId : any, action : string)
    {
        return this.apiService.get('/business/getBusinessPartners/' + businessPartnerTypeId + '/' + action);
    }

    saveBusinessPartner(businessPartner : any)
    {
        return this.apiService.post('/business/saveBusinessPartner', businessPartner);
    }

    getBusinessPartner(uuid : string)
    {
        return this.apiService.get('/business/getBusinessPartner/' + uuid);
    }

    updateBusinessPartner(businessPartner : any)
    {
        return this.apiService.post('/business/updateBusinessPartner', businessPartner);
    }

    deleteBusinessPartner(businessPartner : any)
    {
        return this.apiService.post('/business/deleteBusinessPartner', businessPartner);
    }

    // business partner contract
    saveBusinessPartnerContract(businessPartnerContract : any)
    {
        return this.apiService.post('/business/saveBusinessPartnerContract', businessPartnerContract);
    }

    getBusinessPartnerContractHistories(uuid : string)
    {
        return this.apiService.get('/business/getBusinessPartnerContractHistories/' + uuid);
    }

    deleteBusinessPartnerContract(businessPartnerContract : any)
    {
        return this.apiService.post('/business/deleteBusinessPartnerContract', businessPartnerContract);
    }

    // business partner document
    uploadBusinessPartnerDocument(businessPartnerDocument : any)
    {
        return this.apiService.post('/business/uploadBusinessPartnerDocument', businessPartnerDocument);
    }

    getBusinessPartnerDocuments(uuid : string)
    {
        return this.apiService.get('/business/getBusinessPartnerDocuments/' + uuid);
    }

    deleteBusinessPartnerDocument(businessPartnerDocument : any)
    {
        return this.apiService.post('/business/deleteBusinessPartnerDocument', businessPartnerDocument);
    }
    
    getBusinessPartnerDocumentFile(businessPartnerDocument : any)
    {
        return this.apiService.post('/business/getBusinessPartnerDocumentFile', businessPartnerDocument)
    }

    // business partner coach
    saveBusinessPartnerCoach(businessPartnerCoach : any) 
    {
        return this.apiService.post('/business/saveBusinessPartnerCoach', businessPartnerCoach);
    }

    getBusinessPartnerCoaches(uuid : string) 
    {
        return this.apiService.get('/business/getBusinessPartnerCoaches/' + uuid);
    }

    getBusinessPartnerCoach(id : number) 
    {
        return this.apiService.get('/business/getBusinessPartnerCoach/' + id);
    }

    deleteBusinessPartnerCoach(businessPartnerCoach : any) 
    {
        return this.apiService.post('/business/deleteBusinessPartnerCoach', businessPartnerCoach);
    }

    // tie up school
    getTieUpSchools()
    {
        return this.apiService.get('/business/getTieUpSchools');
    }

    saveTieUpSchool(tieUpSchool : any)
    {
        return this.apiService.post('/business/saveTieUpSchool', tieUpSchool);
    }

    getTieUpSchool(uuid : string)
    {
        return this.apiService.get('/business/getTieUpSchool/' + uuid);
    }

    updateTieUpSchool(tieUpSchool : any)
    {
        return this.apiService.post('/business/updateTieUpSchool', tieUpSchool);
    }

    deleteTieUpSchool(tieUpSchool : any)
    {
        return this.apiService.post('/business/deleteTieUpSchool', tieUpSchool);
    }

    // tie-up school document
    uploadTieUpSchoolDocument(tieUpSchoolDocument : any)
    {
        return this.apiService.post('/business/uploadTieUpSchoolDocument', tieUpSchoolDocument);
    }

    getTieUpSchoolDocuments(uuid : string)
    {
        return this.apiService.get('/business/getTieUpSchoolDocuments/' + uuid);
    }

    deleteTieUpSchoolDocument(tieUpSchoolDocument : any)
    {
        return this.apiService.post('/business/deleteTieUpSchoolDocument', tieUpSchoolDocument);
    }
    
    getTieUpSchoolDocumentFile(tieUpSchoolDocument : any)
    {
        return this.apiService.post('/business/getTieUpSchoolDocumentFile', tieUpSchoolDocument)
    }

    // tie-up school contract
    saveTieUpSchoolContract(tieUpSchoolContract : any)
    {
        return this.apiService.post('/business/saveTieUpSchoolContract', tieUpSchoolContract);
    }

    getTieUpSchoolContractHistories(uuid : string)
    {
        return this.apiService.get('/business/getTieUpSchoolContractHistories/' + uuid);
    }

    deleteTieUpSchoolContract(tieUpSchoolContract : any)
    {
        return this.apiService.post('/business/deleteTieUpSchoolContract', tieUpSchoolContract);
    } 

    // study-center types
    getStudyCenterTypes()
    {
        return this.apiService.get('/business/getStudyCenterTypes');
    }

    getStudyCenterType(id : number)
    {
        return this.apiService.get('/business/getStudyCenterType/' + id);
    }

    //study center reward types
    getStudyCenterRewardTypes()
    {
        return this.apiService.get('/business/getStudyCenterRewardTypes');
    }

    // study center
    getStudyCenters(studyCenterTypeId : any)
    {
        if(studyCenterTypeId != "")
        {
        return this.apiService.get('/business/getStudyCenters/' + studyCenterTypeId);
        }
        else
        {
        return this.apiService.get('/business/getStudyCenters');
        }
    }

    saveStudyCenter(studyCenter : any)
    {
        return this.apiService.post('/business/saveStudyCenter', studyCenter);
    }

    getStudyCenter(uuid : string)
    {
        return this.apiService.get('/business/getStudyCenter/' + uuid);
    }

    updateStudyCenter(studyCenter : any)
    {
        return this.apiService.post('/business/updateStudyCenter', studyCenter);
    }

    deleteStudyCenter(studyCenter : any)
    {
        return this.apiService.post('/business/deleteStudyCenter', studyCenter);
    }

    // study-center agreement
    saveStudyCenterAgreement(studyCenterAgreement : any)
    {
        return this.apiService.post('/business/saveStudyCenterAgreement', studyCenterAgreement);
    }

    getStudyCenterAgreementHistories(uuid : string)
    {
        return this.apiService.get('/business/getStudyCenterAgreementHistories/' + uuid);
    }

    deleteStudyCenterAgreement(studyCenterAgreement : any)
    {
        return this.apiService.post('/business/deleteStudyCenterAgreement', studyCenterAgreement);
    }

    // study center document
    uploadStudyCenterDocument(studyCenterDocument : any)
    {
        return this.apiService.post('/business/uploadStudyCenterDocument', studyCenterDocument);
    }

    getStudyCenterDocuments(uuid : string)
    {
        return this.apiService.get('/business/getStudyCenterDocuments/' + uuid);
    }

    deleteStudyCenterDocument(studyCenterDocument : any)
    {
        return this.apiService.post('/business/deleteStudyCenterDocument', studyCenterDocument);
    }
    
    getStudyCenterDocumentFile(studyCenterDocument : any)
    {
        return this.apiService.post('/business/getStudyCenterDocumentFile', studyCenterDocument)
    }

    // tie-up school syllabus
    saveTieUpSchoolSyllabus(tieUpSchoolSyllabus : any)
    {
        return this.apiService.post('/business/saveTieUpSchoolSyllabus', tieUpSchoolSyllabus);
    }

    getTieUpSchoolSyllabuses(action : string)
    {
        return this.apiService.get('/business/getTieUpSchoolSyllabuses/' + action);
    }

    getTieUpSchoolSyllabus(id : number)
    {
        return this.apiService.get('/business/getTieUpSchoolSyllabus' + id);
    }

    delteTieUpSchoolSyllabus(tieUpSchoolSyllabus : any)
    {
        return this.apiService.post('/business/deleteTieUpSchoolSyllabus', tieUpSchoolSyllabus);
    }
    
}
