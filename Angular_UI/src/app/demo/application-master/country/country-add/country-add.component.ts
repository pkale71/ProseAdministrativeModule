import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';

@Component({
    selector: 'app-country-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './country-add.component.html',
    styleUrls: ['./country-add.component.scss']
})
export class CountryAddComponent 
{
    @Input() public modalParams;
    addCountryForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    isChecked : boolean;

    constructor(private businessService: BusinessService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        )
    {
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.isChecked = false;

        this.addCountryForm = this.formbuilder.group({
            id:[''],
            name: [''],
            uploadFile: [''],
            selectedFile: ['']
        });  

        this.addCountryForm.controls['uploadFile'].clearValidators();
        this.addCountryForm.controls['name'].addValidators(Validators.required);
        this.addCountryForm.updateValueAndValidity();
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getDocuments(formatFor : string) 
    {  
        try
        {
            this.commonSharedService.ExcelFormatDownload(formatFor);      
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    getChange(event : any)
    {
        this.isChecked = event.target.checked;
        if(this.isChecked)
        {
            this.addCountryForm.controls['name'].clearValidators();
            this.addCountryForm.controls['uploadFile'].addValidators(Validators.required);
            this.addCountryForm.controls['name'].updateValueAndValidity();
            this.addCountryForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addCountryForm.controls['uploadFile'].clearValidators();
            this.addCountryForm.controls['name'].addValidators(Validators.required);
            this.addCountryForm.controls['name'].updateValueAndValidity();
            this.addCountryForm.controls['uploadFile'].updateValueAndValidity();
        }
    }

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = event.target.files[0];
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {  
                this.addCountryForm.get('selectedFile').setValue(file);
            }
            else
            {
                this.addCountryForm.get('selectedFile').setValue('');
            }    
        }
        else
        {
            this.addCountryForm.get('selectedFile').setValue('');
        } 
    }

    async saveCountry()
    {
        try
        { 
            if(!this.saveClicked)
            {      
                if(this.addCountryForm.valid)
                { 
                    this.isValidForm = true;
                    this.saveClicked = true;
                    if(this.isChecked)
                    { 
                        let formData = new FormData();
                        formData.append('uploadFile', this.addCountryForm.get('selectedFile').value);
                        let response = await this.businessService.uploadCountries(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            let totalCount = response?.totalCount;
                            let saved = response?.insertCount;
                            let msg = "";
                            if( totalCount > 0)
                            {
                                msg = saved / totalCount + " Countries Are Saved Successfully. ";
                                let duplicateCount = response?.duplicateCount;
                                if( duplicateCount > 0)
                                {
                                    msg = msg + duplicateCount + " Countries Are Duplicate.";
                                }
                            }
                            else
                            {
                                msg = "No Record Found";
                            }    
                            if(totalCount > 0)
                            {
                                this.showNotification("success", msg);
                            }
                            else
                            {
                                this.showNotification("warning", msg);
                            }
                            this.commonSharedService.countryListObject.next({result : "success"});
                            this.closeModal();
                        }
                    }    
                    else
                    { 
                        this.isValidForm = true;
                        this.saveClicked = true;
                        let tempJSON = {
                            name : this.addCountryForm.get('name').value,
                        }
                        let response = await this.businessService.saveCountry(tempJSON).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "Country Saved");
                            this.commonSharedService.countryListObject.next({result : "success"});
                            this.closeModal();
                        }
                    }  
                }
                else
                {
                    this.isValidForm = false;
                    this.saveClicked = false;
                }
            }       
        } 
        catch(e)
        {
            this.showNotification("error", e);
            this.isValidForm = false;
            this.saveClicked = false;
        } 
    }

    closeModal()
    {
        this.activeModal.close(); 
    }
}
