import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private apiService: ApiService) { }

  public modules = [{id : 1, name : 'LMS'}, {id : 2, name : 'Addmission'}, {id : 3, name :'E-ResoucesHub'}]
  
  public roles = [{id : 1, name : 'admin', module : {id : 1, name : "LMS"}}, {id : 2, name : 'hr admin', module : {id : 2, name : "Addmission"}}]

  public userTypes = [{id : 1, name : 'staff', module : {id : 1, name : "LMS"}, userRole : {id : 1, name : "admin"}}, {id : 2, name : 'parent', module : {id : 2, name : "Addmission"}, userRole : {id : 2, name : "hr admin"}}]

  public gradeCategories = [{id : 1, name : 'LKG'}, {id : 2, name : 'UKG'}]

  getUserRoles() 
  {
    // return this.apiService.get('/common/getRoles');
    return of({"status_code" : 200, "message" : "success" , "data" : {"roles" : this.roles}})
  }

  getModules() 
  {
    // return this.apiService.get('/common/getRoles');
    return of({"status_code" : 200, "message" : "success" , "data" : {"modules" : this.modules}})
  }

  saveUserRole(userRole : any)
  {
    // return this.apiService.post('/common/createGrade', grade);
    let module = this.modules.find(module=> module.id == userRole.module.id)
    let temp = {
        id : this.roles.length,
        name : userRole.name,
        module : module
    }
    this.roles.push(temp);
    return of({"status_code" : 200, "message" : "success" , "data" : {"id" : this.roles.length}})
  }

  getUserTypes() 
  {
    // return this.apiService.get('/common/getUserTypes');
    return of({"status_code" : 200, "message" : "success" , "data" : {"userTypes" : this.userTypes}})
  }

  saveUserType(userType : any)
  {
    // return this.apiService.post('/common/createGrade', grade);
    let module = this.modules.find(module=> module.id == userType.module.id)
    let role = this.roles.find(role=> role.id == userType.userRole.id)
    let temp = {
        id : this.userTypes.length,
        name : userType.name,
        module : module,
        userRole : role

    }
    this.userTypes.push(temp);
    return of({"status_code" : 200, "message" : "success" , "data" : {"id" : this.userTypes.length}})
  }

  getGradeCategories() 
  {
    // return this.apiService.get('/common/getGradeCategories');
    return of({"status_code" : 200, "message" : "success" , "data" : {"gradeCategories" : this.gradeCategories}})
  }

  deleteGradeCategory(gradeCategory : any)
  {
    // return this.apiService.post('/common/deleteGrade', grade);
    const pos = this.gradeCategories.map((item:any) => item.id).indexOf(gradeCategory.id);
    this.gradeCategories.splice(pos, 1)
    return of({"status_code" : 200, "message" : "success" })
  }
//Syllabus
  getSyllabuses() 
  {
    return this.apiService.get('/common/getSyllabuses');
  }

  saveSyllabus(syllabus : any)
  {
    return this.apiService.post('/common/createSyllabus', syllabus);
  }

  deleteSyllabus(syllabus : any)
  {
    return this.apiService.post('/common/deleteSyllabus', syllabus);
  }
//Academic Year
  getAcademicYears() 
  {
    return this.apiService.get('/common/getAcademicYears');
  }

  getAcademicYear(uuid : string) 
  {
    return this.apiService.get('/common/getAcademicYear/' + uuid);
  }

  getCurrentAcademicYear() 
  {
    return this.apiService.get('/common/getCurrentAcademicYear');
  }

  saveAcademicYear(academicYear : any)
  {
    return this.apiService.post('/common/createAcademicYear', academicYear);
  }

  deleteAcademicYear(academicYear : any)
  {
    return this.apiService.post('/common/deleteAcademicYear', academicYear);
  }

//Grade
  getGrades(gradeCategoryId :number) 
  {
    if(gradeCategoryId == 0)
    {
      return this.apiService.get('/common/getGrades');
    }
    else
    {
      return this.apiService.get('/common/getGrades/' + gradeCategoryId);
    }
  }

  getGrade(id : number) 
  {
    return this.apiService.get('/common/getGrade/' + id);
  }

  saveGrade(grade : any)
  {
    return this.apiService.post('/common/createGrade', grade);
  }

  updateGrade(grade : any)
  {
    return this.apiService.post('/common/updateGrade', grade);
  }

  deleteGrade(grade : any)
  {
    return this.apiService.post('/common/deleteGrade', grade);
  }

  //Grade Subject
  getGradeSubjects(syllabusId : number, gradeId : number) 
  {
    return this.apiService.get('/common/getGradeSubjects/' + syllabusId + '/' + gradeId);
  }

  getGradeSubject(uuid : string) 
  {
    return this.apiService.get('/common/getGradeSubject/' + uuid);
  }

  saveGradeSubject(gradeSubject : any)
  {
    return this.apiService.post('/common/createGradeSubject', gradeSubject);
  }

  updateGradeSubject(gradeSubject : any)
  {
    return this.apiService.post('/common/updateGradeSubject', gradeSubject);
  }

  changeGradeSubjectStatus(uuid : string)
  {
    return this.apiService.get('/common/changeGradeSubjectStatus/' + uuid);
  }

  deleteGradeSubject(gradeSubject : any)
  {
    return this.apiService.post('/common/deleteGradeSubject', gradeSubject);
  }

  //Grade Subject Chapter
  getSubjectChapters(subjectUUID : string) 
  {
    return this.apiService.get('/common/getSubjectChapters/' + subjectUUID);
  }

  getSubjectChapter(uuid : string) 
  {
    return this.apiService.get('/common/getSubjectChapter/' + uuid);
  }

  saveSubjectChapter(gradeSubjectChapter : any)
  {
    return this.apiService.post('/common/createSubjectChapter', gradeSubjectChapter);
  }

  updateSubjectChapter(gradeSubjectChapter : any)
  {
    return this.apiService.post('/common/updateSubjectChapter', gradeSubjectChapter);
  }

  changeSubjectChapterStatus(uuid : string)
  {
    return this.apiService.get('/common/changeSubjectChapterStatus/' + uuid);
  }

  deleteSubjectChapter(gradeSubjectChapter : any)
  {
    return this.apiService.post('/common/deleteSubjectChapter', gradeSubjectChapter);
  }
  
  //Grade Chapter Topic
  getChapterTopics(chapterUUID : string) 
  {
    return this.apiService.get('/common/getChapterTopics/' + chapterUUID);
  }

  getChapterTopic(uuid : string) 
  {
    return this.apiService.get('/common/getChapterTopic/' + uuid);
  }

  saveChapterTopic(chapterTopic : any)
  {
    return this.apiService.post('/common/createChapterTopic', chapterTopic);
  }

  updateChapterTopic(chapterTopic : any)
  {
    return this.apiService.post('/common/updateChapterTopic', chapterTopic);
  }

  changeChapterTopicStatus(uuid : string)
  {
    return this.apiService.get('/common/changeChapterTopicStatus/' + uuid);
  }

  deleteChapterTopic(chapterTopic : any)
  {
    return this.apiService.post('/common/deleteChapterTopic', chapterTopic);
  }

  //Material Type & File Type
  getFileTypes() 
  {
    return this.apiService.get('/common/getFileTypes');
  }

  getMaterialTypes() 
  {
    return this.apiService.get('/common/getMaterialTypes');
  }

  getMaterialType(uuid : string) 
  {
    return this.apiService.get('/common/getMaterialType/' + uuid);
  }

  saveMaterialType(materialType : any)
  {
    return this.apiService.post('/common/saveMaterialType', materialType);
  }

  updateMaterialType(materialType : any)
  {
    return this.apiService.post('/common/updateMaterialType', materialType);
  }

  deleteMaterialType(materialType : any)
  {
    return this.apiService.post('/common/deleteMaterialType', materialType);
  }
}
