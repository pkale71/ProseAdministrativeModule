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
  getBusinessPartners(businessPartnerTypeId : number)
  {
    return this.apiService.get('/business/getBusinessPartners/' + businessPartnerTypeId);
  }

  saveBusinessPartner(businessPartner : any)
  {
    return this.apiService.post('/business/saveBusinessPartner', businessPartner);
  }
   

}
