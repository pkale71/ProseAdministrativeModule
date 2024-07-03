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
  city: any;
  masterCountries: any[];
  countries: any[];
  stateRegions: any[];
  masterStateRegions: any[];
  districts: any[];
  masterDistrict: any[];

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
    this.countries = [];
    this.masterCountries = [];
    this.stateRegions = [];
    this.masterStateRegions = [];
    this.districts = [];
    this.masterDistrict = [];

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
    this.stateRegionForm.get('stateRegion').setValue(this.city.stateRegion.id);
    this.districtForm.get('district').setValue(this.city.district.id);
    this.getCountries('All');
    this.getStateRegions('All');
    this.getDistricts('All');    
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
          this.masterCountries = response.countries;
          this.countries = this.masterCountries;
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

  // get stateRegion
  async getStateRegions(action : string) 
  {  
    try
    {
      let countryId = this.countryForm.get('country').value;
      if(countryId != undefined && countryId != '')
      {
        this.searchClicked = true;  
        let response = await this.businessService.getStateRegions(countryId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterStateRegions = response.stateRegions;
          this.stateRegions = this.masterStateRegions;
          this.stateRegions.unshift({ id : '', name : 'All'});
          this.searchClicked = false;
        }
        else
        {
          this.stateRegions = [];
          this.stateRegions.unshift({ id : '', name : 'All'});
          this.searchClicked = false;
        }
      }
      else
      {
        this.stateRegions = [];
        this.stateRegions.unshift({ id : '', name : 'All'});
        this.searchClicked = false;
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
      if(countryId != undefined && countryId != '')
      {
        this.searchClicked = true;  
        let response = await this.businessService.getDistricts(countryId, stateRegionId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterDistrict = response.districts;
          this.districts = this.masterDistrict;
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
