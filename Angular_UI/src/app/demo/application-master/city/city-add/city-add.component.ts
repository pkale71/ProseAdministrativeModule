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
    selector: 'app-city-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './city-add.component.html',
    styleUrls: ['./city-add.component.scss']
    })

export class CityAddComponent 
{
    @Input() public modalParams;
    addCityForm: FormGroup;
    countryForm: FormGroup;
    stateRegionForm: FormGroup;
    districtForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    searchClicked: boolean;
    countries: any[];
    stateRegions: any[];
    districts: any[];
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
        this.districts = [];

        this.addCityForm = this.formbuilder.group({
            id:[''],
            name: [''],
            country: this.formbuilder.group({ 'id' : ['']}),
            stateRegion: this.formbuilder.group({ 'id' : ['']}),
            district: this.formbuilder.group({ 'id' : ['']}),
            uploadFile: [''],
            selectedFile: ['']
        });  

        this.countryForm = this.formbuilder.group({
            'country' : ['', Validators.required]
        });
        this.stateRegionForm = this.formbuilder.group({
            'stateRegion' : ['', Validators.required]
        });
        this.districtForm = this.formbuilder.group({
            'district' : ['']
        });

        this.addCityForm.controls['uploadFile'].clearValidators();
        this.addCityForm.controls['name'].addValidators(Validators.required);
        this.addCityForm.updateValueAndValidity();
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
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    // get district
    async getDistricts(action : string) 
    {  
        try
        {
            let countryId = this.countryForm.get('country').value;
            let stateRegionId = this.stateRegionForm.get('stateRegion').value;
            if(countryId != undefined && countryId != '' && stateRegionId != undefined && stateRegionId != '')
            {
                this.searchClicked = true;  
                let response = await this.businessService.getDistricts(countryId, stateRegionId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.districts = response.districts;
                    this.districts.unshift({ id : '', name : "Select District"});
                    this.searchClicked = false;
                }
                else
                {
                    this.districts = [];
                    this.districts.unshift({ id : '', name : "Select District"});
                    this.searchClicked = false;
                }
            }
            else
            {
                this.districts = [];
                this.districts.unshift({ id : '', name : "Select District"});
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

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = event.target.files[0];
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                this.addCityForm.get('selectedFile').setValue(file);
            }       
            else
            {
                this.addCityForm.get('selectedFile').setValue('');
            }         
        }
        else
        {
            this.addCityForm.get('selectedFile').setValue('');
        }
    }

    getChange(event : any)
    {
        this.isChecked = event.target.checked;
        if(this.isChecked)
        {
            this.addCityForm.controls['name'].clearValidators();
            this.addCityForm.controls['uploadFile'].addValidators(Validators.required);
            this.addCityForm.controls['name'].updateValueAndValidity();
            this.addCityForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addCityForm.controls['uploadFile'].clearValidators();
            this.addCityForm.controls['name'].addValidators(Validators.required);
            this.addCityForm.controls['uploadFile'].updateValueAndValidity();
            this.addCityForm.controls['name'].updateValueAndValidity();
        }
    }

    async saveCity()
    {
        if(!this.saveClicked)
        {
            if(this.addCityForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.addCityForm.controls["country"].get('id').setValue(this.countryForm.get('country').value);
                this.addCityForm.controls['stateRegion'].get('id').setValue(this.stateRegionForm.get('stateRegion').value);
                this.addCityForm.controls['district'].get('id').setValue(this.districtForm.get('district').value);
                try
                {
                    if(this.isChecked)
                    {
                        
                        let formData = new FormData();
                        formData.append('country', JSON.stringify({ "id" : this.countryForm.get('country').value }));
                        formData.append('stateRegion', JSON.stringify({ "id" : this.stateRegionForm.get('stateRegion').value }));
                        formData.append('district', JSON.stringify({ "id" : this.districtForm.get('district').value }));
                        formData.append('uploadFile', this.addCityForm.get('selectedFile').value);

                        let response = await this.businessService.uploadCities(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            let totalCount = response?.totalCount;
                            let saved = response?.insertCount;
                            let msg = '';
                            if(totalCount > 0)
                            {
                                msg = saved / totalCount + " Cities Are Saved Successfully. ";
                                let duplicateCount = response?.duplicateCount;
                                if(duplicateCount > 0)
                                {
                                    msg = msg + duplicateCount + " Cities Are Duplicate.";
                                }
                            }  
                            else
                            {
                                msg = "No Record Found.";
                            } 
                            if(totalCount > 0)
                            {
                                this.showNotification("success", msg);
                            }
                            else
                            {
                                this.showNotification("warning", msg);
                            }
                            this.commonSharedService.cityListObject.next({
                                result : "success",
                                countryId : this.countryForm.get('country').value,
                                stateRegionId : this.stateRegionForm.get('stateRegion').value,
                                districtId : this.districtForm.get('district').value
                            });
                            this.closeModal();
                        }
                    }
                    else
                    {
                        let response = await this.businessService.saveCity(this.addCityForm.value).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "City Saved");
                            this.commonSharedService.cityListObject.next({
                                result : "success",
                                countryId : this.countryForm.get('country').value,
                                stateRegionId : this.stateRegionForm.get('stateRegion').value,
                                districtId : this.districtForm.get('district').value
                            });
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
