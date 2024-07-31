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
  selector: 'app-district-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './district-add.component.html',
  styleUrls: ['./district-add.component.scss']
})
export class DistrictAddComponent 
{
    @Input() public modalParams;
    addDistrictForm: FormGroup;
    countryForm: FormGroup;
    stateRegionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    searchClicked: boolean;
    countries: any[];
    stateRegions: any[];
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
        this.searchClicked = false;
        this.countries = [];
        this.stateRegions = [];

        this.addDistrictForm = this.formbuilder.group({
            id:[''],
            name: [''],
            country: this.formbuilder.group({ 'id' : ['']}),
            stateRegion: this.formbuilder.group({ 'id' : ['']}),
            uploadFile: [''],
            selectedFile: ['']
        });  

        this.countryForm = this.formbuilder.group({
            'country' : ['', Validators.required]
        });
        this.stateRegionForm = this.formbuilder.group({
            'stateRegion' : ['', Validators.required]
        });

        this.addDistrictForm.controls['uploadFile'].clearValidators();
        this.addDistrictForm.controls['name'].addValidators(Validators.required);
        this.addDistrictForm.updateValueAndValidity();
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

    //get state/region
    async getStateRegions(action : string) 
    {  
        try
        { 
            let countryId = this.countryForm.get('country').value;
            if(countryId != undefined && countryId != "")
            {
                this.searchClicked = true; 
                let response = await this.businessService.getStateRegions(countryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.stateRegions = response.stateRegions;
                    this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                    this.searchClicked = false;
                }
                else
                {
                    this.stateRegions = [];
                    this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                    this.searchClicked = false;
                }
            }
            else
            {
                this.stateRegions = [];
                this.stateRegions.unshift({ id : '', name : 'Select State/Region'});   
                this.searchClicked = false;       
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
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
            this.addDistrictForm.controls['name'].clearValidators();
            this.addDistrictForm.controls['uploadFile'].addValidators(Validators.required);
            this.addDistrictForm.controls['name'].updateValueAndValidity();
            this.addDistrictForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addDistrictForm.controls['uploadFile'].clearValidators();
            this.addDistrictForm.controls['name'].addValidators(Validators.required);
            this.addDistrictForm.controls['uploadFile'].updateValueAndValidity();
            this.addDistrictForm.controls['name'].updateValueAndValidity();
        }
    }

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = event.target.files[0];
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                this.addDistrictForm.get('selectedFile').setValue(file);
            }
            else
            {
                this.addDistrictForm.get('selectedFile').setValue('');
            }
        }
        else
        {
            this.addDistrictForm.get('selectedFile').setValue('');
        }
    }

    async saveDistrict()
    {
        if(!this.saveClicked)
        {
            if(this.addDistrictForm.valid && this.countryForm.valid && this.stateRegionForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.addDistrictForm.controls["country"].get('id').setValue(this.countryForm.get('country').value);
                this.addDistrictForm.controls['stateRegion'].get('id').setValue(this.stateRegionForm.get('stateRegion').value);
                try
                {
                    if(this.isChecked)
                    {
                        let formData = new FormData();
                        formData.append('country', JSON.stringify({ "id" : this.countryForm.get('country').value })); 
                        formData.append('stateRegion', JSON.stringify({ "id" : this.stateRegionForm.get('stateRegion').value }));
                        formData.append('uploadFile', this.addDistrictForm.get('selectedFile').value); 

                        let response = await this.businessService.uploadDistricts(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            let totalCount = response?.totalCount;
                            let saved = response?.insertCount;
                            let msg = "";
                            if( parseInt(totalCount) > 0)
                            {
                                msg = saved / totalCount + " Districts Are Saved Successfully. ";
                                let duplicateCount = response?.duplicateCount;
                                if( duplicateCount > 0)
                                {
                                    msg = msg + duplicateCount + " Districts Are Duplicate.";
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
                            this.commonSharedService.districtListObject.next({
                                result : "success",
                                countryId : this.countryForm.get('country').value,
                                stateRegionId : this.stateRegionForm.get('stateRegion').value
                            });
                            this.closeModal();
                        }
                    }  
                    else
                    {
                        let tempJSON = {
                            country : { "id" : this.countryForm.get('country').value},
                            stateRegion : { "id" : this.stateRegionForm.get('stateRegion').value},
                            name : this.addDistrictForm.get('name').value
                        }
                        console.log(tempJSON);
                        let response = await this.businessService.saveDistrict(tempJSON).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "State Region Saved");
                            this.commonSharedService.districtListObject.next({
                                countryId : this.countryForm.get('country').value,
                                stateRegionId : this.stateRegionForm.get('stateRegion').value,
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
