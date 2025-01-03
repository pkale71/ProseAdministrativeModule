﻿import { Injectable } from '@angular/core';
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

    duplicateEmailMobile(data : any)
    {
        return this.apiService.post('/common/duplicateEmailMobile', data);
    }

    //module
    getModules() 
    {
        return this.apiService.get('/common/getModules');
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

    //schooling program
    saveSchoolingPrograms(schoolingProgram: any) 
    {
        return this.apiService.post('/common/saveSchoolingProgram', schoolingProgram);
    }

    getSchoolingPrograms(academicSessionId : number, action : string) 
    {
        return this.apiService.get('/common/getSchoolingPrograms/' + academicSessionId + '/' + action);  
    }

    deleteSchoolingProgram(schoolingProgram : any) 
    {
        return this.apiService.post('/common/deleteSchoolingProgram', schoolingProgram);
    }

    //Syllabus
    getSyllabuses(academicSessionId : number, schoolingProgramId : number, action : string) 
    {
        return this.apiService.get('/common/getSyllabuses/' + academicSessionId + "/" + schoolingProgramId + '/' + action);  
    }

    saveSyllabus(syllabus: any) 
    {
        return this.apiService.post('/common/saveSyllabus', syllabus);
    }

    deleteSyllabus(syllabus: any) 
    {
        return this.apiService.post('/common/deleteSyllabus', syllabus);
    }

    //grade Category
    savegradeCategory(gradeCategory: any) 
    {
        return this.apiService.post('/common/saveGradeCategory', gradeCategory);
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

    //syllabus wise subjects
    saveSyllabusWiseSubject(syllabusWiseSubject: any) 
    {
        return this.apiService.post('/common/saveSyllabusWiseSubject', syllabusWiseSubject);
    }

    getSyllabusWiseSubjects(academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, action : string) 
    {
        return this.apiService.get("/common/getSyllabusWiseSubjects/" + academicSessionId + '/' + syllabusId + '/' + gradeCategoryId + '/' + gradeId + '/' + action);
    }

    updateSyllabusWiseSubject(syllabusWiseSubject: any) 
    {
        return this.apiService.post('/common/updateSyllabusWiseSubject', syllabusWiseSubject);
    }

    deleteSyllabusWiseSubject(syllabusWiseSubject : any) 
    {
        return this.apiService.post("/common/deleteSyllabusWiseSubject", syllabusWiseSubject);
    }  

    //subject wise chapters
    saveSubjectWiseChapter(subjectWiseChapter : any) 
    {
        return this.apiService.post("/common/saveSubjectWiseChapter", subjectWiseChapter);
    }

    getSubjectWiseChapters(academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, subjectId : number, action : string) 
    {
        return this.apiService.get("/common/getSubjectWiseChapters/" + academicSessionId + '/' + syllabusId + '/' + gradeCategoryId + '/' + gradeId + '/' + subjectId + '/' + action);
    }

    updateSubjectWiseChapter(subjectWiseChapter : any) 
    {
        return this.apiService.post('/common/updateSubjectWiseChapter', subjectWiseChapter);   
    }

    deleteSubjectWiseChapter(subjectWiseChapter : any) 
    {
        return this.apiService.post('/common/deleteSubjectWiseChapter', subjectWiseChapter);   
    }

    //chapter wise topics
    saveChapterWiseTopic(chapterWiseTopic : any) 
    {
        return this.apiService.post('/common/saveChapterWiseTopic', chapterWiseTopic);
    }

    uploadChapterWiseTopics(chapterWiseTopic : any)
    {
        return this.apiService.post('/common/uploadChapterWiseTopics', chapterWiseTopic);
    }

    getChapterWiseTopics(academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, subjectId : number, chapterId : number, action : string) 
    {
        return this.apiService.get('/common/getChapterWiseTopics/' + academicSessionId + '/' + syllabusId + '/' + gradeCategoryId + '/' + gradeId + '/' + subjectId + '/' + chapterId + '/' + action);  
    }

    updateChapterWiseTopic(chapterWiseTopic : any) 
    {
        return this.apiService.post('/common/updateChapterWiseTopic', chapterWiseTopic);
    }

    deleteChapterWiseTopic(chapterWiseTopic: any) 
    {
        return this.apiService.post('/common/deleteChapterWiseTopic', chapterWiseTopic);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //Academic Year
    getAcademicYears() {
        return this.apiService.get('/common/getAcademicYears');
    }

    getAcademicYear(uuid: string) {
        return this.apiService.get('/common/getAcademicYear/' + uuid);
    }

    getCurrentAcademicYear() {
        return this.apiService.get('/common/getCurrentAcademicYear');
    }

    saveAcademicYear(academicYear: any) {
        return this.apiService.post('/common/createAcademicYear', academicYear);
    }

    deleteAcademicYear(academicYear: any) {
        return this.apiService.post('/common/deleteAcademicYear', academicYear);
    }    

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
