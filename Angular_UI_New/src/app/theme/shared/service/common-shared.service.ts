import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { FormGroup } from '@angular/forms';
import { IOption } from 'ng-select';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonSharedService 
{
    public baseUrl : string;
    public yearCalenderCardComponentObject = new Subject<any>();
    public userRoleListObject = new Subject<any>();
    public userTypeListObject = new Subject<any>();
    public userListObject = new Subject<any>();
    public studyCenterListObject = new Subject<any>();
    public studyCenterAgreementHistoryDocumentListObject = new Subject<any>();
    public businessPartnerListObject = new Subject<any>();
    public tieUpSchoolListObject = new Subject<any>();
    public businessPartnerCoachContractHistoryDocumentListObject = new Subject<any>();
    public tieUpSchoolContractHistoryDocumentListObject = new Subject<any>();
    public syllabusListObject = new Subject<any>();
    public syllabusGradeCategoryListObject = new Subject<any>();
    public gradeListObject = new Subject<any>();
    public academyEnclosureDocumentListObject = new Subject<any>();
    public businessVerticalListObject = new Subject<any>();
    public tieupSchoolSyllabusListObject = new Subject<any>();
    public countryListObject = new Subject<any>();
    public stateRegionListObject = new Subject<any>();
    public districtListObject = new Subject<any>();
    public cityListObject = new Subject<any>();
    public businessVerticalGroupListObject = new Subject<any>();
    public businessVerticalTypeListObject = new Subject<any>();
    public coachListObject = new Subject<any>();
    public subjectListObject = new Subject<any>();
    public chapterListObject = new Subject<any>();
    public gradeCategoryListObject = new Subject<any>();  
    public schoolSubGroupListObject = new Subject<any>();
    public schoolingGroupListObject = new Subject<any>();   
    public schoolingCategoryListObject = new Subject<any>();
    public academicSessionListObject = new Subject<any>(); 
    public batchTypeListObject = new Subject<any>();
    public schoolingProgramListObject = new Subject<any>();
    public onBoardingLinkListObject = new Subject<any>();
    public topicListObject = new Subject<any>();
    public userModulesListObject = new Subject<any>();
    public currentAcademicYearListObject = new Subject<any>();
    public schoolListObject = new Subject<any>();
    public schoolSchoolingProgramListObject = new Subject<any>();
    public loginUser : any;
  
    constructor() 
    { 
        this.baseUrl = location.origin;
        this.loginUser = JSON.parse(localStorage.getItem('user'));
    }

    public confirmPasswordValidator(controlName: string, matchingControlName: string)
    {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    public prepareSelectOptions(options: Array<IOption>): Array<IOption> {
        return options.map((option) => ({ value: option.value, label: option.label }));
    }

    public convert12HrsTimeFormatPipe(time : any)
    {
        let hour = (time.split(':'))[0]
        let min = (time.split(':'))[1]
        let part = hour >= 12 ? 'PM' : 'AM';
        if(parseInt(hour) == 0)
        hour = 12;
        min = (min+'').length == 1 ? `0${min}` : min;
        hour = hour > 12 ? hour - 12 : hour;
        hour = (hour+'').length == 1 ? `0${hour}` : hour;
        return `${hour}:${min} ${part}`
    }

    public ExcelFormatDownload(formatFor : string) 
    {
        // Create a link element
        const link = document.createElement('a');
    
        // Set the href attribute of the link to the file URL
        link.href = environment.apiUrl + '/common/downloadExcelFormat/' + formatFor;
    
        // Set the download attribute to suggest a filename
        // This is optional and depends on the API response headers
        link.download = '';
    
        // Append the link to the document body
        document.body.appendChild(link);
    
        // Programmatically click the link to trigger the download
        link.click();
    
        // Remove the link from the document
        document.body.removeChild(link);
    }
}
