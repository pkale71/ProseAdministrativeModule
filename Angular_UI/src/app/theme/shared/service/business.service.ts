import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private apiService: ApiService) { }

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
  

}
