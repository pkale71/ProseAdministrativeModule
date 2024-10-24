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
    selector: 'app-district-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './district-edit.component.html',
    styleUrls: ['./district-edit.component.scss']
})
export class DistrictEditComponent 
{
    @Input() public modalParams;
    editDistrictForm: FormGroup;
    countryForm: FormGroup;
    stateRegionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    searchClicked: boolean;
    districts: any;
    countries: any[];
    stateRegions: any[];

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
        this.districts = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.countries = [];
        this.stateRegions = [];

        this.editDistrictForm = this.formbuilder.group({
            id: [''],
            name: ['',[Validators.required]],
            country: this.formbuilder.group({ 'id' : ['']}),
            stateRegion: this.formbuilder.group({ 'id' : ['']})
        });  

        this.countryForm = this.formbuilder.group({
            'country' : ['', Validators.required]
        });
        this.stateRegionForm = this.formbuilder.group({
            'stateRegion' : ['', Validators.required]
        });
        
        this.editDistrictForm.patchValue(this.districts);
        this.countryForm.get('country').setValue(this.districts.country.id);
        this.getCountries(this.districts.country);
        this.stateRegionForm.get('stateRegion').setValue(this.districts.stateRegion.id);
        this.getStateRegions(this.districts.stateRegion);
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
                //here access deactive data
                if(country != '')
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
                this.searchClicked = true;  
                let response = await this.businessService.getStateRegions(countryId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.stateRegions = response.stateRegions;
                    this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                    this.searchClicked = false;
                    // here access deactivate data
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

    async saveDistrict()
    {
        if(!this.saveClicked)
        {
            if(this.editDistrictForm.valid && this.countryForm.valid && this.stateRegionForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.editDistrictForm.controls['country'].get('id').setValue(this.countryForm.get('country').value);
                this.editDistrictForm.controls['stateRegion'].get('id').setValue(this.stateRegionForm.get('stateRegion').value);
                try
                {
                    let response = await this.businessService.updateDistrict(this.editDistrictForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "District Updated");
                        this.commonSharedService.districtListObject.next({
                            countryId : this.countryForm.get('country').value,
                            stateRegionId : this.stateRegionForm.get('stateRegion').value,
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
