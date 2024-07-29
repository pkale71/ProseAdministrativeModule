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
    selector: 'app-tie-up-school-edit',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './tie-up-school-edit.component.html',
    styleUrls: ['./tie-up-school-edit.component.scss']
})
export class TieUpSchoolEditComponent {
    @Input() public modalParams;
    uuid : string;  
    searchClicked : boolean;
    editTieUpSchoolForm: FormGroup;
    countryForm : FormGroup;
    stateRegionForm : FormGroup;
    districtForm : FormGroup;
    cityForm : FormGroup;
    syllabusForm : FormGroup;;
    isValidForm: boolean;
    saveClicked : boolean;
    countries : any[];
    stateRegions : any[];
    districts : any[];
    cities : any[];
    tieUpSchoolSyllabuses : any[];
    tieUpSchool : any;

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

        this.editTieUpSchoolForm = this.formbuilder.group({
        uuid: this.uuid,
        name : ['', Validators.required],
        businessPartnerType : [{ id : ''}],
        email : ['', [Validators.required, Validators.email]],
        mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
        pincode : ['', Validators.required],
        address : ['', Validators.required],
        website : ['', [
            Validators.required,
        ]],
        country : this.formbuilder.group({ 'id' : ['']}),
        stateRegion : this.formbuilder.group({ 'id' : ['']}),
        district : this.formbuilder.group({ 'id' : ['']}),
        city : this.formbuilder.group({ 'id' : ['']}),
        contactPerson : ['', Validators.required],
        panNumber : ['', [Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[A-Za-z]{1}$"), Validators.minLength(10)]],
        syllabus : this.formbuilder.group({ 'id' : ['']}),
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
        this.syllabusForm = this.formbuilder.group({
        'syllabus' : ['', Validators.required]
        })

        this.getTieUpSchool(this.uuid);
        this.getTieUpSchoolSyllabuses('All');
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getTieUpSchool(uuid : string) 
    {
        this.searchClicked = true;
        let response = await this.businessService.getTieUpSchool(uuid).toPromise(); 
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.tieUpSchool = response.tieUpSchool;
            this.editTieUpSchoolForm.patchValue(this.tieUpSchool);
            this.countryForm.get('country').setValue(this.tieUpSchool.country.id);
            this.getCountries(this.tieUpSchool.country);
            this.stateRegionForm.get('stateRegion').setValue(this.tieUpSchool.stateRegion.id);
            this.getStateRegions(this.tieUpSchool.stateRegion);
            this.districtForm.get('district').setValue(this.tieUpSchool.district.id);
            this.getDistricts(this.tieUpSchool.district);
            this.cityForm.get('city').setValue(this.tieUpSchool.city.id);
            this.getCities(this.tieUpSchool.city);
            this.syllabusForm.get('syllabus').setValue(this.tieUpSchool.syllabus.id);
            this.searchClicked = false;
        }
        else
        {
            this.tieUpSchool = [];
            this.searchClicked = false;
        }
    }
    
    //get country
    async getCountries(country : any) 
    {  
        try
        {
            let response = await this.businessService.getCountries('Active').toPromise();
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
    async getStateRegions(stateRegion : any) 
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
                    // here check deactive state region
                    if(stateRegion != '')
                    {
                        let filterStateRegion = this.stateRegions.filter(tempStateRegion => parseInt(tempStateRegion.id) == parseInt(stateRegion.id));
                        if(filterStateRegion.length == 0)
                        {
                            this.stateRegions.push({ id : stateRegion.id, name : stateRegion.name });
                        } 
                    }
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
    async getDistricts(district : any) 
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
                    // here check deactive district
                    if(district != '')
                    {
                        let filterDistrict = this.districts.filter(tempDistrict => parseInt(tempDistrict.id) == parseInt(district.id));
                        if(filterDistrict.length == 0)
                        {
                            this.districts.push({ id : district.id, name : district.name });
                        } 
                    }
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
    async getCities(city : any) 
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
                    // here check deactive city
                    if( city != '')
                    {
                        let filterCity = this.cities.filter(tempCity => parseInt(tempCity.id) == parseInt(city.id));
                        if(filterCity.length == 0)
                        {
                            this.cities.push({ id : city.id, name : city.name });
                        }
                    }
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

    // get syllabus
    async getTieUpSchoolSyllabuses(action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.businessService.getTieUpSchoolSyllabuses('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.tieUpSchoolSyllabuses = response.tieUpSchoolSyllabuses;
                this.tieUpSchoolSyllabuses.unshift({ id : '', name : 'Select Syllabus'});
                this.searchClicked = false;
            }
            else
            {
                this.tieUpSchoolSyllabuses = [];
                this.tieUpSchoolSyllabuses.unshift({ id : '', name : 'Select Syllabus'});
                this.searchClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    async saveTieUpSchool()
    {
        if(!this.saveClicked)
        {
            if(this.editTieUpSchoolForm.valid && this.countryForm.valid && this.stateRegionForm.valid && this.districtForm.valid && this.cityForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let tempJson = {
                        uuid : this.uuid,
                        name : this.editTieUpSchoolForm.get('name').value,
                        email : this.editTieUpSchoolForm.get('email').value,
                        mobile : this.editTieUpSchoolForm.get('mobile').value,
                        address : this.editTieUpSchoolForm.get('address').value,
                        pincode : this.editTieUpSchoolForm.get('pincode').value,
                        contactPerson : this.editTieUpSchoolForm.get('contactPerson').value,
                        panNumber : this.editTieUpSchoolForm.get('panNumber').value,
                        website : this.editTieUpSchoolForm.get('website').value,
                        country : { "id" : this.countryForm.get('country').value},
                        stateRegion : { "id" : this.stateRegionForm.get('stateRegion').value},
                        district : { "id" : this.districtForm.get('district').value},
                        city : { "id" : this.cityForm.get('city').value},
                        syllabus : { "id" : this.syllabusForm.get('syllabus').value}
                    }
                    let response = await this.businessService.updateTieUpSchool(tempJson).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Tie-Up School Updated");
                        this.closeModal();
                        this.saveClicked = false;
                        this.isValidForm = false;
                        this.router.navigateByUrl("/business/tieUpSchool/detail/" + this.uuid);
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
