import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class LessonPlanMappingService {
  constructor(private apiService: ApiService) { }
  
  getLessonPlanMappings(userUUID : string, academicYearUUID : string, schoolUUID : string, gradeId : number, sectionUUID : string, subjectUUID : string, applyDate : string)
  {
    return this.apiService.get('/lessonPlanMapping/getLessonPlanMappings/' + userUUID + '/' + academicYearUUID + '/' +schoolUUID + '/' + gradeId + '/' + sectionUUID + '/' + subjectUUID + '/' + applyDate);
  }

  getLessonPlanMapping(uuid : string)
  {
    return this.apiService.get('/lessonPlanMapping/getLessonPlanMapping/' + uuid);
  }

  updateLessonPlanMapping(lessonPlanMapping : any)
  {
    return this.apiService.post('/lessonPlanMapping/updateLessonPlanMapping', lessonPlanMapping);
  }

  deleteLessonPlanMapping(lessonPlanMapping : any)
  {
    return this.apiService.post('/lessonPlanMapping/deleteLessonPlanMapping', lessonPlanMapping);
  }
}
