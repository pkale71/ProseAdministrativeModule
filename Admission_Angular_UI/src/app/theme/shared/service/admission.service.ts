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

    getApplicationFeeStructure(uuid : string)
    {
        return this.apiService.get('/admission/getApplicationFeeStructure/' + uuid);
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
}
