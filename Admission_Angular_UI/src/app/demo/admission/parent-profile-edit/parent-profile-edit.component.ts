import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-parent-profile-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './parent-profile-edit.component.html',
  styleUrls: ['./parent-profile-edit.component.scss']
})
export class ParentProfileEditComponent 
{
  @Input() public modalParams;
  updateParentProfileForm: FormGroup;
  parentCountryForm : FormGroup;
  parentStateForm : FormGroup;
  parentDistrictForm : FormGroup;
  parentCityForm : FormGroup;
  isValidForm: boolean;
  parentCountries : any[];
  parentStates : any[];
  parentDistricts : any[];
  parentCities : any[];
  saveClicked : boolean;
  parentCountryClicked : boolean;
  parentStateClicked : boolean;
  parentDistrictClicked : boolean;
  parentCityClicked : boolean;

  constructor(
  private admissionService: AdmissionService, 
  private commonService : CommonService,
  private activeModal: NgbActiveModal,
  private notifier: NotifierService,
  private formbuilder: FormBuilder,
  public commonSharedService : CommonSharedService,
  private cdRef: ChangeDetectorRef)
  {
    this.isValidForm = false;
    this.parentCountryClicked = false;
    this.parentStateClicked = false;
    this.parentDistrictClicked = false;
    this.parentCityClicked = false;
    this.parentCountries = [];
    this.parentStates = [];
    this.parentDistricts = [];
    this.parentCities = [];
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.parentCountryForm = this.formbuilder.group({
      parentCountry:['', Validators.required]
    });

    this.parentStateForm = this.formbuilder.group({
      parentState:['', Validators.required]
    });

    this.parentDistrictForm = this.formbuilder.group({
      parentDistrict:['', Validators.required]
    });

    this.parentCityForm = this.formbuilder.group({
      parentCity:['', Validators.required]
    });

    this.updateParentProfileForm = this.formbuilder.group({
      id: ['', Validators.required],
      name:['', [Validators.required]],
      relationship: ['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]],
      mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      aadharNumber : ['', [Validators.required, Validators.pattern('^[0-9]{12,12}$'), Validators.minLength(12)]],
      panNumber : [''],
      passportNumber : [''],
      address : ['', Validators.required],
      country: this.formbuilder.group({ 'id': ['', Validators.required] }),
      state: this.formbuilder.group({ 'id': ['', Validators.required] }),
      district: this.formbuilder.group({ 'id': ['', Validators.required] }),
      city: this.formbuilder.group({ 'id': ['', Validators.required] }),
      pincode : ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$'), Validators.minLength(5)]]
    });  
    //////////////////
    this.getCountries("Active", this.modalParams.parentProfile?.country);
    this.getStateRegions('Active', this.modalParams.parentProfile?.country?.id, this.modalParams.parentProfile?.state?.id, this.modalParams.parentProfile?.state);
    this.getDistricts('Active', this.modalParams.parentProfile?.country?.id, this.modalParams.parentProfile?.state?.id, this.modalParams.parentProfile?.district?.id, this.modalParams.parentProfile?.district);
    this.getCities('Active', this.modalParams.parentProfile?.country?.id, this.modalParams.parentProfile?.state?.id, this.modalParams.parentProfile?.district?.id, this.modalParams.parentProfile?.city?.id, this.modalParams.parentProfile?.city);

    this.updateParentProfileForm.patchValue(this.modalParams.parentProfile);
    this.parentCountryForm.get("parentCountry").setValue(this.updateParentProfileForm.controls["country"].get("id").value);
    this.parentStateForm.get("parentState").setValue(this.updateParentProfileForm.controls["state"].get("id").value);
    this.parentDistrictForm.get("parentDistrict").setValue(this.updateParentProfileForm.controls["district"].get("id").value);
    this.parentCityForm.get("parentCity").setValue(this.updateParentProfileForm.controls["city"].get("id").value);
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

    //get country
  async getCountries(action : string, selCountry : any) 
  {  
      try
      {
          this.parentCountryClicked = true;
          let response = await this.commonService.getCountries(action).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.parentCountries = response.countries;
              if(selCountry != "")
              {
                let filterCountry = this.parentCountries.filter(country=>country.id === selCountry?.id);
                if(filterCountry.length == 0)
                {
                  this.parentCountries.push({ id : selCountry?.id, name : selCountry?.name});    
                }
              }
              this.parentCountries.unshift({ id : '', name : 'Select Country'});
              this.parentCountryClicked = false;
          }
          else
          { 
              this.parentCountries = [];
              this.parentCountries.unshift({ id : '', name : 'Select Country'});
              this.parentCountryClicked = false;
          }
      }
      catch(e)
      {
          this.showNotification("error", e);
          this.parentCountries = [];
          this.parentCountryClicked = false;
      }
  }
  
  //get state/region
  async getStateRegions(action : string, countryId : number, selId : number = 0, selState : any) 
  {  
    try
    {
      if(countryId != undefined && countryId > 0)
      {
        this.parentStateClicked = true;  
        this.parentStateForm.get("parentState").setValue("");
        
        let response = await this.commonService.getStateRegions(countryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          this.parentStates = response.stateRegions;
          if(selState != "")
          {
            let filterState = this.parentStates.filter(state=>state.id === selState?.id);
            if(filterState.length == 0)
            {
              this.parentStates.push({ id : selState?.id, name : selState?.name});    
            }
          }
          this.parentStates.unshift({ id : '', name : 'Select State/Region'});
        ///Detect Change
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
          this.parentStateClicked = false;

          if(selId > 0)
          {
            this.parentStateForm.get("parentState").setValue(selId);
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }
        }
        else
        {
          this.parentStates = [];
          this.parentStates.unshift({ id : '', name : 'Select State/Region'});
          this.parentStateClicked = false;
        }
      }
      else
      {
        this.parentStates = [];
        this.parentStates.unshift({ id : '', name : 'Select State/Region'});
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.parentStateClicked = false;
    }
  }
  
  // get district
  async getDistricts(action : string, countryId : number, stateRegionId : number, selId : number = 0, selDistrict : any) 
  {  
    try
    {
      if(countryId != undefined && countryId > 0 && stateRegionId != undefined && stateRegionId > 0)
      {
        this.parentDistrictClicked = true;  
        this.parentDistrictForm.get("parentDistrict").setValue("");
        
        let response = await this.commonService.getDistricts(countryId, stateRegionId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          this.parentDistricts = response.districts;
          if(selDistrict != "")
          {
            let filterDistrict = this.parentDistricts.filter(district=>district.id === selDistrict?.id);
            if(filterDistrict.length == 0)
            {
              this.parentDistricts.push({ id : selDistrict?.id, name : selDistrict?.name});    
            }
          }
          this.parentDistricts.unshift({ id : '', name : 'Select District'});
          ///Detect Change
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
          this.parentDistrictClicked = false;
          
          if(selId > 0)
          {
            this.parentDistrictForm.get("parentDistrict").setValue(selId);
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }
        }
        else
        {
          this.parentDistricts = [];
          this.parentDistricts.unshift({ id : '', name : 'Select District'});
          this.parentDistrictClicked = false;
        }
      }
      else
      {
        this.parentDistricts = [];
        this.parentDistricts.unshift({ id : '', name : 'Select District'});
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.parentDistrictClicked = false;
    }
  }

  //get city
  async getCities(action : string, countryId : number, stateRegionId : number, districtId : number, selId : number = 0, selCity : any) 
  {  
    try
    {
      if(countryId != undefined && countryId > 0 && stateRegionId != undefined && stateRegionId > 0 && districtId != undefined && districtId > 0)
      {
        this.parentCityClicked = true;  
        this.parentCityForm.get("parentCity").setValue("");
        let response = await this.commonService.getCities(countryId, stateRegionId, districtId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          this.parentCities = response.cities;
          if(selCity != "")
          {
            let filterCity = this.parentCities.filter(city=>city.id === selCity?.id);
            if(filterCity.length == 0)
            {
              this.parentCities.push({ id : selCity?.id, name : selCity?.name});    
            }
          }
          this.parentCities.unshift({ id : '', name : 'Select City'});
          ///Detect Change
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
          this.parentCityClicked = false;
          
          if(selId > 0)
          {
            this.parentCityForm.get("parentCity").setValue(selId);
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }
        }
        else
        {
          this.parentCities = [];
          this.parentCities.unshift({ id : '', name : 'Select City'});
          this.parentCityClicked = false;
        }
      }
      else
      {
        this.parentCities = [];
        this.parentCities.unshift({ id : '', name : 'Select City'});
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.parentCityClicked = false;
    }
  }

  async saveParentProfile()
  {
    if(!this.saveClicked)
    {
      if(this.updateParentProfileForm.valid && this.parentCountryForm.valid && this.parentStateForm.valid && this.parentDistrictForm.valid && this.parentCityForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          this.updateParentProfileForm.controls["country"].get("id").setValue(this.parentCountryForm.get("parentCountry").value);
          this.updateParentProfileForm.controls["state"].get("id").setValue(this.parentStateForm.get("parentState").value);
          this.updateParentProfileForm.controls["district"].get("id").setValue(this.parentDistrictForm.get("parentDistrict").value);
          this.updateParentProfileForm.controls["city"].get("id").setValue(this.parentCityForm.get("parentCity").value);

          let response = await this.admissionService.updateParentProfile(this.updateParentProfileForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Parent Profile Saved");
              this.commonSharedService.updateProfileObject.next({result : "success", action : "Parent"});
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
