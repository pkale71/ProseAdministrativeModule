import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IOption, SelectModule } from 'ng-select';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './school-edit.component.html',
  styleUrls: ['./school-edit.component.scss']
})
export class SchoolEditComponent {
  @Input() public modalParams;
  uuid : string;
  searchClicked1 : boolean;
  searchClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  editSchoolForm : FormGroup;
  countryForm : FormGroup;
  stateRegionForm : FormGroup;
  districtForm : FormGroup;
  cityForm : FormGroup;
  schoolingGroupForm : FormGroup;
  schoolSubGroupForm : FormGroup;
  schoolingCategoryForm : FormGroup;
  deliveryModeForm : FormGroup;
  school : any;
  countries : any[];
  stateRegions : any[];
  districts : any[];
  cities : any[];
  schoolingGroups = [];
  schoolSubGroups = [];
  schoolingCategories = [];
  deliveryModes = [];
  isExistDetail : number;

  constructor(private notifier: NotifierService, 
    private commonService : CommonService,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private activeModal: NgbActiveModal,
    private userService: UserService, 
    private modalService: NgbModal, 
    public commonSharedService : CommonSharedService,
    private location : Location, 
    private route: ActivatedRoute,
    private router : Router,
    private businessService: BusinessService
  )
  {
  }

  ngOnInit() 
  {
    this.uuid = this.modalParams.uuid;
    this.isExistDetail = this.modalParams.isExistDetail;
    this.isValidForm = true;
    this.searchClicked1 = false;
    this.searchClicked = false;
    this.saveClicked = false;
    this.countries = [];
    this.stateRegions = [];
    this.schoolingGroups = [];
    this.schoolSubGroups = [];
    this.schoolingCategories = [];
    this.districts = [];
    this.cities = [];

    this.editSchoolForm = this.formbuilder.group({
      uuid : ['', Validators.required],
      code : ['', Validators.required],
      name : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      mobile1 : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      mobile2 : ['', [Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      landline1 : ['', [Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      landline2 : ['', [Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      pincode : ['', Validators.required],
      address : ['', Validators.required],
      contractFrom : [''],
      contractTo : [''],
      website : ['', [
          Validators.pattern("^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*?$")
          ]],
      
      country : this.formbuilder.group({ 'id' : ['']}),
      stateRegion : this.formbuilder.group({ 'id' : ['']}),
      district : this.formbuilder.group({ 'id' : ['']}),
      city : this.formbuilder.group({ 'id' : ['']}),
      schoolingGroup : this.formbuilder.group({ 'id' : ['']}),
      schoolingCategory : this.formbuilder.group({ 'id' : ['']}),      
      schoolSubGroup : this.formbuilder.group({ 'id' : ['']}),
      deliveryMode : this.formbuilder.group({ 'id' : ['']}),
      logoFile : ['']
    });

    this.countryForm = this.formbuilder.group({
      'country' : ['', Validators.required]
    });
    this.stateRegionForm = this.formbuilder.group({
        'stateRegion' : ['', Validators.required]
    });
    this.districtForm = this.formbuilder.group({
        'district' : ['', Validators.required]
    });
    this.cityForm = this.formbuilder.group({
        'city' : ['', Validators.required]
    });
    this.schoolingGroupForm = this.formbuilder.group({
        'schoolingGroup' : ['', Validators.required]
    });
    this.schoolSubGroupForm = this.formbuilder.group({
      'schoolSubGroup' : ['', Validators.required]
    });
    this.schoolingCategoryForm = this.formbuilder.group({
      'schoolingCategory' : ['', Validators.required]
    });
    this.deliveryModeForm = this.formbuilder.group({
      'deliveryMode' : ['', Validators.required]
    });

    this.getDeliveryModes();
    this.pathFormValue(this.uuid);
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async pathFormValue(uuid : string)
  {
    try
    {
      let response = await this.businessService.getSchool(uuid).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.school = response.school;
        this.editSchoolForm.patchValue(this.school);
        if(this.isExistDetail > 0)
        {
          this.schoolingCategoryForm.controls["schoolingCategory"].disable();
        }
        this.schoolingGroupForm.get("schoolingGroup").setValue(this.school.schoolingGroup?.id);
        this.getSchoolingGroups('Active', this.school.schoolingGroup);
        this.schoolSubGroupForm.get("schoolSubGroup").setValue(this.school.schoolSubGroup?.id);
        this.getSchoolSubGroups('Active', this.school.schoolSubGroup);
        this.schoolingCategoryForm.get("schoolingCategory").setValue(this.school.schoolingCategory?.id);
        this.getSchoolingCategories('Active', this.school.schoolingCategory);
        this.countryForm.get("country").setValue(this.school.country?.id);
        this.getCountries('Active', this.school.country);
        this.stateRegionForm.get("stateRegion").setValue(this.school.stateRegion?.id);
        this.getStateRegions('Active', this.school.stateRegion);
        this.districtForm.get("district").setValue(this.school.district?.id);
        this.getDistricts('Active', this.school.district);
        this.cityForm.get("city").setValue(this.school.city?.id);
        this.getCities('Active', this.school.city);
        this.deliveryModeForm.get("deliveryMode").setValue(this.school.deliveryMode?.id);
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  //get delivery modes
  async getDeliveryModes() 
  {  
    try
    {
        let response = await this.businessService.getDeliveryModes().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.deliveryModes = response.deliveryModes;
            this.deliveryModes.unshift({ id : '', name : 'Select Delivery Mode'});
        }
        else
        { 
            this.deliveryModes = [];
            this.deliveryModes.unshift({ id : '', name : 'Select Delivery Mode'});
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
    }
  }

  //get country
  async getCountries(action : string, country : any) 
  {  
    try
    {
        let response = await this.businessService.getCountries(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.countries = response.countries;
            this.countries.unshift({ id : '', name : 'Select Country'});
            // here check deactive country
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
  
  //get state/region
  async getStateRegions(action : string, stateRegion : any) 
  {  
    try
    {
        let countryId = this.countryForm.get('country').value;
        if(countryId != undefined && countryId != "")
        {
            this.searchClicked = true;  
            let response = await this.businessService.getStateRegions(countryId, action).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            { 
                this.stateRegions = response.stateRegions;
                this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                // here check deactive state region
                if(stateRegion != '')
                {
                    let filterStateRegion = this.stateRegions.filter(tempStateRegion => parseInt(tempStateRegion.id) == parseInt(stateRegion.id));
                    if(filterStateRegion.length == 0)
                    {
                        this.stateRegions.push({ id : stateRegion.id, name : stateRegion.name });
                    } 
                }
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
  async getDistricts(action : string, district : any) 
  {  
    try
    {
        let countryId = this.countryForm.get('country').value;
        let stateRegionId = this.stateRegionForm.get('stateRegion').value;
        if(countryId != undefined && countryId != '' && stateRegionId != undefined && stateRegionId != '')
        {
            this.searchClicked = true;  
            let response = await this.businessService.getDistricts(countryId, stateRegionId, action).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.districts = response.districts;
                this.districts.unshift({ id : '', name : "Select District"});
                // here check deactive district
                if(district != '')
                {
                    let filterDistrict = this.districts.filter(tempDistrict => parseInt(tempDistrict.id) == parseInt(district.id));
                    if(filterDistrict.length == 0)
                    {
                        this.districts.push({ id : district.id, name : district.name });
                    } 
                }
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
  async getCities(action : string, city : any) 
  {  
    try
    {
        let countryId = this.countryForm.get('country').value;
        let stateRegionId = this.stateRegionForm.get('stateRegion').value;
        let districtId = this.districtForm.get('district').value;
        if(countryId != undefined && countryId != '' && stateRegionId != undefined && stateRegionId != '' && districtId != undefined && districtId != '')
        {
            this.searchClicked = true;  
            let response = await this.businessService.getCities(countryId, stateRegionId, districtId, action).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.cities = response.cities;
                this.cities.unshift({ id : '', name : "Select City"});
                // here check deactive city
                if(city != '')
                {
                    let filterCity = this.cities.filter(tempCity => parseInt(tempCity.id) == parseInt(city.id));
                    if(filterCity.length == 0)
                    {
                        this.cities.push({ id : city.id, name : city.name });
                    }
                }
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

  // get schooling group
  async getSchoolingGroups(action : string, selSchoolingGroup : any) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getSchoolingGroups(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingGroups = response.schoolingGroups;
            this.schoolingGroups.unshift({ id : '', name : 'Select Schooling Group'});
            if(selSchoolingGroup != "")
            {
              let tempSchoolingGroup = this.schoolingGroups.filter(schoolingGroup => schoolingGroup.id === selSchoolingGroup?.id);
              if(tempSchoolingGroup.length == 0)
              {
                this.schoolingGroups.push(selSchoolingGroup);
              }
            }
            this.searchClicked = false;
        }
        else
        {
            this.schoolingGroups = [];
            this.schoolingGroups.unshift({ id : '', name : 'Select Schooling Group'});
            this.searchClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
    }
  }

  // get school sub-group
  async getSchoolSubGroups(action : string, selSchoolSubGroup : any) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getSchoolSubGroups(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolSubGroups = response.schoolSubGroups;
            this.schoolSubGroups.unshift({ id : '', name : 'Select School Sub-Group'});
            if(selSchoolSubGroup != "")
            {
              let tempSchoolSubGroup = this.schoolSubGroups.filter(schoolSubGroup => schoolSubGroup.id === selSchoolSubGroup?.id);
              if(tempSchoolSubGroup.length == 0)
              {
                this.schoolSubGroups.push(selSchoolSubGroup);
              }
            }
            this.searchClicked = false;
        }
        else
        {
            this.schoolSubGroups = [];
            this.schoolSubGroups.unshift({ id : '', name : 'Select School Sub-Group'});
            this.searchClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
    }
  }

  // get schooling category
  async getSchoolingCategories(action : string, selSchoolingCategory : any) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getSchoolingCategories(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingCategories = response.schoolingCategories;
            this.schoolingCategories.unshift({ id : '', name : 'Select Schooling Category'});
            if(selSchoolingCategory != "")
            {
              let tempSchoolingCategory = this.schoolingCategories.filter(schoolingCategory => schoolingCategory.id === selSchoolingCategory?.id);
              if(tempSchoolingCategory.length == 0)
              {
                this.schoolingCategories.push(selSchoolingCategory);
              }
            }
            this.searchClicked = false;
        }
        else
        {
            this.schoolingCategories = [];
            this.schoolingCategories.unshift({ id : '', name : 'Select Schooling Category'});
            this.searchClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
    }
  }

  fileChange(event : any)
  {
    const file = event.target.files[0];
    let fSize : number = parseFloat((file.size / 1024).toFixed(2));
    if(file.type == 'image/png' || file.type == 'image/jpeg')
    {
      if(fSize > 0)
      {       
        this.editSchoolForm.get('logoFile').setValue(file); 
      }
    }
    else
    {
      this.editSchoolForm.get('logoFile').setValue(""); 
    } 
  }

  prepareFormData()
  {
    let formData = new FormData();

    formData.append('uuid',this.editSchoolForm.get('uuid').value);
    formData.append('name',this.editSchoolForm.get('name').value);
    formData.append('email', this.editSchoolForm.get('email').value);
    formData.append('pincode', this.editSchoolForm.get('pincode').value);
    formData.append('mobile1', this.editSchoolForm.get('mobile1').value);
    formData.append('mobile2', this.editSchoolForm.get('mobile2').value == null ? '' : this.editSchoolForm.get('mobile2').value);
    formData.append('landline1', this.editSchoolForm.get('landline1').value == null ? '' : this.editSchoolForm.get('landline1').value);
    formData.append('landline2', this.editSchoolForm.get('landline2').value == null ? '' : this.editSchoolForm.get('landline2').value);
    formData.append('address', this.editSchoolForm.get('address').value);
    formData.append('website', this.editSchoolForm.get('website').value == null ? '' : this.editSchoolForm.get('website').value);
    formData.append('contractFrom', this.editSchoolForm.get('contractFrom').value);
    formData.append('contractTo', this.editSchoolForm.get('contractTo').value);
    formData.append('country', JSON.stringify({ 'id' : this.countryForm.get('country').value}));
    formData.append('stateRegion', JSON.stringify({ 'id' : this.stateRegionForm.get('stateRegion').value}));
    formData.append('district', JSON.stringify({ 'id' : this.districtForm.get('district').value}));
    formData.append('city', JSON.stringify({ 'id' : this.cityForm.get('city').value}));
    formData.append('schoolingGroup', JSON.stringify({ 'id' : this.schoolingGroupForm.get('schoolingGroup').value}));
    formData.append('schoolSubGroup', JSON.stringify({ 'id' : this.schoolSubGroupForm.get('schoolSubGroup').value}));
    formData.append('schoolingCategory', JSON.stringify({ 'id' : this.schoolingCategoryForm.get('schoolingCategory').value}));
    formData.append('deliveryMode', JSON.stringify({ 'id' : this.deliveryModeForm.get('deliveryMode').value}));
    if(this.editSchoolForm.get("logoFile").value != "")
    {
      formData.append('logoFile', this.editSchoolForm.get("logoFile").value);
    }  
    else
    {
      formData.append('logoFile', "");
    }
    return formData;
  }

  async saveSchool() 
  {
    if (!this.saveClicked) 
    {
      this.schoolingCategoryForm.controls["schoolingCategory"].enable();
      if (this.editSchoolForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid && this.schoolingGroupForm.valid && this.schoolSubGroupForm.valid && this.schoolingCategoryForm.valid) 
      {
        this.schoolingCategoryForm.controls["schoolingCategory"].disable();
        this.isValidForm = true;
        this.saveClicked = true;
        try 
        {             
            let data = this.prepareFormData();
            let response = await this.businessService.updateSchool(data).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "School Saved");
              this.closeModal();
              this.saveClicked = false;
              this.isValidForm = false;
              this.router.navigateByUrl("/business/school/detail/" + response.uuid);
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

  closeModal()
  {
    this.activeModal.close(); 
  }
}
