import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class WeeklyTimeTableService {
  constructor(private apiService: ApiService) { }
  
  getWeeklyTimeTable(academicYearUUID : string, schoolUUID : string, gradeId : number, monthNumber : number, year : number, sectionUUID : string, dayNumber : number)
  {
    return this.apiService.get('/weeklyTimeTable/getWeeklyTimeTable/' + academicYearUUID + '/' + schoolUUID + '/' + monthNumber + '/' + year + '/' + gradeId + '/' + sectionUUID + '/' + dayNumber);
  }

  createWeeklyTimeTable(weeklyTimeTable : any)
  {
    return this.apiService.post('/weeklyTimeTable/createWeeklyTimeTable', weeklyTimeTable);
  }

  updateWeeklyTimeTable(weeklyTimeTable : any)
  {
    return this.apiService.post('/weeklyTimeTable/updateWeeklyTimeTable', weeklyTimeTable);
  }

  deleteWeeklyTimeTable(weeklyTimeTable : any)
  {
    return this.apiService.post('/weeklyTimeTable/deleteWeeklyTimeTable', weeklyTimeTable);
  }
}
