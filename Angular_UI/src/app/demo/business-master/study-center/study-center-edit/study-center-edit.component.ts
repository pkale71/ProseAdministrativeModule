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
  selector: 'app-study-center-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './study-center-edit.component.html',
  styleUrls: ['./study-center-edit.component.scss']
})
export class StudyCenterEditComponent {
  @Input() public modalParams;
  uuid : string;  
  searchClicked : boolean;
  searchClickedCountry : boolean;
  searchClickedStateRegion : boolean;
  searchClickedDistrict : boolean;
  searchClickedCity : boolean;
  searchClickedRewardType : boolean;
  isCompanyOperated : boolean;
  isPartnerCaptive : boolean;
  editStudyCenterForm : FormGroup;
  countryForm : FormGroup;
  stateRegionForm : FormGroup;
  districtForm : FormGroup;
  cityForm : FormGroup;
  rewardTypeForm : FormGroup;
  businessPartnerForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  countries : any[];
  stateRegions : any[];
  districts : any[];
  cities : any[];
  businessPartners : any[];
  businessPartner : any;
  selectedBusinessPartner : any[];
  studyCenterRewardTypes : any[];
  studyCenter : any;
  studyCenterType : any;
  id : number;

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
  }

  ngOnInit() 
  {
    //get Modal params
    this.uuid = this.modalParams.uuid;
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;
    this.searchClickedCountry = false;
    this.searchClickedStateRegion = false;
    this.searchClickedDistrict = false;
    this.searchClickedCity = false;
    this.searchClickedRewardType = false;
    this.isCompanyOperated = false;
    this.isPartnerCaptive = false;
    this.studyCenterType = [];
    this.countries = [];
    this.stateRegions = [];
    this.districts = [];
    this.cities = [];
    this.studyCenter = [];
    this.studyCenterRewardTypes = [];
    // this.getStudyCenterType(this.id);

    this.editStudyCenterForm = this.formbuilder.group({
      uuid: this.uuid,
      name : ['', Validators.required],
      studyCenterType : [''],
      email : ['', [Validators.required, Validators.email]],
      mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      pincode : ['', Validators.required],
      address : ['', Validators.required],
      country : this.formbuilder.group({ 'id' : ['']}, Validators.required),
      stateRegion : this.formbuilder.group({ 'id' : ['']}),
      district : this.formbuilder.group({ 'id' : ['']}),
      city : this.formbuilder.group({ 'id' : ['']}),
      landlordName : [''],
      contactPersonName : [''],
      contactPersonEmail : [''],
      contactPersonMobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],  
      rewardType : this.formbuilder.group({ 'id' : ['']}),
      panNumber : ['', [Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[A-Za-z]{1}$"), Validators.minLength(10)]],
      gstNumber : ['', [Validators.pattern("^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}$"), Validators.minLength(15)]],
      businessPartner : this.formbuilder.group({ 'uuid' : ['']})
     })

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
    this.rewardTypeForm = this.formbuilder.group({
      'rewardType' : ['']
    })
    this.businessPartnerForm = this.formbuilder.group({
      'businessPartner' : ['']
    })
    
    this.getStudyCenter(this.uuid);
    this.getStudyCenterRewardTypes();
    this.getStudyCenterValidation();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

    async getStudyCenter(uuid : string) 
    {
        this.searchClicked = true;
        let response = await this.businessService.getStudyCenter(uuid).toPromise(); 
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.studyCenter = response.studyCenter;
            this.editStudyCenterForm.patchValue(this.studyCenter);
            this.countryForm.get('country').setValue(this.studyCenter.country.id);
            this.getCountries(this.studyCenter.country);
            this.stateRegionForm.get('stateRegion').setValue(this.studyCenter.stateRegion.id);
            this.getStateRegions(this.studyCenter.stateRegion);
            this.districtForm.get('district').setValue(this.studyCenter.district.id);
            this.getDistricts(this.studyCenter.district);
            this.cityForm.get('city').setValue(this.studyCenter.city.id);
            this.getCities(this.studyCenter.city);
            if(this.studyCenter.studyCenterType.name == 'Company Operated')
            {
                this.rewardTypeForm.get('rewardType').setValue(this.studyCenter.rewardType.id);
            }
            if(this.studyCenter.studyCenterType.name == 'Partner Captive')
            {
                this.businessPartnerForm.get('businessPartner').setValue(this.studyCenter.businessPartner.uuid);
                this.getBusinessPartners(this.studyCenter.businessPartner);
            }
        }
        else
        {
            this.studyCenter = [];
            this.searchClicked = false;
        }
    }

    //get country
    async getCountries(country : any) 
    {  
        try
        {
            this.searchClickedCountry = true
            let response = await this.businessService.getCountries('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.countries = response.countries;
                this.countries.unshift({ id : '', name : 'Select Country'});
                this.searchClickedCountry = false;
                // here check deactive country
                if(country != '')
                {
                    let filterCountry = this.countries.filter(tempCountry =>  parseInt(tempCountry.id) == parseInt(country.id) );
                    if(filterCountry.length == 0)
                    {
                        this.countries.push({ id : country?.id, name : country?.name});
                    }
                }
            }
            else
            { 
                this.countries = [];
                this.countries.unshift({ id : '', name : 'Select Country'});
                this.searchClickedCountry = false;

            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedCountry = false;
        }
    }
 
    //get state/region
    async getStateRegions(stateRegion : any) 
    {  
        try
        {
            let countryId = this.countryForm.get('country').value;
            if(countryId != undefined && countryId != "")
            {
                this.searchClickedStateRegion = true;  
                let response = await this.businessService.getStateRegions(countryId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                { 
                    this.stateRegions = response.stateRegions;
                    this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                    this.searchClickedStateRegion = false;
                    // here check deactive stateregion
                    if(stateRegion != '')
                    {
                        let filterStateRegion = this.stateRegions.filter(tempStateRegion => parseInt(tempStateRegion.id) == parseInt(stateRegion.id));
                        if(filterStateRegion.length == 0)
                        {
                            this.stateRegions.push({ id : stateRegion?.id, name : stateRegion?.name});
                        }
                    }
                }
                else
                {
                    this.stateRegions = [];
                    this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                    this.searchClickedStateRegion = false;
                }
            }
            else
            {
                this.stateRegions = [];
                this.stateRegions.unshift({ id : '', name : 'Select State/Region'});     
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
                let response = await this.businessService.getDistricts(countryId, stateRegionId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.districts = response.districts;
                    this.districts.unshift({ id : '', name : "Select District"});
                    this.searchClickedDistrict = false;
                    // here check deactive district
                    if(district != '')
                    {
                        let filterDistrict = this.districts.filter(tempDistrict => parseInt(tempDistrict.id) == parseInt(district.id));
                        if(filterDistrict.length == 0)
                        {
                            this.districts.push({ id : district?.id, name : district?.name });
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

   //get city
    async getCities(city : any) 
    {  
        try
        {
            let countryId = this.countryForm.get('country').value;
            let stateRegionId = this.stateRegionForm.get('stateRegion').value;
            let districtId = this.districtForm.get('district').value;
            if(countryId != undefined && countryId != '' && stateRegionId != undefined && stateRegionId != '' && districtId != undefined && districtId != '')
            {
                this.searchClickedCity = true;  
                let response = await this.businessService.getCities(countryId, stateRegionId, districtId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.cities = response.cities;
                    this.cities.unshift({ id : '', name : "Select City"});
                    this.searchClickedCity = false;
                    // here check deactive city
                    if(city != '')
                    {
                        
                        let filterCity = this.cities.filter(tempCity => { return parseInt(tempCity.id) == parseInt(city.id)})
                        if(filterCity.length == 0)
                        {
                            this.cities.push({ id : city?.id, name : city?.name });
                        }
                    }
                }
                else
                {
                    this.cities = [];
                    this.cities.unshift({ id : '', name : "Select City"});
                    this.searchClickedCity = false;
                } 
            }
            else
            {
                this.cities = [];
                this.cities.unshift({ id : '', name : "Select City"});
                this.searchClickedCity = false;
            }   
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedCity = false;
        }
    }

   //get study center reward type
    async getStudyCenterRewardTypes() 
    {  
        try
        {
            this.searchClickedRewardType = true;
            let response = await this.businessService.getStudyCenterRewardTypes().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.studyCenterRewardTypes = response.studyCenterRewardTypes;
                this.studyCenterRewardTypes.unshift({ id : '', name : 'Select Reward Type'});
                this.searchClickedRewardType = false;
            }
            else
            { 
                this.studyCenterRewardTypes = [];
                this.studyCenterRewardTypes.unshift({ id : '', name : 'Select Reward Type'});
                this.searchClickedRewardType = false;
            }   
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedRewardType = false;
        }
    }
   
     // get get business partners (with business partner type id -  optional)
    async getBusinessPartners(businessPartner : any) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.businessService.getBusinessPartners(0, 'Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            { 
                this.businessPartners =  response.businessPartners;
                this.businessPartners.unshift({ id : '', name : 'Select Business Partner'});        
                this.searchClicked = false;
                // here check deactive business partner
                if(businessPartner != '')
                {
                    let filterBusinessPartner = this.businessPartners.filter(tempBusinessPartner => tempBusinessPartner.uuid == businessPartner.uuid);
                    if(filterBusinessPartner.length == 0)
                    {
                        this.businessPartners.push({ uuid : businessPartner?.uuid, name : businessPartner?.name}); 
                    }
                }
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    getStudyCenterValidation()
    {
        if(this.studyCenterType.name == 'Company Operated')
        {
            this.isCompanyOperated = true;
            this.editStudyCenterForm.controls['landlordName'].addValidators(Validators.required);
            this.editStudyCenterForm.controls['contactPersonName'].addValidators(Validators.required);
            this.editStudyCenterForm.controls['contactPersonEmail'].addValidators(Validators.required);
            this.editStudyCenterForm.controls['contactPersonMobile'].addValidators(Validators.required);
            this.editStudyCenterForm.controls['rewardType'].addValidators(Validators.required);
            this.editStudyCenterForm.controls['panNumber'].addValidators(Validators.required);
            this.editStudyCenterForm.controls['gstNumber'].addValidators(Validators.required);
        }
        else
        {
            this.isCompanyOperated = false;
            this.editStudyCenterForm.controls['landlordName'].removeValidators(Validators.required);
            this.editStudyCenterForm.controls['contactPersonName'].removeValidators(Validators.required);
            this.editStudyCenterForm.controls['contactPersonEmail'].removeValidators(Validators.required);
            this.editStudyCenterForm.controls['contactPersonMobile'].removeValidators(Validators.required);
            this.editStudyCenterForm.controls['rewardType'].removeValidators(Validators.required);
            this.editStudyCenterForm.controls['panNumber'].removeValidators(Validators.required);
            this.editStudyCenterForm.controls['gstNumber'].removeValidators(Validators.required);
        }
        if(this.studyCenterType.name == 'Partner Captive')
        {
            this.isPartnerCaptive = true;
            this.businessPartnerForm.controls['businessPartner'].addValidators(Validators.required);
        }
        else
        {
            this.isPartnerCaptive = false;
            this.businessPartnerForm.controls['businessPartner'].removeValidators(Validators.required);
        }
    }

    async saveStudyCenter()
    {
        if(!this.saveClicked)
        {
            if(this.editStudyCenterForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid )
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let tempJson = {
                        uuid : this.studyCenter.uuid,
                        studyCenterType : {"id" : this.studyCenter.studyCenterType.id},
                        name : this.editStudyCenterForm.get('name').value,
                        email : this.editStudyCenterForm.get('email').value,
                        mobile : this.editStudyCenterForm.get('mobile').value,
                        address : this.editStudyCenterForm.get('address').value,
                        pincode : this.editStudyCenterForm.get('pincode').value,
                        country : { "id" : this.countryForm.get('country').value},
                        stateRegion : { "id" : this.stateRegionForm.get('stateRegion').value},
                        district : { "id" : this.districtForm.get('district').value},
                        city : { "id" : this.cityForm.get('city').value},
                        landlordName : this.studyCenter.studyCenterType.name == 'Company Operated' ? this.editStudyCenterForm.get('landlordName').value : '',
                        contactPersonName : this.studyCenter.studyCenterType.name == 'Company Operated' ? this.editStudyCenterForm.get('contactPersonName').value : '',
                        contactPersonEmail : this.studyCenter.studyCenterType.name == 'Company Operated' ? this.editStudyCenterForm.get('contactPersonEmail').value : '',
                        contactPersonMobile : this.studyCenter.studyCenterType.name == 'Company Operated' ? this.editStudyCenterForm.get('contactPersonMobile').value : '',
                        rewardType : this.studyCenter.studyCenterType.name == 'Company Operated' ? { "id" : this.rewardTypeForm.get('rewardType').value} : {'id' : ''},
                        panNumber : this.studyCenter.studyCenterType.name == 'Company Operated' ? this.editStudyCenterForm.get('panNumber').value : '',
                        gstNumber : this.studyCenter.studyCenterType.name == 'Company Operated' ? this.editStudyCenterForm.get('gstNumber').value : '',
                        businessPartner : this.studyCenter.studyCenterType.name == 'Partner Captive' ? { "uuid" : this.businessPartnerForm.get('businessPartner').value} : {'uuid' : ''}
                    }
                    let response = await this.businessService.updateStudyCenter(tempJson).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Study Center Updated");
                        this.closeModal();
                        this.saveClicked = false;
                        this.isValidForm = false;
                        this.router.navigateByUrl("/business/studyCenter/detail/" + this.uuid);
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
