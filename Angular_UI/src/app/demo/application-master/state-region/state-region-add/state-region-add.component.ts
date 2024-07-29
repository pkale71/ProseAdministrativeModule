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
    selector: 'app-state-region-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './state-region-add.component.html',
    styleUrls: ['./state-region-add.component.scss']
})
export class StateRegionAddComponent 
{
    @Input() public modalParams;
    addStateRegionForm: FormGroup;
    countryForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    countries: any[];
    isChecked: boolean;

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
        this.countries = [];

        this.addStateRegionForm = this.formbuilder.group({
        id:[''],
        name: [''],
        country: this.formbuilder.group({ 'id' : ['']}),
        uploadFile: [''],
        selectedFile: ['']
        });  

        this.countryForm = this.formbuilder.group({
        'country' : ['', Validators.required]
        });

        this.addStateRegionForm.controls['uploadFile'].clearValidators();
        this.addStateRegionForm.controls['name'].addValidators(Validators.required);
        this.addStateRegionForm.updateValueAndValidity();
        this.getCountries('All');
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get country
    async getCountries(action : string) 
    {  
        try
        {
            let response = await this.businessService.getCountries('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.countries = response.countries;
                this.countries.unshift({ id : '', name : 'Select Country'});
            }
            else
            { 
                this.countries = [];
                this.countries.unshift({ id : '', name : 'Select Country'});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
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
            this.addStateRegionForm.controls['name'].clearValidators();
            this.addStateRegionForm.controls['uploadFile'].addValidators(Validators.required);
            this.addStateRegionForm.controls['name'].updateValueAndValidity();
            this.addStateRegionForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addStateRegionForm.controls['uploadFile'].clearValidators();
            this.addStateRegionForm.controls['name'].addValidators(Validators.required);
            this.addStateRegionForm.controls['uploadFile'].updateValueAndValidity();
            this.addStateRegionForm.controls['name'].updateValueAndValidity();
        }
    }

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = (event.target.files[0])
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                this.addStateRegionForm.get('selectedFile').setValue(file);
            }
            else
            {
                this.addStateRegionForm.get('selectedFile').setValue('');
            }
        }
        else
        {
            this.addStateRegionForm.get('selectedFile').setValue('');
        }
    }

    async saveStateRegion()
    {
        if(!this.saveClicked)
        {
            if(this.addStateRegionForm.valid && this.countryForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.addStateRegionForm.controls["country"].get('id').setValue(this.countryForm.get('country').value);
                try
                {
                    if(this.isChecked)
                    {
                        const formData = new FormData();
                        formData.append('country', JSON.stringify({ "id" : this.countryForm.get('country').value })); 
                        formData.append('uploadFile', this.addStateRegionForm.get('selectedFile').value); 
                        let response = await this.businessService.uploadStateRegions(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "State/Region Saved");
                            this.commonSharedService.stateRegionListObject.next({
                                countryId : this.countryForm.get('country').value,
                                result : "success"});
                            this.closeModal();
                        }
                    }  
                    else
                    {
                        let tempJSON = {
                            country : { "id" : this.countryForm.get('country').value },
                            name : this.addStateRegionForm.get('name').value
                        }
                        let response = await this.businessService.saveStateRegion(tempJSON).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "State/Region Saved");
                            this.commonSharedService.stateRegionListObject.next({
                                countryId : this.countryForm.get('country').value,
                                result : "success"});
                            this.closeModal();
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
            else
            {
                this.isValidForm = false;
                this.saveClicked = false;
            }
        }
    }

    closeModal()
    {
        this.activeModal.close(); 
    }
}
