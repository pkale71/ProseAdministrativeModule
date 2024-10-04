import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { data } from 'jquery';
import { id } from 'date-fns/locale';

@Injectable({ providedIn: 'root' })
export class CommonService {
    constructor(private apiService: ApiService) { }

    //file download
    getDownloadExcelFormat(formatFor : string)
    {
        return this.apiService.get('/common/downloadExcelFormat/' + formatFor);
    }

    //change / update Status
    updateStatus(tempJSON: any)
    {
        return this.apiService.post('/common/updateStatus', tempJSON);
    }

    changeSubChapTopStatus(tempJSON: any)
    {
        return this.apiService.post('/common/changeSubChapTopStatus', tempJSON);
    }

    duplicateEmailMobile(data : any)
    {
        return this.apiService.post('/common/duplicateEmailMobile', data);
    }

    //module
    getModules() 
    {
        return this.apiService.get('/common/getModules');
    }

    getSubjectTypes() 
    {
        return this.apiService.get('/common/getSubjectTypes');
    }

    //get user grades
    getUserGrades()
    {
        return this.apiService.get('/common/getUserGrades');
    }

    //get user categories
    getUserCategories()
    {
        return this.apiService.get('/common/getUserCategories');
    }

    //user role
    saveUserRole(userRole: any) 
    {
        return this.apiService.post('/common/saveUserRole', userRole);
    }

    getUserRoles(moduleId : number, action : string) 
    {
        return this.apiService.get('/common/getUserRoles/' + moduleId + '/' + action);
    }

    deleteUserRole(userRole: any) 
    {
        return this.apiService.post('/common/deleteUserRole', userRole);
    }

    //user type
    saveUserType(userType: any) 
    {
        return this.apiService.post('/common/saveUserType', userType);
    }

    getUserTypes(moduleId : number, userRoleId : number, action : string) 
    {
        return this.apiService.get('/common/getUserTypes/' + moduleId + '/' + userRoleId + '/' + action);
    }

    deleteUserType(id) 
    {
        return this.apiService.post('/common/deleteUserType', id);
    }

    //grade Category
    saveGradeCategory(gradeCategory: any) 
    {
        return this.apiService.post('/common/saveGradeCategory', gradeCategory);
    }

    updateGradeCategory(gradeCategory: any) 
    {
        return this.apiService.post('/common/updateGradeCategory', gradeCategory);
    }

    getGradeCategories(action : string) 
    {
        return this.apiService.get('/common/getGradeCategories/' + action);
    }

    deleteGradeCategory(gradeCategory : any) 
    {
        return this.apiService.post('/common/deleteGradeCategory', gradeCategory);
    }

    //Grade
    saveGrade(grade: any) 
    {
        return this.apiService.post('/common/saveGrade', grade);
    }

    getGrades(gradeCategoryId: number, action : string) 
    {
        return this.apiService.get('/common/getGrades/' + gradeCategoryId + '/' + action);
    }

    getGrade(id: number) 
    {
        return this.apiService.get('/common/getGrade/' + id);
    }

    updateGrade(grade: any) 
    {
        return this.apiService.post('/common/updateGrade', grade);
    }

    deleteGrade(grade: any) 
    {
        return this.apiService.post('/common/deleteGrade', grade);
    }

    //Syllabus
    getSyllabuses(gradeCategoryId : number, action : string) 
    {
        return this.apiService.get('/common/getSyllabuses/' + gradeCategoryId + '/' + action);  
    }

    getSyllabus(id : number) 
    {
        return this.apiService.get(`/common/getSyllabus/${id}`);  
    }

    saveSyllabus(syllabus: any) 
    {
        return this.apiService.post('/common/saveSyllabus', syllabus);
    }

    deleteSyllabus(syllabus: any) 
    {
        return this.apiService.post('/common/deleteSyllabus', syllabus);
    }

    addSyllabusGradeCategories(gradeCategory: any)
    {
        return this.apiService.post('/common/addSyllabusGradeCategories', gradeCategory);
    }

    deleteSyllabusGradeCategory(gradeCategory: any)
    {
        return this.apiService.post('/common/deleteSyllabusGradeCategory', gradeCategory);
    }

    //schooling group
    saveSchoolingGroup(schoolingGroup: any) 
    {
        return this.apiService.post('/common/saveSchoolingGroup', schoolingGroup);
    }

    getSchoolingGroups(action : string) 
    {
        return this.apiService.get('/common/getSchoolingGroups/' + action);
    }

    deleteSchoolingGroup(schoolingGroup : any) 
    {
        return this.apiService.post('/common/deleteSchoolingGroup', schoolingGroup);
    }

    //schooling category
    saveSchoolingCategory(schoolingCategory: any) 
    {
        return this.apiService.post('/common/saveSchoolingCategory', schoolingCategory);
    }

    getSchoolingCategories(action : string) 
    {
        return this.apiService.get('/common/getSchoolingCategories/' + action);
    }

    deleteSchoolingCategory(schoolingCategory : any) 
    {
        return this.apiService.post('/common/deleteSchoolingCategory', schoolingCategory);
    }

    //schooling program
    saveSchoolingPrograms(schoolingProgram: any) 
    {
        return this.apiService.post('/common/saveSchoolingProgram', schoolingProgram);
    }

    getSchoolingPrograms(schoolingCategoryId : number, action : string) 
    {
        return this.apiService.get('/common/getSchoolingPrograms/' + schoolingCategoryId + '/' + action);  
    }

    updateSchoolingProgram(schoolingProgram : any)
    {
        return this.apiService.post('/common/updateSchoolingProgram/', schoolingProgram);
    }

    deleteSchoolingProgram(schoolingProgram : any) 
    {
        return this.apiService.post('/common/deleteSchoolingProgram', schoolingProgram);
    }

    //academic sesssion
    saveAcademicSession(academicSession: any) 
    {
        return this.apiService.post('/common/saveAcademicSession', academicSession);
    }

    getAcademicSessions() 
    {
        return this.apiService.get('/common/getAcademicSessions');
    }

    updateAcademicSession(academicSession: any) 
    {
        return this.apiService.post('/common/updateAcademicSession', academicSession)
    }

    deleteAcademicSession(academicSession: any) 
    {
        return this.apiService.post('/common/deleteAcademicSession', academicSession);
    }

    //school sub group
    saveSchoolSubGroup(schoolSubGroup: any) 
    {
        return this.apiService.post('/common/saveSchoolSubGroup', schoolSubGroup);
    }

    getSchoolSubGroups(action : string) 
    {
        return this.apiService.get('/common/getSchoolSubGroups/' + action);
    }

    deleteSchoolSubGroup(schoolSubGroup: any) 
    {
        return this.apiService.post('/common/deleteSchoolSubGroup', schoolSubGroup);
    }

    //academic sesssion
    saveBatchType(batchType: any) 
    {
        return this.apiService.post('/common/saveBatchType', batchType);
    }

    getBatchTypes(academicSessionId : number, action : string) 
    {
        return this.apiService.get('/common/getBatchTypes/' + academicSessionId + '/' + action);
    }

    updateBatchType(batchType: any) 
    {
        return this.apiService.post('/common/updateBatchType', batchType)
    }

    deleteBatchType(batchType: any) 
    {
        return this.apiService.post('/common/deleteBatchType', batchType);
    }

    //subjects
    saveSubject(subject: any) 
    {
        return this.apiService.post('/common/saveSubject', subject);
    }

    getSubjects(gradeCategoryId : number, gradeId : number, syllabusId : number, action : string) 
    {
        return this.apiService.get("/common/getSubjects/" + gradeCategoryId + '/' + gradeId + '/' + syllabusId + '/' + action);
    }

    getSubject(id : number)
    {
        return this.apiService.get('/common/getSubject/' + id);
    }

    updateSubject(subject: any) 
    {
        return this.apiService.post('/common/updateSubject', subject);
    }

    deleteSubject(subject : any) 
    {
        return this.apiService.post("/common/deleteSubject", subject);
    }  

    // chapters
    saveChapter(chapter : any) 
    {
        return this.apiService.post("/common/saveChapter", chapter);
    }

    getChapters(gradeCategoryId : number, gradeId : number, syllabusId : number, subjectId : number, action : string) 
    {
        return this.apiService.get("/common/getChapters/" + gradeCategoryId + '/' + gradeId + '/' + syllabusId + '/' + subjectId + '/' + action);
    }

    uploadChapters(chapter : any)
    {
        return this.apiService.post("/common/uploadChapters", chapter);
    }

    updateChapter(chapter : any) 
    {
        return this.apiService.post('/common/updateChapter', chapter);   
    }

    deleteChapter(chapter : any) 
    {
        return this.apiService.post('/common/deleteChapter', chapter);   
    }

    // topics
    saveTopic(topic : any) 
    {
        return this.apiService.post('/common/saveTopic', topic);
    }

    uploadTopics(topic : any)
    {
        return this.apiService.post('/common/uploadTopics', topic);
    }

    getTopics(gradeCategoryId : number, gradeId : number, syllabusId : number, subjectId : number, chapterId : number, action : string) 
    {
        return this.apiService.get('/common/getTopics/' + gradeCategoryId + '/' + gradeId + '/' + syllabusId + '/' + subjectId + '/' + chapterId + '/' + action);  
    }

    updateTopic(topic : any) 
    {
        return this.apiService.post('/common/updateTopic', topic);
    }

    deleteTopic(topic: any) 
    {
        return this.apiService.post('/common/deleteTopic', topic);
    }





    //grade Wise Syllabus
    saveGradeWiseSyllabus(gradeWiseSyllabuse: any) 
    {
        return this.apiService.post('/common/saveGradeWiseSyllabus', gradeWiseSyllabuse);
    }

    getGradeWiseSyllabuses(academicSessionId : number, gradeCategoryId : number, gradeId : number, action : string) 
    {
        return this.apiService.get('/common/getGradeWiseSyllabuses/' + academicSessionId + "/" + gradeCategoryId + "/" + gradeId + '/' + action); 
    }

    updateGradeWiseSyllabus(gradeWiseSyllabus : any) 
    {
        return this.apiService.post('/common/updateGradeWiseSyllabus', gradeWiseSyllabus)
    }

    deleteGradeWiseSyllabus(gradeWiseSyllabus : any) 
    {
        return this.apiService.post('/common/deleteGradeWiseSyllabus', gradeWiseSyllabus); 
    }

    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //Grade Subject
    getGradeSubjects(syllabusId: number, gradeId: number) {
        return this.apiService.get('/common/getGradeSubjects/' + syllabusId + '/' + gradeId);
    }

    getGradeSubject(uuid: string) {
        return this.apiService.get('/common/getGradeSubject/' + uuid);
    }

    saveGradeSubject(gradeSubject: any) {
        return this.apiService.post('/common/createGradeSubject', gradeSubject);
    }

    updateGradeSubject(gradeSubject: any) {
        return this.apiService.post('/common/updateGradeSubject', gradeSubject);
    }

    changeGradeSubjectStatus(uuid: string) {
        return this.apiService.get('/common/changeGradeSubjectStatus/' + uuid);
    }

    deleteGradeSubject(gradeSubject: any) {
        return this.apiService.post('/common/deleteGradeSubject', gradeSubject);
    }

    //Grade Subject Chapter
    getSubjectChapters(subjectUUID: string) {
        return this.apiService.get('/common/getSubjectChapters/' + subjectUUID);
    }

    getSubjectChapter(uuid: string) {
        return this.apiService.get('/common/getSubjectChapter/' + uuid);
    }

    saveSubjectChapter(gradeSubjectChapter: any) {
        return this.apiService.post('/common/createSubjectChapter', gradeSubjectChapter);
    }

    updateSubjectChapter(gradeSubjectChapter: any) {
        return this.apiService.post('/common/updateSubjectChapter', gradeSubjectChapter);
    }

    changeSubjectChapterStatus(uuid: string) {
        return this.apiService.get('/common/changeSubjectChapterStatus/' + uuid);
    }

    deleteSubjectChapter(gradeSubjectChapter: any) {
        return this.apiService.post('/common/deleteSubjectChapter', gradeSubjectChapter);
    }

    //Grade Chapter Topic
    getChapterTopics(chapterUUID: string) {
        return this.apiService.get('/common/getChapterTopics/' + chapterUUID);
    }

    getChapterTopic(uuid: string) {
        return this.apiService.get('/common/getChapterTopic/' + uuid);
    }

    saveChapterTopic(chapterTopic: any) {
        return this.apiService.post('/common/createChapterTopic', chapterTopic);
    }

    updateChapterTopics(chapterTopic: any) {
        return this.apiService.post('/common/updateChapterTopics', chapterTopic);
    }

    changeChapterTopicStatus(uuid: string) {
        return this.apiService.get('/common/changeChapterTopicStatus/' + uuid);
    }

    deleteChapterTopic(chapterTopic: any) {
        return this.apiService.post('/common/deleteChapterTopic', chapterTopic);
    }

    //Material Type & File Type
    getFileTypes() {
        return this.apiService.get('/common/getFileTypes');
    }

    getMaterialTypes() {
        return this.apiService.get('/common/getMaterialTypes');
    }

    getMaterialType(uuid: string) {
        return this.apiService.get('/common/getMaterialType/' + uuid);
    }

    saveMaterialType(materialType: any) {
        return this.apiService.post('/common/saveMaterialType', materialType);
    }

    updateMaterialType(materialType: any) {
        return this.apiService.post('/common/updateMaterialType', materialType);
    }

    deleteMaterialType(materialType: any) {
        return this.apiService.post('/common/deleteMaterialType', materialType);
    }
}
