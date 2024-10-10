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
        return this.apiAdminService.get('/common//getAcademicSessions');
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
}
