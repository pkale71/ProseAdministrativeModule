import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TeachingScheduleService {
  constructor(private apiService: ApiService) { }
  
  getTeachingSchedule(userUUID : string, fromDate : string, toDate : string, gradeId : number)
  {
    return this.apiService.get('/teachingSchedule/getTeachingSchedule/' + userUUID + '/' + fromDate + '/' + toDate + '/' + gradeId);
  }

  createTeachingSchedule(teachingSchedule : any)
  {
    return this.apiService.post('/teachingSchedule/createTeachingSchedule', teachingSchedule);
  }

  attachLessonPlan(lessonPlan : any)
  {
    return this.apiService.post('/teachingSchedule/attachLessonPlan', lessonPlan);
  }

  getEngagedTeachingSchedules(userUUID : string, academicYearUUID : string, fromDate : string, toDate : string)
  {
    return this.apiService.get('/teachingSchedule/getEngagedTeachingSchedules/' + userUUID + '/' + academicYearUUID + '/' + fromDate + '/' + toDate);
  }

  updateEngagedTeachingSchedule(engagedTeachingSchedule : any)
  {
    return this.apiService.post('/teachingSchedule/updateEngagedTeachingSchedule', engagedTeachingSchedule);
  }
  
  deleteEngagedTeachingSchedule(engagedTeachingSchedule : any)
  {
    return this.apiService.post('/teachingSchedule/deleteEngagedTeachingSchedule', engagedTeachingSchedule);
  }
}
