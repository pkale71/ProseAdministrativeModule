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
    selector: 'app-city-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './city-edit.component.html',
    styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent 
{
    @Input() public modalParams;
    editCityForm: FormGroup;
    countryForm: FormGroup;
    districtForm: FormGroup;
    stateRegionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    searchClicked: boolean;
    searchClickedStateRegion: boolean;
    searchClickedDistrict: boolean;
    city: any;
    countries: any[];
    stateRegions: any[];
    districts: any[];

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
        this.city = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.searchClicked = false;
        this.searchClickedStateRegion = false;
        this.countries = [];
        this.stateRegions = [];
        this.districts = [];

        this.editCityForm = this.formbuilder.group({
            id: [''],
            name: ['',[Validators.required]],
            country: this.formbuilder.group({ 'id' : ['']}),
            stateRegion: this.formbuilder.group({ 'id' : ['']}),
            district: this.formbuilder.group({ 'id' : ['']})
        });  

        this.countryForm = this.formbuilder.group({
            'country' : ['', Validators.required]
        })
        this.stateRegionForm = this.formbuilder.group({
            'stateRegion' : ['', Validators.required]
        })
        this.districtForm = this.formbuilder.group({
            'district' : ['', Validators.required]
        })
        
        this.editCityForm.patchValue(this.city);
        this.countryForm.get('country').setValue(this.city.country.id);
        this.getCountries(this.city.country);
        this.stateRegionForm.get('stateRegion').setValue(this.city.stateRegion.id);
        this.getStateRegions(this.city.stateRegion);
        this.districtForm.get('district').setValue(this.city.district.id);
        this.getDistricts(this.city.district);    
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get country
    async getCountries(country : any) 
    {  
        try
        {
            let response = await this.businessService.getCountries('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.countries = response.countries;
                this.countries.unshift({ id : '', name : 'Select Country'});
                if( country != '')
                {
                    let filterCountry = this.countries.filter(tempCountry => parseInt(tempCountry.id) == parseInt(country.id));
                    if(filterCountry.length == 0)
                    {
                        this.countries.push({ id : country.id, name : country.name });
                    }
                }
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

    // get stateRegion
    async getStateRegions(stateRegion : any) 
    {  
        try
        {
            let countryId = this.countryForm.get('country').value;
            if(countryId != undefined && countryId != '')
            {
                this.searchClickedStateRegion = true;  
                let response = await this.businessService.getStateRegions(countryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.stateRegions = response.stateRegions;
                    this.stateRegions.unshift({ id : '', name : 'All'});
                    this.searchClickedStateRegion = false;
                    if(stateRegion != '')
                    {
                        let filterStateRegion = this.stateRegions.filter(tempStateRegion => parseInt(tempStateRegion.id) == parseInt(stateRegion.id));
                        if(filterStateRegion.length == 0)
                        {
                            this.stateRegions.push({ id : stateRegion.id, name : stateRegion.name });
                        }
                    }
                }
                else
                {
                    this.stateRegions = [];
                    this.stateRegions.unshift({ id : '', name : 'All'});
                    this.searchClickedStateRegion = false;
                }
            }
            else
            {
                this.stateRegions = [];
                this.stateRegions.unshift({ id : '', name : 'All'});
                this.searchClickedStateRegion = false;
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedStateRegion = false;
        }
    }

    // get district
    async getDistricts(district : any) 
    {  
        try
        {
            let countryId = this.countryForm.get('country').value;
            let stateRegionId = this.stateRegionForm.get('stateRegion').value;
            if(countryId != undefined && countryId != '' && stateRegionId != undefined && stateRegionId != '')
            {
                this.searchClickedDistrict = true;  
                let response = await this.businessService.getDistricts(countryId, stateRegionId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.districts = response.districts;
                    this.districts.unshift({ id : '', name : "Select District"});
                    this.searchClickedDistrict = false;
                    if(district != '')
                    {
                        let filterDistrict = this.districts.filter(tempDistrict => parseInt(tempDistrict.id) == parseInt(district.id));
                        if(filterDistrict.length == 0)
                        {
                            this.districts.push({ id : district.id, name : district.name });
                        }
                    }
                }
                else
                {
                    this.districts = [];
                    this.districts.unshift({ id : '', name : "Select District"});
                    this.searchClickedDistrict = false;
                }
            }
            else
            {
                this.districts = [];
                this.districts.unshift({ id : '', name : "Select District"});
                this.searchClickedDistrict = false;
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedDistrict = false;
        }
    }

    async saveCity()
    {
        if(!this.saveClicked)
        {
            if(this.editCityForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.editCityForm.controls['country'].get('id').setValue(this.countryForm.get('country').value);
                this.editCityForm.controls['stateRegion'].get('id').setValue(this.stateRegionForm.get('stateRegion').value);
                this.editCityForm.controls['district'].get('id').setValue(this.districtForm.get('district').value);
                try
                {
                    let response = await this.businessService.updateCity(this.editCityForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "City Updated");
                        this.commonSharedService.cityListObject.next({
                            countryId : this.countryForm.get('country').value,
                            stateRegionId : this.stateRegionForm.get('stateRegion').value,
                            districtId : this.districtForm.get('district').value,
                            result : "success"
                        });
                        this.closeModal();
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
