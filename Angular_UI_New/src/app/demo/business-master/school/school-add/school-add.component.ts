import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
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
  selector: 'app-school-add',
  standalone : true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './school-add.component.html',
  styleUrls: ['./school-add.component.scss']
})
export class SchoolAddComponent 
{
  searchClicked1 : boolean;
  searchClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  schoolingProgramClicked : boolean;
  addSchoolForm : FormGroup;
  countryForm : FormGroup;
  stateRegionForm : FormGroup;
  districtForm : FormGroup;
  schoolingProgramForm : FormGroup;
  cityForm : FormGroup;
  schoolingGroupForm : FormGroup;
  schoolSubGroupForm : FormGroup;
  schoolingCategoryForm : FormGroup;
  deliveryModeForm : FormGroup;
  countries : any[];
  stateRegions : any[];
  districts : any[];
  cities : any[];
  schoolingGroups = [];
  schoolSubGroups = [];
  schoolingCategories = [];
  deliveryModes = [];
  schoolingPrograms : any[];

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
    this.isValidForm = true;
    this.searchClicked1 = false;
    this.searchClicked = false;
    this.saveClicked = false;
    this.schoolingProgramClicked = false;
    this.countries = [];
    this.stateRegions = [];
    this.schoolingGroups = [];
    this.schoolSubGroups = [];
    this.schoolingCategories = [];
    this.districts = [];
    this.cities = [];
    this.schoolingPrograms = [];

    this.addSchoolForm = this.formbuilder.group({
      name : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      mobile1 : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      mobile2 : ['', [Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      landline1 : ['', [Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      landline2 : ['', [Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      pincode : ['', Validators.required],
      address : ['', Validators.required],
      contractFrom : ['', Validators.required],
      contractTo : ['', Validators.required],
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
      schoolingProgramIds : [''],
      logoFile : ['']
    });

    this.schoolingProgramForm = this.formbuilder.group({
      'schoolingPrograms' : ['', Validators.required]
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
    this.getCountries('Active');
    this.getSchoolingGroups('Active');
    this.getSchoolSubGroups('Active');
    this.getSchoolingCategories('Active');
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getSchoolingPrograms(schoolingCategoryId : number) 
  {  
    try
    {
      this.schoolingProgramClicked = true;
      this.schoolingProgramForm.get('schoolingPrograms').reset();
      let tempSchoolingPrograms : Array<IOption> = [];
      let response = await this.commonService.getSchoolingPrograms(schoolingCategoryId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        let schoolingPrograms : any[] = response.schoolingPrograms;
        for(let i = 0; i < schoolingPrograms.length; i++)
        {
          tempSchoolingPrograms.push({
              'value' : schoolingPrograms[i].id.toString(),
              'label' : schoolingPrograms[i].name
          });
        }
        this.schoolingPrograms = this.commonSharedService.prepareSelectOptions(tempSchoolingPrograms);
        this.schoolingProgramClicked = false;
      }
      else
      {
        this.schoolingPrograms = [];
        this.schoolingProgramClicked = false;
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
  async getCountries(action : string) 
  {  
    try
    {
        let response = await this.businessService.getCountries(action).toPromise();
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
            let response = await this.businessService.getStateRegions(countryId, action).toPromise();
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
            let response = await this.businessService.getDistricts(countryId, stateRegionId, action).toPromise();
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
            let response = await this.businessService.getCities(countryId, stateRegionId, districtId, action).toPromise();
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

  // get schooling group
  async getSchoolingGroups(action : string) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getSchoolingGroups(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingGroups = response.schoolingGroups;
            this.schoolingGroups.unshift({ id : '', name : 'Select Schooling Group'});
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
  async getSchoolSubGroups(action : string) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getSchoolSubGroups(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolSubGroups = response.schoolSubGroups;
            this.schoolSubGroups.unshift({ id : '', name : 'Select School Sub-Group'});
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
  async getSchoolingCategories(action : string) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getSchoolingCategories(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingCategories = response.schoolingCategories;
            this.schoolingCategories.unshift({ id : '', name : 'Select Schooling Category'});
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
        this.addSchoolForm.get('logoFile').setValue(file); 
      }
    }
    else
    {
      this.addSchoolForm.get('logoFile').setValue(""); 
    } 
  }

  prepareFormData()
  {
    let formData = new FormData();

    formData.append('name',this.addSchoolForm.get('name').value);
    formData.append('email', this.addSchoolForm.get('email').value);
    formData.append('pincode', this.addSchoolForm.get('pincode').value);
    formData.append('mobile1', this.addSchoolForm.get('mobile1').value);
    formData.append('mobile2', this.addSchoolForm.get('mobile2').value);
    formData.append('landline1', this.addSchoolForm.get('landline1').value);
    formData.append('landline2', this.addSchoolForm.get('landline2').value);
    formData.append('address', this.addSchoolForm.get('address').value);
    formData.append('website', this.addSchoolForm.get('website').value);
    formData.append('contractFrom', this.addSchoolForm.get('contractFrom').value);
    formData.append('contractTo', this.addSchoolForm.get('contractTo').value);
    formData.append('country', JSON.stringify({ 'id' : this.countryForm.get('country').value}));
    formData.append('stateRegion', JSON.stringify({ 'id' : this.stateRegionForm.get('stateRegion').value}));
    formData.append('district', JSON.stringify({ 'id' : this.districtForm.get('district').value}));
    formData.append('city', JSON.stringify({ 'id' : this.cityForm.get('city').value}));
    formData.append('schoolingGroup', JSON.stringify({ 'id' : this.schoolingGroupForm.get('schoolingGroup').value}));
    formData.append('schoolSubGroup', JSON.stringify({ 'id' : this.schoolSubGroupForm.get('schoolSubGroup').value}));
    formData.append('schoolingCategory', JSON.stringify({ 'id' : this.schoolingCategoryForm.get('schoolingCategory').value}));
    formData.append('deliveryMode', JSON.stringify({ 'id' : this.deliveryModeForm.get('deliveryMode').value}));
    formData.append('schoolingProgramIds', this.schoolingProgramForm.get("schoolingPrograms").value.toString());
    if(this.addSchoolForm.get("logoFile").value != "")
    {
      formData.append('logoFile', this.addSchoolForm.get("logoFile").value);
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
      if (this.addSchoolForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid && this.schoolingGroupForm.valid && this.schoolSubGroupForm.valid && this.schoolingCategoryForm.valid && this.deliveryModeForm.valid && this.schoolingProgramForm.valid) 
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try 
        {             
            let data = this.prepareFormData();
            let response = await this.businessService.saveSchool(data).toPromise();
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
