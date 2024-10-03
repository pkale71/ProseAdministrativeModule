import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataTablesModule } from 'angular-datatables';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { IOption, SelectModule } from 'ng-select';
import { add } from 'date-fns/esm';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
    selector: 'app-study-center-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule, DataTablesModule],
    templateUrl: './study-center-add.component.html',
    styleUrls: ['./study-center-add.component.scss']
})
export class StudyCenterAddComponent {
    searchClicked : boolean;
    searchClickedStateRegion : boolean;
    searchClickedDistrict : boolean;
    searchClickedCity : boolean;
    saveClicked : boolean;
    isValidForm : boolean;
    isValidForm1 : boolean;
    isChecked : boolean;
    isCompanyOperated : boolean;
    isPartnerCaptive : boolean;
    addStudyCenterForm : FormGroup;
    countryForm : FormGroup;
    stateRegionForm : FormGroup;
    districtForm : FormGroup;
    cityForm : FormGroup;
    businessPartnerForm : FormGroup;
    getEnclosureDocDetailsForm : FormGroup[];
    studyCenterType : any;
    id : number;
    countries : any[];
    stateRegions : any[];
    districts : any[];
    cities : any[];
    businessPartners : any[];
    studyCenterRewardTypes : any[];
    academyEnclosureDocuments : any[];
    docFiles : any[] = [];

    constructor(private notifier: NotifierService, 
        private commonService : CommonService,
        private formbuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private userService: UserService, 
        public commonSharedService : CommonSharedService,
        private location : Location, 
        private route: ActivatedRoute,
        private router : Router,
        private businessService: BusinessService
        )
        {
            this.id = this.route.params['value'].id;
        }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.isValidForm1 = true;
        this.saveClicked = false;
        this.searchClicked = false;
        this.isChecked = false;
        this.isCompanyOperated = false;
        this.isPartnerCaptive = false;
        this.studyCenterType = [];
        this.countries = [];
        this.stateRegions = [];
        this.districts = [];
        this.cities = [];
        this.studyCenterRewardTypes = [];
        this.getEnclosureDocDetailsForm = [];
        this.academyEnclosureDocuments = [];
        this.getStudyCenterType(this.id);

        this.addStudyCenterForm = this.formbuilder.group({
            name : ['', Validators.required],
            studyCenterType : [{ id : this.id }, Validators.required],
            email : ['', [Validators.required, Validators.email]],
            mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
            pincode : ['', Validators.required],
            address : ['', Validators.required],
            country : this.formbuilder.group({ 'id' : ['']}, Validators.required),
            stateRegion : this.formbuilder.group({ 'id' : ['']}),
            district : this.formbuilder.group({ 'id' : ['']}),
            landlordName : [''],
            contactPersonName : [''],
            contactPersonEmail : [''],
            contactPersonMobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],   
            agreementFrom: [''],
            agreementTo: [''],
            rewardType : [''],
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
        this.businessPartnerForm = this.formbuilder.group({
            'businessPartner' : ['']
        })

        this.getCountries('Active');
        this.getBusinessPartners(0, 'Active');
        this.getStudyCenterValidation();
        this.getStudyCenterRewardTypes();
        this.getAcademyEnclosureDocuments('Active');
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }
    
    async getStudyCenterType(id : number)
    {
        try 
        {
            let response = await this.businessService.getStudyCenterType(id).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.studyCenterType = response.studyCenterType;
            }
            else
            {
                this.studyCenterType = [];
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
                this.searchClickedStateRegion = true;  
                let response = await this.businessService.getStateRegions(countryId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                { 
                    this.stateRegions = response.stateRegions;
                    this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
                    this.searchClickedStateRegion = false;
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
    async getDistricts(action : string) 
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
    async getCities(action : string) 
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
            let response = await this.businessService.getStudyCenterRewardTypes().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.studyCenterRewardTypes = response.studyCenterRewardTypes;
                this.studyCenterRewardTypes.unshift({ id : '', name : 'Select Reward Type'});
            }
            else
            { 
                this.studyCenterRewardTypes = [];
                this.studyCenterRewardTypes.unshift({ id : '', name : 'Select Reward Type'});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    // get business partners (with business partner type id -  optional)
    async getBusinessPartners(businessPartnerTypeId : any, action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.businessService.getBusinessPartners(businessPartnerTypeId, 'Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.businessPartners =  response.businessPartners;
                this.businessPartners.unshift({ id : '', name : 'Select Business Partner'});        
                this.searchClicked = false;
            }
            else
            {
                this.businessPartners = [];
                this.businessPartners.unshift({ id : '', name : 'Select Business Partner'}); 
                this.searchClicked = false;
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    getChange(event : any)
    {
        if(this.isChecked = event.target.checked)
        {
            this.getEnclosureDocDetailsForm = [];
            this.addRow();
        }
        else 
        {
            this.clearRow();
            this.getEnclosureDocDetailsForm = [];
        }    
    }
    
    addRow()
    {
        let i : number = this.getEnclosureDocDetailsForm.length;
        this.getEnclosureDocDetailsForm[i] = this.formbuilder.group({
        academyEnclosureDocument : new FormControl('', Validators.required),
        docFile : new FormControl('', Validators.required)
        });
    }

    deleteRow()
    {
        if(this.getEnclosureDocDetailsForm.length > 1)
        {
            let i : number = this.getEnclosureDocDetailsForm.length - 1;
            let id:any = this.getEnclosureDocDetailsForm[i].controls['academyEnclosureDocument'].value
            this.academyEnclosureDocuments.forEach((ele:any, i:number)=>{
                if(ele.id == id)
                {
                    ele.isUploaded = false;
                }
            })
            this.getEnclosureDocDetailsForm.splice(i, 1);
            this.docFiles.splice(i, 1);
        }
    }  

    clearRow()
    {
        if(this.getEnclosureDocDetailsForm.length > 0)
        {
            let i : number = this.getEnclosureDocDetailsForm.length - 1;
            this.academyEnclosureDocuments.forEach((ele:any, i:number)=>{
                ele.isUploaded = false;
                this.getEnclosureDocDetailsForm.splice(i, 1);
                this.docFiles.splice(i, 1);
            })
        }
    }  

    async getAcademyEnclosureDocuments(action : string) 
    {  
        try
        {
            let response = await this.businessService.getAcademyEnclosureDocuments('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.academyEnclosureDocuments = response.academyEnclosureDocuments;
                this.academyEnclosureDocuments.unshift({ id : '', name : 'Select Document'}); 
                this.academyEnclosureDocuments.forEach((ele:any)=>{
                ele['isUploaded'] = false;
                });
            }
            else
            {
                this.academyEnclosureDocuments = [];
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    back()
    {
        this.location.back();
    }

    getStudyCenterValidation()
    {
        if(this.studyCenterType.name == 'Company Operated')
        {
            this.isCompanyOperated = true;
            this.addStudyCenterForm.controls['landlordName'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['contactPersonName'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['contactPersonEmail'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['contactPersonMobile'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['rewardType'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['agreementFrom'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['agreementTo'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['panNumber'].addValidators(Validators.required);
            this.addStudyCenterForm.controls['gstNumber'].addValidators(Validators.required);
        }
        else
        {
            this.isCompanyOperated = false;
            this.addStudyCenterForm.controls['landlordName'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['contactPersonName'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['contactPersonEmail'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['contactPersonMobile'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['rewardType'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['agreementFrom'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['agreementTo'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['panNumber'].removeValidators(Validators.required);
            this.addStudyCenterForm.controls['gstNumber'].removeValidators(Validators.required);
        }
        if(this.studyCenterType.name == 'Partner Captive')
        {
            this.isPartnerCaptive = true;
            this.businessPartnerForm.controls['businessPartner'].addValidators(Validators.required);
            this.businessPartnerForm.controls['businessPartner'].updateValueAndValidity();
        }
        else
        {
            this.isPartnerCaptive = false;
            this.businessPartnerForm.controls['businessPartner'].removeValidators(Validators.required);
            this.businessPartnerForm.controls['businessPartner'].updateValueAndValidity();
        }
    }

    prepareFormData()
    {
        let formData = new FormData();

        formData.append('name',this.addStudyCenterForm.get('name').value);
        formData.append('email', this.addStudyCenterForm.get('email').value);
        formData.append('mobile', this.addStudyCenterForm.get('mobile').value);
        formData.append('pincode', this.addStudyCenterForm.get('pincode').value);
        formData.append('address', this.addStudyCenterForm.get('address').value);
        formData.append('country', JSON.stringify({ 'id' : this.countryForm.get('country').value}));
        formData.append('stateRegion', JSON.stringify({ 'id' : this.stateRegionForm.get('stateRegion').value}));
        formData.append('district', JSON.stringify({ 'id' : this.districtForm.get('district').value}));
        formData.append('city', JSON.stringify({ 'id' : this.cityForm.get('city').value}));  
        formData.append('studyCenterType', JSON.stringify({ "id" : this.id }));
        if(this.studyCenterType.name == 'Company Operated')
        {
            formData.append('panNumber', this.addStudyCenterForm.get('panNumber').value);
            formData.append('gstNumber', this.addStudyCenterForm.get('gstNumber').value);
            formData.append('landlordName',this.addStudyCenterForm.get('landlordName').value);
            formData.append('contactPersonName',this.addStudyCenterForm.get('contactPersonName').value);
            formData.append('contactPersonEmail', this.addStudyCenterForm.get('contactPersonEmail').value);
            formData.append('contactPersonMobile', this.addStudyCenterForm.get('contactPersonMobile').value); 
            formData.append('agreementFrom',this.addStudyCenterForm.get('agreementFrom').value);
            formData.append('agreementTo', this.addStudyCenterForm.get('agreementTo').value);
            formData.append('rewardType',JSON.stringify({ 'id' : this.addStudyCenterForm.get('rewardType').value}));
        }
        else
        {
            formData.append('panNumber', "");
            formData.append('gstNumber', "");
            formData.append('landlordName',"");
            formData.append('contactPersonName',"");
            formData.append('contactPersonEmail', "");
            formData.append('contactPersonMobile', ""); 
            formData.append('agreementFrom',"");
            formData.append('agreementTo', "");
            formData.append('rewardType',JSON.stringify({ 'id' : ""}));
        }
        if(this.studyCenterType.name == 'Partner Captive')
        {
            formData.append('businessPartner', JSON.stringify({ "uuid" : this.businessPartnerForm.get("businessPartner").value}));
        }  
        else
        {
            formData.append('businessPartner', JSON.stringify({ "uuid" : ''}));
        }
        if(this.docFiles.length > 0)
        {
            let docIds = "";
            for(let k=0; k<this.getEnclosureDocDetailsForm.length; k++)
            {
                let docId = this.getEnclosureDocDetailsForm[k].get("academyEnclosureDocument").value;
                docIds = docIds == "" ? docId : docIds + "," + docId;
                formData.append('docFiles', this.docFiles[k], this.docFiles[k].name);
            }
            formData.append('academyEnclosureDocumentIds', docIds);
        }  
        else
        {
            formData.append('docFiles', "");
            formData.append('academyEnclosureDocumentIds', "");
        }
        return formData;
    }

    fileChange(event : any, i : number)
    {
        if(this.getEnclosureDocDetailsForm[i].get('docFile').value)
        { 
            const file = event.target.files[0]; //this.getEnclosureDocDetailsForm[i].get('docFile').value;
            let fSize : number = parseFloat((file.size / 1024).toFixed(2));
            if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'application/pdf')
            {
                if(fSize > 0)
                {
                    this.docFiles[i] = file;
                }
            }
        }  
    }

    getDocumentSelect()
    {    
        this.academyEnclosureDocuments.forEach((ele:any) => {
        ele.isUploaded = this.getEnclosureDocDetailsForm.some((form:any) => {
            return form.controls['academyEnclosureDocument'].value == ele.id
        });
        });
    }

    async saveStudyCenter() 
    {
        if (!this.saveClicked) 
        {
            if (this.addStudyCenterForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {             
                    let data = this.prepareFormData();
                    let response = await this.businessService.saveStudyCenter(data).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        let savedDocs = response?.savedDocs;
                        if(savedDocs != "")
                        { 
                            this.showNotification("success", "Study Center Saved, " + savedDocs + " Docs Are Uploaded.");
                        }
                        else
                        {
                            this.showNotification("success", "Study Center Saved");
                        }
                        this.saveClicked = false;
                        this.isValidForm = false;
                        this.router.navigateByUrl("/business/studyCenter/detail/" + response.uuid);
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
}
