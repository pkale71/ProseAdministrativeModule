import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) { }

  // json file
  public assignModuleRoles = [
          { id: 1, module: { id: 1, name: "LMS" }, role: { id: 1, name: "admin" }, userType: { id: 1, name: 'staff' } }, 
          { id: 2, module: { id: 2, name: "Addmission" }, role: { id: 2, name: "hr admin" }, userType: { id: 2, name: 'parent' } }]

  
  authenticateUser(authParams : any) 
  {
    return this.apiService.post('/user/authenticate', authParams);
  }

  changePassword(data : any) 
  {
    return this.apiService.post('/user/changePassword', data);
  }

  sendResetLink(data : any)
  {
    return this.apiService.post('/sendResetLink', data);
  }

  getResetLinkData(code : string)
  {
    return this.apiService.get('/getResetLinkData/' + code);
  }

  resetPassword(data : any)
  {
    return this.apiService.post('/resetPassword/', data);
  }

  logout() 
  {
    return this.apiService.get('/user/signout');
  }

  //on Boarding link
  saveOnBoardingLink(onBoardinLink : any)
  {
    return this.apiService.post('/user/saveOnBoardingLink', onBoardinLink);
  }

  getOnBoardingLinks(status : string)
  {
    return this.apiService.get(`/user/getOnBoardingLinks/${status}`);
  }

  deleteOnBoardingLink(onBoardingLink : any)
  {
    return this.apiService.post('/user/deleteOnBoardingLink', onBoardingLink);
  }

  sendOnBoardingLink(onBoardingLink : any)
  {
    return this.apiService.post('/user/sendOnBoardingLink', onBoardingLink);
  }

  getOnBoardingLink(code : string)
  {
    return this.apiService.get(`/user/getOnBoardingLink/${code}`);
  }


  // getUser(uuid : string)
  // {
  //   return this.apiService.get('/user/getUser/' + uuid);
  // }

  checkDuplicateEmailMobile(data : any)
  {
    return this.apiService.post('/user/checkDuplicateEmailMobile', data);
  }

  getUsers(userGradeId : number, userCategoryId : number, action : string)
  {
    return this.apiService.get('/user/getUsers/' + userGradeId + '/' + userCategoryId + '/' + action);
  }

  getUser(uuid : string)
  {
    return this.apiService.get('/user/getUser/' + uuid);
  }

  saveUser(user : any)
  {
    return this.apiService.post('/user/saveUser', user);
  }

  approvedUser(user : any)
  {
    return this.apiService.post('/user/approveDenyUser', user);
  }

  updateUser(user : any)
  {
    return this.apiService.post('/user/updateUser', user);
  }

  updateStatus(tempJson : any)
  {
    return this.apiService.post('/user/updateStatus', tempJson);
  }

  deleteUser(user : any)
  {
    return this.apiService.post('/user/deleteUser', user);
  }

  saveUserModule(userModule : any)
  {
    return this.apiService.post('/user/saveUserModule', userModule);
  }

  getUserModule(userUUID : any)
  {
    return this.apiService.get('/user/getUserModules/' + userUUID);
  }

  ////User Assigned Grades
  getUnassignedGrades(academicYearUUID : string, schoolUUID : string, gradeCategoryId : number)
  {
    return this.apiService.get('/user/getUnassignedGrades/' + academicYearUUID + '/' + schoolUUID + '/' + gradeCategoryId);
  }

  saveUserAssignGrade(userSuperviceGrade : any)
  {
    return this.apiService.post('/user/saveAssignedGrades', userSuperviceGrade);
  }

  deleteUserAssignGrade(userSuperviceGrade : any)
  {
    return this.apiService.post('/user/deleteAssignedGrades', userSuperviceGrade);
  }

  getAssignedGrades(userUUID : string, academicYearUUID : string)
  {
    return this.apiService.get('/user/getAssignedGrades/' + userUUID + '/' + academicYearUUID)
    // + '/' + schoolUUID);
  }

  ////User Assigned Grade Subjects
  getUnassignedGradeSubjects(academicYearUUID : string, schoolUUID : string, gradeId : number)
  {
    return this.apiService.get('/user/getUnassignedGradeSubjects/' + academicYearUUID + '/' + gradeId + '/' + schoolUUID);
  }

  saveUserAssignGradeSubject(userSuperviceGradeSubject : any)
  {
    return this.apiService.post('/user/saveAssignedGradeSubjects', userSuperviceGradeSubject);
  }

  deleteUserAssignGradeSubject(userSuperviceGradeSubject : any)
  {
    return this.apiService.post('/user/deleteAssignedGradeSubjects', userSuperviceGradeSubject);
  }

  getAssignedGradeSubjects(userUUID : string, academicYearUUID : string,)
  {
    return this.apiService.get('/user/getAssignedGradeSubjects/' + userUUID + '/' + academicYearUUID)
    // + '/' + schoolUUID);
  }

  ////User Assigned Grade Sections =  assigned module role
  getUnassignedGradeSections(academicYearUUID : string,)
  // gradeId : number, subjectUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getUnassignedGradeSubjectSections/' + academicYearUUID )
    //+ '/' + gradeId + '/' + subjectUUID + '/' + schoolUUID);
  }

  // saveUserAssignGradeSection(userAssignGradeSection : any)
  // {
  //   return this.apiService.post('/user/saveAssignedGradeSections', userAssignGradeSection);
  // }

  saveUserAssignModuleRole(userAssignGradeSection : any)
  {
    return of({ "status_code" : 200, "message": "success" });
    // return this.apiService.post('/user/saveAssignedGradeSections', userAssignGradeSection);
  }

  deleteUserAssignGradeSection(userAssignGradeSection : any)
  {
    return this.apiService.post('/user/deleteAssignedGradeSections', userAssignGradeSection);
  }

  // getAssignedGradeSections(userUUID : string, academicYearUUID : string, schoolUUID : string, gradeId : number)
  // {
  //   return this.apiService.get('/user/getAssignedGradeSections/' + userUUID + '/' + academicYearUUID + '/' + schoolUUID + "/" + gradeId);
  // }

  getAssignedModuleRoles(userUUID : string, academicYearUUID : string,)
  {
    return of({ "status_code" : 200, "message": "success", "data" : { "assignModuleRoles" : this.assignModuleRoles} });
    //return this.apiService.get('/user/getAssignedGradeSections/' + userUUID + '/' + academicYearUUID)
    // + '/' + schoolUUID + "/" + gradeId);
  }

  ////User Assigned Grade Sections APIS For Curriculum Completion
  getTeachGrades(userUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getTeachGrades/' + userUUID + '/' + schoolUUID);
  }

  getCompleteTeachGrades(academicYearUUID : string, schoolUUID : string, gradeId : number)
  {
    return this.apiService.get('/user/getCompleteTeachGrades/' + academicYearUUID + '/' + schoolUUID + '/' + gradeId);
  }

  getTeachSubjects(userUUID : string, gradeId : number, schoolUUID : string)
  {
    return this.apiService.get('/user/getTeachSubjects/' + userUUID + '/' + gradeId + '/' + schoolUUID);
  }

  getAssignedChapters(subjectUUID : string)
  {
    return this.apiService.get('/user/getAssignedChapters/' + subjectUUID);
  }

  getAssignedTopics(chapterUUID : string)
  {
    return this.apiService.get('/user/getAssignedTopics/' + chapterUUID);
  }

  getTeachGradeSections(userUUID : string, gradeId : number, subjectUUID : string, schoolUUID : string)
  {
    return this.apiService.get('/user/getTeachGradeSections/' + userUUID + '/' + gradeId + '/' + subjectUUID + '/' + schoolUUID);
  }

  //Chapter Complete Status
  getUserChapterCompleteStatuses(academicYearUUID : string, userUUID: string, gradeId : number, 
  subjectUUID : string, sectionUUID : string, chapterUUID : string)
  {
    if(chapterUUID != null)
    {
      return this.apiService.get('/user/getUserChapterCompleteStatuses/' + academicYearUUID + '/' + userUUID + '/' + gradeId + '/' + subjectUUID + '/' + sectionUUID + '/' + chapterUUID);
    }
    else
    {
      return this.apiService.get('/user/getUserChapterCompleteStatuses/' + academicYearUUID + '/' + userUUID + '/' + gradeId + '/' + subjectUUID + '/' + sectionUUID);
    }
  }

  saveUserChapterCompleteStatus(userChapterCompleteStatus : any)
  {
    return this.apiService.post('/user/saveUserChapterCompleteStatus', userChapterCompleteStatus);
  }

  updateUserChapterCompleteStatus(userChapterCompleteStatus : any)
  {
    return this.apiService.post('/user/updateUserChapterCompleteStatus', userChapterCompleteStatus);
  }

  deleteUserChapterCompleteStatus(userChapterCompleteStatus : any)
  {
    return this.apiService.post('/user/deleteUserChapterCompleteStatus', userChapterCompleteStatus);
  }
}
