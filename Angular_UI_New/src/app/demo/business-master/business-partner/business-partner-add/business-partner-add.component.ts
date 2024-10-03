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
    isValidForm1 : boolean;
    searchClickedStateRegion : boolean;
    searchClickedDistrict : boolean;
    searchClickedCity : boolean; 
    searchClickedBusinessVerticalType : boolean;
    isChecked : boolean;
    isRequiredContract : boolean;
    isRequiredPanGst : boolean;
    isRequiredReward : boolean;
    addBusinessPartnerForm : FormGroup;
    countryForm : FormGroup;
    stateRegionForm : FormGroup;
    districtForm : FormGroup;
    cityForm : FormGroup;
    businessVerticalForm : FormGroup;
    businessVerticalTypeForm : FormGroup;
    commissionTermForm : FormGroup;
    commercialTermForm : FormGroup;
    getEnclosureDocDetailsForm : FormGroup[];
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
        this.isValidForm1 = true;
        this.saveClicked = false;
        this.searchClicked = false;
        this.searchClickedStateRegion = false;
        this.searchClickedDistrict = false;
        this.searchClickedCity = false;
        this.searchClickedBusinessVerticalType = false;
        this.isChecked = false;
        this.isRequiredContract = false;
        this.isRequiredPanGst = false;
        this.isRequiredReward = false;
        this.businessPartnerType = [];
        this.countries = [];
        this.stateRegions = [];
        this.districts = [];
        this.cities = [];
        this.businessVerticals = [];
        this.commissionTerms = [];
        this.commercialTerms = [];
        this.getEnclosureDocDetailsForm = [];
        this.academyEnclosureDocuments = [];
        this.getBusinessPartnerType(this.id);

        this.addBusinessPartnerForm = this.formbuilder.group({
            name : ['', Validators.required],
            businessPartnerType : [{ id : this.id }, Validators.required],
            email : ['', [Validators.required, Validators.email]],
            pincode : ['', Validators.required],
            address : ['', Validators.required],
            country : this.formbuilder.group({ 'id' : ['']}),
            stateRegion : this.formbuilder.group({ 'id' : ['']}),
            district : this.formbuilder.group({ 'id' : ['']}),
            businessVertical : this.formbuilder.group({ 'id' : ['']}),
            businessVerticalTypes : this.formbuilder.group({ 'id' : ['']}),
            contactPerson : ['', Validators.required],
            contactEmail : ['', Validators.required],
            contactMobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],  
            inchargePerson : [''],
            inchargeEmail : [''],
            inchargeMobile : [''],  
            applicableFrom: ['', Validators.required],
            applicableTo: ['', Validators.required],
            isHavingContract : ['', Validators.required], 
            contractFrom : [''],
            contractTo : [''],
            rewardApplicable : ['', Validators.required],
            panNumber : ['', [Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[A-Za-z]{1}$"), Validators.minLength(10)]],
            gstNumber : ['', [Validators.pattern("^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}$"), Validators.minLength(15)]],
            commissionTerm : this.formbuilder.group({ 'id' : ['']}),
            commercialTerm : this.formbuilder.group({ 'id' : ['']})
        })

        this.addBusinessPartnerForm.get('isHavingContract').setValue("0");
        this.addBusinessPartnerForm.get('rewardApplicable').setValue("0")

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
        this.businessVerticalForm = this.formbuilder.group({
            'businessVertical' : ['', Validators.required]
        });
        this.businessVerticalTypeForm = this.formbuilder.group({
            'businessVerticalTypes' : ['', Validators.required]
        });
        this.commissionTermForm = this.formbuilder.group({
            'commissionTerm' : ['']
        });
        this.commercialTermForm = this.formbuilder.group({
            'commercialTerm' : ['', Validators.required]
        });

        this.getReferralPartner();
        this.getCountries('Active');
        this.getBusinessVerticals('Active');
        this.getCommercialTerms();
        this.getCommissionTerms();
        this.getAcademyEnclosureDocuments('Active');
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
                if(this.businessPartnerType.code == 'B2B')
                {
                    this.isRequiredPanGst = true;
                    this.addBusinessPartnerForm.controls['panNumber'].addValidators(Validators.required);
                    this.addBusinessPartnerForm.controls['gstNumber'].addValidators(Validators.required);
                    this.addBusinessPartnerForm.controls['panNumber'].updateValueAndValidity();
                    this.addBusinessPartnerForm.controls['gstNumber'].updateValueAndValidity();
                }
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
            this.businessVerticalTypeForm.get('businessVerticalTypes').reset();
            let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
            if(businessVerticalId != undefined && businessVerticalId != "")
            {
                this.searchClickedBusinessVerticalType = true; 
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
                        });
                    }
                    this.businessVerticalTypes = this.commonSharedService.prepareSelectOptions(tempBusinessVerticalTypes);
                    this.searchClickedBusinessVerticalType = false;
                }
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedBusinessVerticalType = false;
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
    
    getReferralPartner()
    {
        if(this.addBusinessPartnerForm.controls['isHavingContract'].value == 1)
        {
            this.isRequiredContract = true;
            this.addBusinessPartnerForm.controls['contractFrom'].enable();
            this.addBusinessPartnerForm.controls['contractFrom'].addValidators(Validators.required);
            this.addBusinessPartnerForm.controls['contractTo'].enable();
            this.addBusinessPartnerForm.controls['contractTo'].addValidators(Validators.required);
            this.addBusinessPartnerForm.controls['contractFrom'].updateValueAndValidity();
            this.addBusinessPartnerForm.controls['contractTo'].updateValueAndValidity();;
            if(this.addBusinessPartnerForm.controls['rewardApplicable'].value == 1)
            {
                this.isRequiredReward = true;
                this.commissionTermForm.controls['commissionTerm'].enable();
                this.commissionTermForm.controls['commissionTerm'].addValidators(Validators.required);
                this.commissionTermForm.controls['commissionTerm'].updateValueAndValidity();
                //both are true then pan and gst required    
                this.isRequiredPanGst = true;
                this.addBusinessPartnerForm.controls['panNumber'].addValidators(Validators.required);
                this.addBusinessPartnerForm.controls['gstNumber'].addValidators(Validators.required);
                this.addBusinessPartnerForm.controls['panNumber'].updateValueAndValidity();
                this.addBusinessPartnerForm.controls['gstNumber'].updateValueAndValidity();
            }
            else
            {
                this.isRequiredReward = false;
                this.commissionTermForm.controls['commissionTerm'].setValue('');
                this.commissionTermForm.controls['commissionTerm'].disable();
                this.commissionTermForm.controls['commissionTerm'].clearValidators();
                this.commissionTermForm.controls['commissionTerm'].updateValueAndValidity();
                //both are false then pan and gst not required    
                this.isRequiredPanGst = false;
                this.addBusinessPartnerForm.controls['panNumber'].removeValidators(Validators.required);
                this.addBusinessPartnerForm.controls['gstNumber'].removeValidators(Validators.required);
                this.addBusinessPartnerForm.controls['panNumber'].updateValueAndValidity();
                this.addBusinessPartnerForm.controls['gstNumber'].updateValueAndValidity();
            }  
        }
        else if(this.addBusinessPartnerForm.controls['rewardApplicable'].value == 1)
        {
            this.isRequiredReward = true;
            this.commissionTermForm.controls['commissionTerm'].enable();
            this.commissionTermForm.controls['commissionTerm'].addValidators(Validators.required);
            this.commissionTermForm.controls['commissionTerm'].updateValueAndValidity();
            this.isRequiredContract = false;
            this.addBusinessPartnerForm.controls['contractFrom'].setValue('');
            this.addBusinessPartnerForm.controls['contractFrom'].disable();
            this.addBusinessPartnerForm.controls['contractFrom'].clearAsyncValidators();
            this.addBusinessPartnerForm.controls['contractTo'].setValue('');
            this.addBusinessPartnerForm.controls['contractTo'].disable();
            this.addBusinessPartnerForm.controls['contractTo'].clearAsyncValidators();
            this.addBusinessPartnerForm.controls['contractFrom'].updateValueAndValidity();
            this.addBusinessPartnerForm.controls['contractTo'].updateValueAndValidity();
            //both are false then pan and gst not required  
            this.isRequiredPanGst = false;
            this.addBusinessPartnerForm.controls['panNumber'].removeValidators(Validators.required);
            this.addBusinessPartnerForm.controls['gstNumber'].removeValidators(Validators.required);
            this.addBusinessPartnerForm.controls['panNumber'].updateValueAndValidity();
            this.addBusinessPartnerForm.controls['gstNumber'].updateValueAndValidity();
        }
        else
        {
            this.isRequiredReward = false; 
            this.commissionTermForm.controls['commissionTerm'].setValue('');
            this.commissionTermForm.controls['commissionTerm'].disable();
            this.commissionTermForm.controls['commissionTerm'].clearValidators();
            this.commissionTermForm.controls['commissionTerm'].updateValueAndValidity();
            this.isRequiredContract = false;
            this.addBusinessPartnerForm.controls['contractFrom'].setValue('');
            this.addBusinessPartnerForm.controls['contractFrom'].disable();
            this.addBusinessPartnerForm.controls['contractFrom'].clearValidators();
            this.addBusinessPartnerForm.controls['contractTo'].setValue('');
            this.addBusinessPartnerForm.controls['contractTo'].disable();
            this.addBusinessPartnerForm.controls['contractTo'].clearValidators();
            this.addBusinessPartnerForm.controls['contractFrom'].updateValueAndValidity();
            this.addBusinessPartnerForm.controls['contractTo'].updateValueAndValidity();
            this.isRequiredPanGst = false;
            this.addBusinessPartnerForm.controls['panNumber'].removeValidators(Validators.required);
            this.addBusinessPartnerForm.controls['gstNumber'].removeValidators(Validators.required);
            this.addBusinessPartnerForm.controls['panNumber'].updateValueAndValidity();
            this.addBusinessPartnerForm.controls['gstNumber'].updateValueAndValidity();
        }
    }

    addRow()
    {
        let i : number = this.getEnclosureDocDetailsForm.length;
        this.getEnclosureDocDetailsForm[i] = this.formbuilder.group({
            academyEnclosureDocument : new FormControl('', Validators.required),
            docFile : new FormControl('', Validators.required)
        })
    }

    deleteRow()
    {
        if(this.getEnclosureDocDetailsForm.length > 1)
        {
            let i : number = this.getEnclosureDocDetailsForm.length - 1;
            let id : any = this.getEnclosureDocDetailsForm[i].controls['academyEnclosureDocument'].value
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
                })
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

    prepareFormData()
    {
        let formData = new FormData();

        formData.append('name',this.addBusinessPartnerForm.get('name').value);
        formData.append('email', this.addBusinessPartnerForm.get('email').value);
        formData.append('pincode', this.addBusinessPartnerForm.get('pincode').value);
        formData.append('address', this.addBusinessPartnerForm.get('address').value);
        formData.append('country', JSON.stringify({ 'id' : this.countryForm.get('country').value}));
        formData.append('stateRegion', JSON.stringify({ 'id' : this.stateRegionForm.get('stateRegion').value}));
        formData.append('district', JSON.stringify({ 'id' : this.districtForm.get('district').value}));
        formData.append('city', JSON.stringify({ 'id' : this.cityForm.get('city').value}));
        formData.append('businessVertical', JSON.stringify({ 'id' : this.businessVerticalForm.get('businessVertical').value}));
        formData.append('businessVerticalTypeIds', this.businessVerticalTypeForm.get('businessVerticalTypes').value.toString());
        formData.append('contactPerson',this.addBusinessPartnerForm.get('contactPerson').value);
        formData.append('contactEmail', this.addBusinessPartnerForm.get('contactEmail').value);
        formData.append('contactMobile', this.addBusinessPartnerForm.get('contactMobile').value); 
        formData.append('inchargePerson',this.addBusinessPartnerForm.get('inchargePerson').value);
        formData.append('inchargeEmail', this.addBusinessPartnerForm.get('inchargeEmail').value);
        formData.append('inchargeMobile', this.addBusinessPartnerForm.get('inchargeMobile').value);
        formData.append('applicableFrom',this.addBusinessPartnerForm.get('applicableFrom').value);
        formData.append('applicableTo', this.addBusinessPartnerForm.get('applicableTo').value);
        formData.append('panNumber', this.addBusinessPartnerForm.get('panNumber').value);
        formData.append('gstNumber', this.addBusinessPartnerForm.get('gstNumber').value);
        formData.append('businessPartnerType', JSON.stringify({ "id" : this.id}));
        if(this.businessPartnerType.code == 'B2C')
        {
            formData.append('isHavingContract', this.addBusinessPartnerForm.get('isHavingContract').value);
            formData.append('contractFrom',this.addBusinessPartnerForm.get('contractFrom').value);
            formData.append('contractTo', this.addBusinessPartnerForm.get('contractTo').value);
            formData.append('rewardApplicable',this.addBusinessPartnerForm.get('rewardApplicable').value);
            formData.append('commissionTerm', JSON.stringify({ 'id' : this.commissionTermForm.get('commissionTerm').value}));
        }
        else
        {
            formData.append('isHavingContract', "");
            formData.append('contractFrom',"");
            formData.append('contractTo', "");
            formData.append('rewardApplicable',"");
            formData.append('commissionTerm', JSON.stringify({ 'id' : ""}));
        }
        if(this.businessPartnerType.code == 'B2B')
        {
            formData.append('commercialTerm', JSON.stringify({ 'id' : this.commercialTermForm.get('commercialTerm').value}));
        }
        else
        {
            formData.append('commercialTerm', JSON.stringify({ 'id' : ""}));
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
        })
        })
    }

    async saveBusinessPartner() 
    {
        if (!this.saveClicked) 
        {
            if (this.addBusinessPartnerForm.valid && this.countryForm.valid && this.stateRegionForm.valid 
                && this.districtForm.valid && this.cityForm.valid && this.businessVerticalForm.valid && 
                this.businessVerticalTypeForm.valid || ((this.businessPartnerType.code == 'B2C' && 
                this.addBusinessPartnerForm.controls['rewardApplicable'].value == 1 && 
                this.commissionTermForm.valid)) || (this.businessPartnerType.code == 'B2B' 
                && this.commercialTermForm.valid)) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {             
                    let data = this.prepareFormData();
                    let response = await this.businessService.saveBusinessPartner(data).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        let savedDocs = response?.savedDocs;
                        if(savedDocs != "")
                        { 
                            this.showNotification("success", "Business Partner Saved, " + savedDocs + " Docs Are Uploaded.");
                        }
                        else
                        {
                            this.showNotification("success", "Business Partner Saved");
                        }
                        this.saveClicked = false;
                        this.isValidForm = false;
                        this.router.navigateByUrl("/business/businessPartner/detail/" + response.uuid);
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
