import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataTablesModule } from 'angular-datatables';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { event } from 'jquery';
import { IOption, SelectModule } from 'ng-select';

@Component({
  selector: 'app-business-partner-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule, DataTablesModule],
  templateUrl: './business-partner-add.component.html',
  styleUrls: ['./business-partner-add.component.scss']
})
export class BusinessPartnerAddComponent {
  searchClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  isTrusted : boolean;
  isChecked : boolean;
  addBusinessPartnerForm : FormGroup;
  countryForm : FormGroup;
  stateRegionForm : FormGroup;
  districtForm : FormGroup;
  cityForm : FormGroup;
  businessVerticalForm : FormGroup;
  businessVerticalTypeForm : FormGroup;
  commissionTermForm : FormGroup;
  commercialTermForm : FormGroup;
  businessPartnerType : any;
  id : number;
  countries : any[];
  stateRegions : any[];
  districts : any[];
  cities : any[];
  businessVerticals : any[];
  businessVerticalTypes : Array<IOption>;
  businessPartnerTypes : any[];
  isHavingContracts : any[];
  commissionTerms : any[];
  commercialTerms : any[];

  constructor(private notifier: NotifierService, 
    private commonService : CommonService,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService, 
    public commonSharedService : CommonSharedService,
    private location : Location, 
    private route: ActivatedRoute,
    private businessService: BusinessService
       )
    {
       this.id = this.route.params['value'].id;

       this.isHavingContracts = [{
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
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;
    this.isTrusted = false;
    this.isChecked = false;
    this.businessPartnerType = [];
    this.countries = [];
    this.stateRegions = [];
    this.districts = [];
    this.cities = [];
    this.businessVerticals = [];
    // this.businessVerticalTypes = [];
    this.commissionTerms = [];
    this.commercialTerms = [];
    this.getBusinessPartnerType(this.id);

    this.addBusinessPartnerForm = this.formbuilder.group({
      name : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      pincode : ['', Validators.required],
      address : ['', Validators.required],
      country : this.formbuilder.group({ 'id' : ['']}),
      stateRegion : this.formbuilder.group({ 'id' : ['']}),
      district : this.formbuilder.group({ 'id' : ['']}),
      businessVertical : this.formbuilder.group({ 'id' : ['']}),
      businessVerticalType : this.formbuilder.group({ 'id' : ['']}),
      contactPerson : ['', Validators.required],
      contactEmail : ['', Validators.required],
      contactMobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],  
      inchargePerson : [''],
      inchargeEmail : [''],
      inchargeMobile : [''],  
      applicableFrom: ['', Validators.required],
      applicableTo: ['', Validators.required],
      isHavingContract : ['', Validators.required], 
      contractFrom : ['', Validators.required],
      contractTo : ['', Validators.required],
      rewardApplicable : ['', Validators.required],
      commissionTerm : this.formbuilder.group({ 'id' : ['']}),
      commercialTerm : this.formbuilder.group({ 'id' : ['']}),
    })

    this.addBusinessPartnerForm.get('isHavingContract').setValue("0");
    this.addBusinessPartnerForm.get('rewardApplicable').setValue("0")

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
      'businessVerticalType' : ['', Validators.required]
    })
    this.commissionTermForm = this.formbuilder.group({
      'commissionTerm' : ['', Validators.required]
    })
    this.commercialTermForm = this.formbuilder.group({
      'commercialTerm' : ['', Validators.required]
    })

    this.getCountries('Active');
    this.getBusinessVerticals('Active');
    this.getCommissionTerms();
    this.getCommercialTerms();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }
  
  async getBusinessPartnerType(id : number)
  {
    try 
    {
      let response = await this.businessService.getBusinessPartnerType(id).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.businessPartnerType = response.businessPartnerType;
      }
      else
      {
        this.businessPartnerType = [];
      }
    } 
    catch (error) 
    {
      this.showNotification("error", error);
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
          let businessVerticalTypes : any[] = response.businessVerticalTypes;
          for(let i = 0; i < businessVerticalTypes.length; i++)
          {
            tempBusinessVerticalTypes.push({
              'value' : businessVerticalTypes[i].id.toString(),
              'label' : businessVerticalTypes[i].name
            })
          }
          this.businessVerticalTypes = this.commonSharedService.prepareSelectOptions(tempBusinessVerticalTypes);
          this.searchClicked = false;
        }
        else
        {
          this.searchClicked = false;
        }
      }
      else
      {
        this.searchClicked = false;
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  //get business partner type
  // async getBusinessPartnerTypes()
  // {
  //   try 
  //   {
  //     let response = await this.businessService.getBusinessPartnerTypes().toPromise();
  //     if (response.status_code == 200 && response.message == 'success') 
  //     {
  //       this.businessPartnerTypes = response.businessPartnerTypes;
  //       this.businessPartnerTypes.unshift({ id : "", name : "Select Business Partner Type"});
  //     }
  //     else
  //     {
  //       this.businessPartnerTypes = [];
  //       this.businessPartnerTypes.unshift({ id : "", name : "Select Business Partner Type"});
  //     }
  //   } 
  //   catch (error) 
  //   {
  //     this.showNotification("error", error);
  //   }
  // }

  // get Commission Terms
 
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

  getChange(event : any)
  {
    this.isTrusted = event.isTrusted; 
    // this.isTrusted = !this.isTrusted;
    console.log(event.isTrusted)
    this.isChecked = event.target.checked;
  }

  back()
  {
    this.location.back();
  }

  async saveBusinessPartner() 
  {
    if (!this.saveClicked) 
      {
      if (this.addBusinessPartnerForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid && this.businessVerticalForm.valid && this.businessVerticalTypeForm.valid) 
        {
        this.isValidForm = true;
        this.saveClicked = true;
        try 
        {
          let formData = new FormData();
          formData.append('name',this.addBusinessPartnerForm.get('name').value);
          formData.append('email', this.addBusinessPartnerForm.get('email').value);
          formData.append('pincode', this.addBusinessPartnerForm.get('pincode').value);
          formData.append('address', this.addBusinessPartnerForm.get('address').value);
          formData.append('country', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('country').value}));
          formData.append('stateRegion', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('stateRegion').value}));
          formData.append('district', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('district').value}));
          formData.append('city', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('city').value}));
          formData.append('businessVertical', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('businessVertical').value}));
          formData.append('businessVerticalType', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('businessVerticalType').value}));
          formData.append('commissionTerm', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('commissionTerm').value}));
          formData.append('commercialTerm', JSON.stringify({ 'id' : this.addBusinessPartnerForm.get('commercialTerm').value}));
          let response = await this.businessService.saveBusinessPartner(this.addBusinessPartnerForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
            {
            this.showNotification("success", "Business Partner Saved");
            this.commonSharedService.businessPartnerListObject.next({ 
              result: "success", 
              responseData : {
               
              }
             });
          }
        }
        catch (e) 
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

  updateStatus(userModule : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (userModule.isActive == 1 ? 'de-active' : 'active') + ' the user module?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : userModule.id,
            tableName : userModule.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Module Updated");
            this.commonSharedService.businessPartnerListObject.next({
              result : "success"
            });
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }
}
