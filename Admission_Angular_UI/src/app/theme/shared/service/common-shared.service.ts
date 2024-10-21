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
    public adminBaseUrl : string;
    public yearCalenderCardComponentObject = new Subject<any>();
    public userListObject = new Subject<any>();
    public currentAcademicYearListObject = new Subject<any>();
    public loginUser : any;
    ////////////////
    public taxTypeListObject = new Subject<any>();
    public feeTypeListObject = new Subject<any>();
    public discountTypeListObject = new Subject<any>();
    public taxRateListObject = new Subject<any>();
    public studentDocumentListObject = new Subject<any>();
    public feeCategoryListObject = new Subject<any>();
    public courseExitReasonListObject = new Subject<any>();
    public gradeSectionListObject = new Subject<any>();
    public subjectGroupListObject = new Subject<any>();
    public subjectGroupAllocationListObject = new Subject<any>();
    public feeStructureListObject = new Subject<any>();

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

    public removeCommaSeperatedString(inputString : string, removeString : string)
    {
        // Convert the input string into an array by splitting at commas
        let items = inputString.toString().split(',');

        // Remove all instances of the removeString from the array
        items = items.filter(item => item.trim() !== removeString.trim());

        // Join the array back into a string with commas and trim any extra spaces
        let result = items.join(',').trim();

        // If the result is empty or only contains commas, return an empty string
        if (result === '' || result === ',') {
            result = '';
        }

        return result;
    }

    public getOrdinal(n : number,  extraText : string) 
    {
        let suffix = "th";
        if (n % 100 < 11 || n % 100 > 13) 
        {
            switch (n % 10) 
            {
                case 1: suffix = "st"; break;
                case 2: suffix = "nd"; break;
                case 3: suffix = "rd"; break;
            }
        }
        return `${n}${suffix} ${extraText}`;
    }
}
