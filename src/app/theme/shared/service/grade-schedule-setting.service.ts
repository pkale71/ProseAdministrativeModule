import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GradeScheduleSettingService {
  constructor(private apiService: ApiService) { }
  
  getGradeScheduleSettings(academicYearUUID : string, schoolUUID : string, gradeId : number){
    return this.apiService.get('/gradeScheduleSetting/getGradeScheduleSettings/' + academicYearUUID + '/' + schoolUUID + '/' + gradeId);
  }

  getUnschduleGrades(academicYearUUID : string, schoolUUID : string){
    return this.apiService.get('/gradeScheduleSetting/getUnschduleGrades/' + academicYearUUID + '/' + schoolUUID);
  }

  createGradeScheduleSetting(gradeScheduleSetting : any)
  {
    return this.apiService.post('/gradeScheduleSetting/createGradeScheduleSetting', gradeScheduleSetting);
  }

  updateGradeScheduleSetting(gradeScheduleSetting : any)
  {
    return this.apiService.post('/gradeScheduleSetting/updateGradeScheduleSetting', gradeScheduleSetting);
  }

  deleteGradeScheduleSetting(gradeScheduleSetting : any)
  {
    return this.apiService.post('/gradeScheduleSetting/deleteGradeScheduleSetting', gradeScheduleSetting);
  }
}
