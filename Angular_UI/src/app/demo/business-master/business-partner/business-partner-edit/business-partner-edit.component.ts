import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';
import { IOption, SelectModule } from 'ng-select';
import { BusinessService } from 'src/app/theme/shared/service/business.service';

@Component({
  selector: 'app-business-partner-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './business-partner-edit.component.html',
  styleUrls: ['./business-partner-edit.component.scss']
})
export class BusinessPartnerEditComponent {
  @Input() public modalParams;
  uuid : string;  
  isRequiredContract : boolean;
  isRequiredPanGst : boolean;
  isRequiredReward : boolean;
  searchClicked : boolean;
  editBusinessPartnerForm: FormGroup;
  countryForm : FormGroup;
  stateRegionForm : FormGroup;
  districtForm : FormGroup;
  cityForm : FormGroup;
  businessVerticalForm : FormGroup;
  businessVerticalTypeForm : FormGroup;
  commissionTermForm : FormGroup;
  commercialTermForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  countries : any[];
  stateRegions : any[];
  districts : any[];
  cities : any[];
  businessVerticals : any[];
  businessPartnerTypes : any[];
  commissionTerms : any[];
  commercialTerms : any[];
  businessPartner : any;
  businessVerticalTypeIds : Array<IOption>;
  isRewardApplicables : any[];

  constructor(
    private commonService: CommonService, 
    private businessService: BusinessService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    private router : Router,
    private route: ActivatedRoute,
    public commonSharedService : CommonSharedService,
   ) 
  {
    this.isRewardApplicables = [{
      "id": 1,
      "name": "Yes"
      },
      {
        "id": 0,
        "name": "No"
      }]
  }

  ngOnInit() 
  {
    //get Modal params
    this.uuid = this.modalParams.uuid;
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;
    this.isRequiredContract = false;
    this.isRequiredPanGst = false;
    this.isRequiredReward = false;

    this.editBusinessPartnerForm = this.formbuilder.group({
      uuid: this.uuid,
      name : ['', Validators.required],
      businessPartnerType : [{ id : ''}],
      email : ['', [Validators.required, Validators.email]],
      pincode : ['', Validators.required],
      address : ['', Validators.required],
      country : this.formbuilder.group({ 'id' : ['']}),
      stateRegion : this.formbuilder.group({ 'id' : ['']}),
      district : this.formbuilder.group({ 'id' : ['']}),
      city : this.formbuilder.group({ 'id' : ['']}),
      businessVertical : this.formbuilder.group({ 'id' : ['']}),
      businessVerticalTypeIds : ['', Validators.required],
      contactPerson : ['', Validators.required],
      contactEmail : ['', Validators.required],
      contactMobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],  
      inchargePerson : [''],
      inchargeEmail : [''],
      inchargeMobile : [''],  
      applicableFrom: ['', Validators.required],
      applicableTo: ['', Validators.required],
      rewardApplicable : ['', Validators.required],
      panNumber : ['', [Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[A-Za-z]{1}$"), Validators.minLength(10)]],
      gstNumber : ['', [Validators.pattern("^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}$"), Validators.minLength(15)]],
      commissionTerm : this.formbuilder.group({ 'id' : ['']}),
      commercialTerm : this.formbuilder.group({ 'id' : ['']})
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
    this.cityForm = this.formbuilder.group({
      'city' : ['', Validators.required]
    })
    this.businessVerticalForm = this.formbuilder.group({
      'businessVertical' : ['', Validators.required]
    })
    this.businessVerticalTypeForm = this.formbuilder.group({
      'businessVerticalTypeIds' : ['', Validators.required]
    })
    this.commissionTermForm = this.formbuilder.group({
      'commissionTerm' : ['']
    })
    this.commercialTermForm = this.formbuilder.group({
      'commercialTerm' : ['']
    })

    this.getBusinessPartner(this.uuid); 
    this.getCountries('Active');
    this.getBusinessVerticals('Active');
    this.getBusinessVerticalTypes('Active');
    this.getReferralPartner();
    this.getCommissionTerms();
    this.getCommercialTerms();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getBusinessPartner(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getBusinessPartner(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.businessPartner = response.businessPartner;
      this.editBusinessPartnerForm.patchValue(this.businessPartner);
      this.countryForm.get('country').setValue(this.businessPartner.country.id);
      this.stateRegionForm.get('stateRegion').setValue(this.businessPartner.stateRegion.id);
      this.districtForm.get('district').setValue(this.businessPartner.district.id);
      this.cityForm.get('city').setValue(this.businessPartner.city.id);
      this.businessVerticalForm.get('businessVertical').setValue(this.businessPartner.businessVertical.id);
      let businessVerticalTypes : any = [];
      for(let j = 0; j<this.businessPartner.businessVerticalTypes.length; j++)
      {
        businessVerticalTypes.push(this.businessPartner.businessVerticalTypes[j].id.toString());
      }
      this.businessVerticalTypeForm.get('businessVerticalTypeIds').setValue(businessVerticalTypes);
      if(this.editBusinessPartnerForm.controls['rewardApplicable'].value == 1)
      {
        this.getReferralPartner();
        this.commissionTermForm.get('commissionTerm').setValue(this.businessPartner.commissionTerm.id);
      }
      this.commercialTermForm.get('commercialTerm').setValue(this.businessPartner.commercialTerm.id);
      this.searchClicked = false;
    }
    else
    {
      this.businessPartner = [];
      this.searchClicked = false;
    }
  }

  //get country
  async getCountries(action : string) 
  {  
    try
    {
      let response = await this.businessService.getCountries('Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.countries = response.countries;
        this.countries.unshift({ id : '', name : 'Select Country'});
        this.getStateRegions('Active');
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
        let response = await this.businessService.getStateRegions(countryId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          this.stateRegions = response.stateRegions;
          this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
          this.getDistricts('Active');
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
        let response = await this.businessService.getDistricts(countryId, stateRegionId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.districts = response.districts;
          this.districts.unshift({ id : '', name : "Select District"});
          this.getCities('Active');
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

   //get city
  async getCities(action : string) 
  {  
    try
    {
      let countryId = this.countryForm.get('country').value;
      let stateRegionId = this.stateRegionForm.get('stateRegion').value;
      let districtId = this.districtForm.get('district').value;
      if(countryId != undefined && countryId != '' && stateRegionId != undefined && stateRegionId != '' && districtId != undefined && districtId != '')
      {
        this.searchClicked = true;  
        let response = await this.businessService.getCities(countryId, stateRegionId, districtId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.cities = response.cities;
          this.cities.unshift({ id : '', name : "Select City"});
          this.searchClicked = false;
        }
        else
        {
          this.cities = [];
          this.cities.unshift({ id : '', name : "Select City"});
          this.searchClicked = false;
        } 
      }
      else
      {
        this.cities = [];
        this.cities.unshift({ id : '', name : "Select City"});
        this.searchClicked = false;
      }   
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  // get business vertical
  async getBusinessVerticals(action : string) 
  {  
    try
    {
      let response = await this.businessService.getBusinessVerticals('Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      { 
        this.businessVerticals = response.businessVerticals;
        this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
        this.getBusinessVerticalTypes('Active');
      }
      else
      {
        this.businessVerticals = [];
        this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }
  
  //get business vertical type
  async getBusinessVerticalTypes(action : string) 
  {  
    try
    {
      let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
      if(businessVerticalId != undefined && businessVerticalId != "")
      {
        this.searchClicked = true; 
        let tempBusinessVerticalTypes : Array<IOption> = [];
        let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, 0, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          let businessVerticalTypeIds : any[] = response.businessVerticalTypes;
          for(let i = 0; i < businessVerticalTypeIds.length; i++)
          {
            tempBusinessVerticalTypes.push({
              'value' : businessVerticalTypeIds[i].id.toString(),
              'label' : businessVerticalTypeIds[i].name
            })
          }
          this.businessVerticalTypeIds = this.commonSharedService.prepareSelectOptions(tempBusinessVerticalTypes);
          this.searchClicked = false;
        }
      } 
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  async getCommissionTerms()
  {
    try
    {
      let response = await this.businessService.getCommissionTerms().toPromise();
      if(response.status_code == 200 && response.message == 'success')
      {
        this.commissionTerms = response.commissionTerms;
        this.commissionTerms.unshift({ id : '', name : 'Select Commission Term'});
      }
      else
      {
        this.commissionTerms = [];
        this.commissionTerms.unshift({ id : '', name : 'Select Commission Term'});
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  // get Commercial Terms
  async getCommercialTerms()
  {
    try
    {
      let response = await this.businessService.getCommercialTerms().toPromise();
      if(response.status_code == 200 && response.message == 'success')
      {
        this.commercialTerms = response.commercialTerms;
        this.commercialTerms.unshift({ id : '', name : 'Select Commercial Term'});
      }
      else
      {
        this.commercialTerms = [];
        this.commercialTerms.unshift({ id : '', name : 'Select Commercial Term'});
      }
    }
    catch(e)
    {
      this.showNotification('error', e);
    }
  }
 
  getReferralPartner()
  {
    if(this.editBusinessPartnerForm.controls['rewardApplicable'].value == 1)
    {
      this.isRequiredReward = true;
      this.commissionTermForm.controls['commissionTerm'].enable();
      this.commissionTermForm.controls['commissionTerm'].addValidators(Validators.required);
      this.commissionTermForm.updateValueAndValidity();
    }
    else
    {
      this.isRequiredReward = false;
      this.commissionTermForm.controls['commissionTerm'].setValue('');
      this.commissionTermForm.controls['commissionTerm'].disable();
      this.commissionTermForm.controls['commissionTerm'].clearValidators();
    }  
  }

  async saveBusinessPartner()
  {
    if(!this.saveClicked)
    {
      if(this.editBusinessPartnerForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid && this.businessVerticalForm.valid && this.businessVerticalTypeForm.valid || ((this.businessPartner.businessPartnerType.code == 'B2C' && this.editBusinessPartnerForm.controls['rewardApplicable'].value == 1  && this.commissionTermForm.valid)||(this.businessPartner.businessPartnerType.code == 'B2C' && this.editBusinessPartnerForm.controls['rewardApplicable'].value == 0)) || (this.businessPartner.businessPartnerType.code == 'B2B' && this.commercialTermForm.valid))
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let tempJson = {
            uuid : this.businessPartner.uuid,
            name : this.editBusinessPartnerForm.get('name').value,
            email : this.editBusinessPartnerForm.get('email').value,
            address : this.editBusinessPartnerForm.get('address').value,
            pincode : this.editBusinessPartnerForm.get('pincode').value,
            contactPerson : this.editBusinessPartnerForm.get('contactPerson').value,
            contactEmail : this.editBusinessPartnerForm.get('contactEmail').value,
            contactMobile : this.editBusinessPartnerForm.get('contactMobile').value,
            inchargePerson : this.editBusinessPartnerForm.get('inchargePerson').value,
            inchargeEmail : this.editBusinessPartnerForm.get('inchargeEmail').value,
            inchargeMobile : this.editBusinessPartnerForm.get('inchargeMobile').value,
            applicableFrom : this.editBusinessPartnerForm.get('applicableFrom').value,
            applicableTo : this.editBusinessPartnerForm.get('applicableTo').value,
            rewardApplicable : this.businessPartner.businessPartnerType.code == 'B2C' ? this.editBusinessPartnerForm.get('rewardApplicable').value : '',
            panNumber : this.editBusinessPartnerForm.get('panNumber').value,
            gstNumber : this.editBusinessPartnerForm.get('gstNumber').value,
            businessPartnerType : { "id" : this.businessPartner.businessPartnerType.id},
            country : { "id" : this.countryForm.get('country').value},
            stateRegion : { "id" : this.stateRegionForm.get('stateRegion').value},
            district : { "id" : this.districtForm.get('district').value},
            city : { "id" : this.cityForm.get('city').value},
            businessVertical : { "id" : this.businessVerticalForm.get('businessVertical').value},
            businessVerticalTypeIds : this.businessVerticalTypeForm.get('businessVerticalTypeIds').value.toString(),   
            commissionTerm : { "id" : this.businessPartner.businessPartnerType.code == 'B2C' ? this.commissionTermForm.get('commissionTerm').value : ''},         
            commercialTerm : { "id" : this.businessPartner.businessPartnerType.code == 'B2B' ? this.commercialTermForm.get('commercialTerm').value : ''},         
          }
          let response = await this.businessService.updateBusinessPartner(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Partner Updated");
            this.closeModal();
            this.saveClicked = false;
            this.isValidForm = false;
            this.router.navigateByUrl("/business/businessPartner/detail/" + this.uuid);
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