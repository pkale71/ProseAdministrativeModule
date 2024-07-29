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
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TieUpSchoolSyllabusAddComponent } from '../tie-up-school-syllabus-add/tie-up-school-syllabus-add.component';
import { id } from 'date-fns/locale';

@Component({
    selector: 'app-tie-up-school-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule, DataTablesModule],
    templateUrl: './tie-up-school-add.component.html',
    styleUrls: ['./tie-up-school-add.component.scss']
})
export class TieUpSchoolAddComponent {
    searchClicked : boolean;
    saveClicked : boolean;
    isValidForm : boolean;
    isValidForm1 : boolean;
    isChecked : boolean;
    addTieUpSchoolForm : FormGroup;
    countryForm : FormGroup;
    stateRegionForm : FormGroup;
    districtForm : FormGroup;
    cityForm : FormGroup;
    syllabusForm : FormGroup;
    getEnclosureDocDetailsForm : FormGroup[];
    countries : any[];
    stateRegions : any[];
    districts : any[];
    cities : any[];
    tieUpSchoolSyllabuses : any[];
    academyEnclosureDocuments : any[];
    docFiles : any[] = [];  
    tieUpSchoolSyllabus : any;
    id : number;

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
        this.isValidForm1 = true;
        this.saveClicked = false;
        this.searchClicked = false;
        this.isChecked = false;
        this.countries = [];
        this.stateRegions = [];
        this.districts = [];
        this.cities = [];
        this.tieUpSchoolSyllabuses = [];
        this.getEnclosureDocDetailsForm = [];
        this.academyEnclosureDocuments = [];

        this.addTieUpSchoolForm = this.formbuilder.group({
        name : ['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
        pincode : ['', Validators.required],
        address : ['', Validators.required],
        website : ['', [
            Validators.required,
            //Validators.pattern("/^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")
        ]],
        country : this.formbuilder.group({ 'id' : ['']}),
        stateRegion : this.formbuilder.group({ 'id' : ['']}),
        district : this.formbuilder.group({ 'id' : ['']}),
        syllabus : this.formbuilder.group({ 'id' : ['']}),
        businessVerticalTypes : this.formbuilder.group({ 'id' : ['']}),
        contactPerson : ['', Validators.required],contractFrom : ['', Validators.required],
        contractTo : ['', Validators.required],
        panNumber : ['', [Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[A-Za-z]{1}$"), Validators.minLength(10)]],  
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
        this.syllabusForm = this.formbuilder.group({
        'syllabus' : ['', Validators.required]
        })

        this.getCountries('Active');
        this.getTieUpSchoolSyllabuses('All');
        this.getAcademyEnclosureDocuments('Active');
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

    getChange(event : any)
    {
        this.isChecked = event.target.checked;
        this.getEnclosureDocDetailsForm = [];
        this.addRow();
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

    prepareFormData()
    {
        let formData = new FormData();

        formData.append('name',this.addTieUpSchoolForm.get('name').value);
        formData.append('email', this.addTieUpSchoolForm.get('email').value);
        formData.append('pincode', this.addTieUpSchoolForm.get('pincode').value);
        formData.append('mobile', this.addTieUpSchoolForm.get('mobile').value);
        formData.append('address', this.addTieUpSchoolForm.get('address').value);
        formData.append('website', this.addTieUpSchoolForm.get('website').value);
        formData.append('country', JSON.stringify({ 'id' : this.countryForm.get('country').value}));
        formData.append('stateRegion', JSON.stringify({ 'id' : this.stateRegionForm.get('stateRegion').value}));
        formData.append('district', JSON.stringify({ 'id' : this.districtForm.get('district').value}));
        formData.append('city', JSON.stringify({ 'id' : this.cityForm.get('city').value}));
        formData.append('syllabus', JSON.stringify({ 'id' : this.syllabusForm.get('syllabus').value}));
        formData.append('contactPerson',this.addTieUpSchoolForm.get('contactPerson').value);
        formData.append('panNumber', this.addTieUpSchoolForm.get('panNumber').value);
        formData.append('contractFrom',this.addTieUpSchoolForm.get('contractFrom').value);
        formData.append('contractTo', this.addTieUpSchoolForm.get('contractTo').value);
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
        { // console.log(event.target.files[0])
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

    addTieUpSchoolSyllabus()
    {
        const dialogRef = this.modalService.open(TieUpSchoolSyllabusAddComponent, 
        { 
        size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
        dialogRef.result.then(( value : any ) => { 
        this.getTieUpSchoolSyllabuses('All');
        });
    }

    async saveTieUpSchool() 
    {
        if (!this.saveClicked) 
        {
            if (this.addTieUpSchoolForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {             
                    let data = this.prepareFormData();
                    let response = await this.businessService.saveTieUpSchool(data).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Tie-Up School Saved");
                        this.closeModal();
                        this.saveClicked = false;
                        this.isValidForm = false;
                        this.router.navigateByUrl("/business/tieUpSchool/detail/" + response.uuid);
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

    // tie-up school syllabus with id
    // async getTieUpSchoolSyllabus(id : number)
    // {
    //   try
    //   {
    //     let response = await this.businessService.getTieUpSchoolSyllabus(id).toPromise();
    //     if(response.status_code == 200 && response.message == 'success')
    //     {
    //       this.tieUpSchoolSyllabus = response.tieUpSchoolSyllabus;
    //       console.log(this.tieUpSchoolSyllabus)
    //     }  
    //     else
    //     {
    //       this.tieUpSchoolSyllabus = [];
    //     }
    //   } 
    //   catch(e)
    //   {
    //     this.showNotification("error", e);
    //   }
    // }

    // delete tie-up school syllabus
    deleteTieUpSchoolSyllabus()
    {
        let id =  this.syllabusForm.value.syllabus;  //this.syllabusForm.get('syllabus').value;
        if(!id || id == '')
        return;
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete syllabus?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
        }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
            
        } 
        else 
        {
            this.showNotification("info", "Please wait...");
            let tempJSON = { "id" :  id };
            try
            {
                let response = await this.businessService.delteTieUpSchoolSyllabus(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Syllabus Deleted.");
                    this.getTieUpSchoolSyllabuses('All');
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
