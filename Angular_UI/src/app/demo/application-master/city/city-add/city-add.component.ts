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
  masterCountries: any[];
  countries: any[];
  stateRegions: any[];
  masterStateRegion: any[];
  districts: any[];
  masterDistrict: any[];
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
    this.masterCountries = [];
    this.stateRegions = [];
    this.masterStateRegion = [];
    this.districts = [];
    this.masterDistrict = [];

    this.addCityForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
      country: this.formbuilder.group({ 'id' : ['']}),
      stateRegion: this.formbuilder.group({ 'id' : ['']}),
      district: this.formbuilder.group({ 'id' : ['']})
      // file: ['']
    });  

    this.countryForm = this.formbuilder.group({
      'country' : ['', Validators.required]
    })

    this.stateRegionForm = this.formbuilder.group({
      'stateRegion' : ['', Validators.required]
    })

    this.districtForm = this.formbuilder.group({
      'district' : ['']
    })

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
          this.masterStateRegion = response.stateRegions;
          this.stateRegions = this.masterStateRegion;
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
