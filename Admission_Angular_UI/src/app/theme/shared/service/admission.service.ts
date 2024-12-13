import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { data } from 'jquery';
import { id } from 'date-fns/locale';


@Injectable({ providedIn: 'root' })
export class AdmissionService {
    constructor(private apiService: ApiService) { }

//////Admission APIs
    getApplicationTypes()
    {
        return this.apiService.get('/admission/getApplicationTypes');
    }

    getApplicationStatuses()
    {
        return this.apiService.get('/admission/getApplicationStatuses');
    }

    getGenders()
    {
        return this.apiService.get('/admission/getGenders');
    }

    getLeadStudentTypes()
    {
        return this.apiService.get('/admission/getLeadStudentTypes');
    }

    getMarketLeadTypes()
    {
        return this.apiService.get('/admission/getMarketLeadTypes');
    }

    getWalkInModes()
    {
        return this.apiService.get('/admission/getWalkInModes');
    }

    getSiblingTypes()
    {
        return this.apiService.get('/admission/getSiblingTypes');
    }

    getStudentProfileCompletions()
    {
        return this.apiService.get('/admission/getStudentProfileCompletions');
    }

    getParentUndertakings(profileCompletionId : number)
    {
        return this.apiService.get('/admission/getParentUndertakings/' + profileCompletionId);
    }
    
    getPaymentMethods()
    {
        return this.apiService.get('/admission/getPaymentMethods');
    }

    getApplicationStudents(academicSessionId : number)
    {
        return this.apiService.get('/admission/getApplicationStudents/' + academicSessionId);
    }

    getApplicationForms(applicationFor : string, schoolUUID : string, schoolingProgramId : number, academicSessionId : number, applicationFormStatusId : number)
    {
        return this.apiService.get('/admission/getApplicationForms/' + applicationFor + '/' + schoolUUID + '/' + schoolingProgramId + '/' + academicSessionId + '/' + applicationFormStatusId);
    }

    getApplicationStudentProfile(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationStudentProfile/' + uuid);
    }

    getApplicationParentProfile(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationParentProfile/' + uuid);
    }

    getApplicationSubjectGroup(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationSubjectGroup/' + uuid);
    }

    getApplicationFeeStructure(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationFeeStructure/' + uuid);
    }

    getApplicationSportEngagement(uuid : any)
    {
        return this.apiService.get('/admission/getApplicationSportEngagement/' + uuid);
    }

    getApplicationUndergoneEducation(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationUndergoneEducation/' + uuid);
    }

    getApplicationUndertakingDocument(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationUndertakingDocument/' + uuid);
    }

    getApplicationStudentDocuments(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationStudentDocuments/' + uuid);
    }

    getApplicationFeePayments(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationFeePayments/' + uuid);
    }

    saveB2CApplicationForm1(applicationForm : any)
    {
        return this.apiService.post('/admission/saveB2CApplicationForm1', applicationForm);
    }
    
    saveB2CApplicationForm2(applicationForm : any)
    {
        return this.apiService.post('/admission/saveB2CApplicationForm2', applicationForm);
    }

    saveB2CApplicationForm3(applicationForm : any)
    {
        return this.apiService.post('/admission/saveB2CApplicationForm3', applicationForm);
    }

    saveApplicationForm4(applicationForm : any)
    {
        return this.apiService.post('/admission/saveApplicationForm4', applicationForm);
    }

    saveB2CApplicationForm5(applicationForm : any)
    {
        return this.apiService.post('/admission/saveB2CApplicationForm5', applicationForm);
    }

    saveApplicationStudentDocs(studentDoc : any)
    {
        return this.apiService.post('/admission/saveApplicationStudentDocs', studentDoc);
    }

    deleteApplicationDoc(document : any)
    {
        return this.apiService.post('/admission/deleteApplicationDoc', document);
    }

    downloadApplicationDoc(document : any)
    {
        return this.apiService.getPostFile('/admission/downloadApplicationDoc', document);
    }

    updateFeePaymentBankCharges(feePayment : any)
    {
        return this.apiService.post('/admission/updateFeePaymentBankCharges', feePayment);
    }
}
