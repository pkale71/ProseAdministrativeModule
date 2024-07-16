import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class YearCalenderService {
  constructor(private apiService: ApiService) { }
  
  getYearCalender(schoolUUID : string, academicYearUUID : string){
    return this.apiService.get('/yearCalender/getYearCalender/' + schoolUUID + '/' + academicYearUUID);
  }

  getYearCalenderByMonth(monthNumber : number, year : number, schoolUUID : string){
    return this.apiService.get('/yearCalender/getYearCalenderByMonth/' + monthNumber + '/' + year + '/' + schoolUUID);
  }

  generateYearCalender(yearCalender : any)
  {
    return this.apiService.post('/yearCalender/generateYearCalender', yearCalender);
  }

  updateYearCalender(yearCalender : any)
  {
    return this.apiService.post('/yearCalender/updateYearCalender', yearCalender);
  }
}
