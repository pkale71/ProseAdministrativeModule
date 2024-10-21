import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiAdminService } from './api-admin.service';
import { of } from 'rxjs';
import { data } from 'jquery';
import { id } from 'date-fns/locale';

@Injectable({ providedIn: 'root' })
export class CommonService {
    constructor(private apiService: ApiService, private apiAdminService : ApiAdminService) { }

//////Admin Portal APIs
    getAcademicSessions()
    {
        return this.apiAdminService.get('/common/getAcademicSessions');
    }

    getSyllabuses(gradeCategoryId : number, action : string)
    {
        return this.apiAdminService.get('/common/getSyllabuses/' + gradeCategoryId + '/' + action);
    }

    getBatchTypes(academicSessionId : number, action : string)
    {
        return this.apiAdminService.get('/common/getBatchTypes/' + academicSessionId + '/' + action);
    }

    getGrades(gradeCategoryId : number, action : string)
    {
        return this.apiAdminService.get('/common/getGrades/' + gradeCategoryId + '/' + action);
    }

    getSchools(action : string)
    {
        return this.apiAdminService.get('/business/getSchools/' + action);
    }

    getSchoolSchoolingPrograms(schoolUUID : string, action : string)
    {
        return this.apiAdminService.get('/business/getSchoolSchoolingPrograms/' + schoolUUID + '/' + action);
    }

    getSubjects(gradeCategoryId : number, gradeId : number, syllabusId : number, action : string)
    {
        return this.apiAdminService.get('/common/getSubjects/' + gradeCategoryId + '/' + gradeId + '/' + syllabusId + '/' + action);
    }
//////////    
    getAppBase(moduleId : number)
    {
        return this.apiService.get('/common/getAppBase/' + moduleId);
    }

    updateStatus(tempJSON: any)
    {
        return this.apiService.post('/common/updateStatus', tempJSON);
    }

    //Tax Type
    getTaxTypes(action : string)
    {
        return this.apiService.get('/common/getTaxTypes/' + action);
    }

    saveTaxType(taxType: any) 
    {
        return this.apiService.post('/common/saveTaxType', taxType);
    }

    updateTaxType(taxType: any) 
    {
        return this.apiService.post('/common/updateTaxType', taxType);
    }

    deleteTaxType(taxType: any) 
    {
        return this.apiService.post('/common/deleteTaxType', taxType);
    }

    //Fee Type
    getFeeTypes(action : string)
    {
        return this.apiService.get('/common/getFeeTypes/' + action);
    }

    saveFeeType(feeType: any) 
    {
        return this.apiService.post('/common/saveFeeType', feeType);
    }

    updateFeeType(feeType: any) 
    {
        return this.apiService.post('/common/updateFeeType', feeType);
    }

    deleteFeeType(feeType: any) 
    {
        return this.apiService.post('/common/deleteFeeType', feeType);
    }

    //Discount Type
    getDiscountTypes(action : string)
    {
        return this.apiService.get('/common/getDiscountTypes/' + action);
    }

    saveDiscountType(discountType: any) 
    {
        return this.apiService.post('/common/saveDiscountType', discountType);
    }

    updateDiscountType(discountType: any) 
    {
        return this.apiService.post('/common/updateDiscountType', discountType);
    }

    deleteDiscountType(discountType: any) 
    {
        return this.apiService.post('/common/deleteDiscountType', discountType);
    }

    //Tax Rate
    getTaxRates(academicSessionId : number, taxTypeId : number, action : string)
    {
        return this.apiService.get('/common/getTaxRates/' + academicSessionId + '/' + taxTypeId + '/' + action);
    }

    saveTaxRate(raxRate: any) 
    {
        return this.apiService.post('/common/saveTaxRate', raxRate);
    }

    updateTaxRate(raxRate: any) 
    {
        return this.apiService.post('/common/updateTaxRate', raxRate);
    }

    deleteTaxRate(raxRate: any) 
    {
        return this.apiService.post('/common/deleteTaxRate', raxRate);
    }

    //Student Document
    getStudentDocuments(action : string)
    {
        return this.apiService.get('/common/getStudentDocuments/' + action);
    }

    saveStudentDocument(raxRate: any) 
    {
        return this.apiService.post('/common/saveStudentDocument', raxRate);
    }

    deleteStudentDocument(raxRate: any) 
    {
        return this.apiService.post('/common/deleteStudentDocument', raxRate);
    }

    //Fee Category
    getFeeCategories(action : string)
    {
        return this.apiService.get('/common/getFeeCategories/' + action);
    }

    saveFeeCategory(feeCategory: any) 
    {
        return this.apiService.post('/common/saveFeeCategory', feeCategory);
    }

    updateFeeCategory(feeCategory: any) 
    {
        return this.apiService.post('/common/updateFeeCategory', feeCategory);
    }

    deleteFeeCategory(feeCategory: any) 
    {
        return this.apiService.post('/common/deleteFeeCategory', feeCategory);
    }

    //Course Exit Reason
    getExitReasonTypes()
    {
        return this.apiService.get('/common/getExitReasonTypes');
    }

    getCourseExitReasons(exitReasonTypeId : number, action : string)
    {
        return this.apiService.get('/common/getCourseExitReasons/' + exitReasonTypeId +'/' + action);
    }

    saveCourseExitReason(courseExitReason: any) 
    {
        return this.apiService.post('/common/saveCourseExitReason', courseExitReason);
    }

    updateCourseExitReason(courseExitReason: any) 
    {
        return this.apiService.post('/common/updateCourseExitReason', courseExitReason);
    }

    deleteCourseExitReason(courseExitReason: any) 
    {
        return this.apiService.post('/common/deleteCourseExitReason', courseExitReason);
    }

    //Grade Section
    getGradeSections(schoolUUID : string, academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, batchTypeId : number, action : string)
    {
        return this.apiService.get('/common/getGradeSections/' + schoolUUID + '/' + academicSessionId + '/' + syllabusId + '/' + gradeCategoryId + '/' + gradeId + '/' + batchTypeId + '/' + action);
    }

    saveGradeSection(gradeSection: any) 
    {
        return this.apiService.post('/common/saveGradeSection', gradeSection);
    }

    deleteGradeSection(gradeSection: any) 
    {
        return this.apiService.post('/common/deleteGradeSection', gradeSection);
    }

    //Subject Group Combination
    getSubjectGroups(syllabusId : number, gradeCategoryId : number, gradeId : number, action : string)
    {
        return this.apiService.get('/common/getSubjectGroups/' + syllabusId + '/' + gradeCategoryId + '/' + gradeId + '/' + action);
    }

    getSubjectGroup(id : number)
    {
        return this.apiService.get('/common/getSubjectGroup/' + id);
    }

    saveSubjectGroup(subjectGroup: any) 
    {
        return this.apiService.post('/common/saveSubjectGroup', subjectGroup);
    }

    updateSubjectGroup(subjectGroup: any) 
    {
        return this.apiService.post('/common/updateSubjectGroup', subjectGroup);
    }

    deleteSubjectGroup(subjectGroup: any) 
    {
        return this.apiService.post('/common/deleteSubjectGroup', subjectGroup);
    }

    getSubjectGroupAllocations(subjectGroupId : number, action : string)
    {
        return this.apiService.get('/common/getSubjectGroupAllocations/' + subjectGroupId + '/' + action);
    }

    updateSubjectGroupAllocation(subjectGroupAllocation: any) 
    {
        return this.apiService.post('/common/updateSubjectGroupAllocation', subjectGroupAllocation);
    }

    deleteSubjectGroupAllocation(subjectGroupAllocation: any) 
    {
        return this.apiService.post('/common/deleteSubjectGroupAllocation', subjectGroupAllocation);
    }

    getCurrencies()
    {
        return this.apiService.get('/common/getCurrencies');
    }

     //Fee Structure
     getFeeStructures(schoolUUID : string, schoolingProgramId : number, academicSessionId : number, batchYearId : number, syllabusId : number, gradeCategoryId : number, action : string)
     {
         return this.apiService.get('/common/getFeeStructures/' + schoolUUID + '/' + schoolingProgramId + '/' + academicSessionId + '/' + batchYearId + '/' + syllabusId  + '/' + gradeCategoryId + '/' + action);
     }
 
     getFeeStructure(uuid : string)
     {
         return this.apiService.get('/common/getFeeStructure/' + uuid);
     }
 
     saveFeeStructure(feeStructure: any) 
     {
         return this.apiService.post('/common/saveFeeStructure', feeStructure);
     }

     deleteFeeStructure(feeStructure: any) 
     {
         return this.apiService.post('/common/deleteFeeStructure', feeStructure);
     }
}
