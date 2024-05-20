import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class LessonPlanService {
  constructor(private apiService: ApiService) { }
  
  getLessonPlans(academicYearUUID : string, schoolUUID : string, gradeId : number, subjectUUID : string, 
    status :string, userUUID : string, chapterUUID : string, topicUUID : string){
    return this.apiService.get('/lessonPlan/getLessonPlans/' + academicYearUUID + '/' + schoolUUID + '/' + gradeId + '/' + subjectUUID + '/' + status
    + '/' + userUUID + '/' + chapterUUID + '/' + topicUUID);
  }

  getUnAllocatedLessonPlans(academicYearUUID : string, schoolUUID : string, gradeId : number, sectionUUID : string,
    subjectUUID : string, status : string, userUUID : string)
  {
    return this.apiService.get('/lessonPlan/getUnAllocatedLessonPlans/' + academicYearUUID + '/' + schoolUUID + '/' + gradeId + '/' + sectionUUID + '/' 
    + subjectUUID + '/' + status + '/' + userUUID);
  }

  getLessonPlan(uuid : string){
    return this.apiService.get('/lessonPlan/getLessonPlan/' + uuid);
  }

  createLessonPlan(lessonPlan : any)
  {
    return this.apiService.post('/lessonPlan/createLessonPlan', lessonPlan);
  }

  updateLessonPlan(lessonPlan : any)
  {
    return this.apiService.post('/lessonPlan/updateLessonPlan', lessonPlan);
  }

  deleteLessonPlan(lessonPlan : any)
  {
    return this.apiService.post('/lessonPlan/deleteLessonPlan', lessonPlan);
  }
  
  approveRejectLessonPlan(lessonPlan : any)
  {
    return this.apiService.post('/lessonPlan/approveRejectLessonPlan', lessonPlan);
  }

///Lesson Plan Description
  addLessonPlanDescription(lessonPlanDescription : any)
  {
    return this.apiService.post('/lessonPlan/addLessonPlanDescription', lessonPlanDescription);
  }

  updateLessonPlanDescription(lessonPlanDescription : any)
  {
    return this.apiService.post('/lessonPlan/updateLessonPlanDescription', lessonPlanDescription);
  }

  deleteLessonPlanDescription(lessonPlanDescription : any)
  {
    return this.apiService.post('/lessonPlan/deleteLessonPlanDescription', lessonPlanDescription);
  }
}
