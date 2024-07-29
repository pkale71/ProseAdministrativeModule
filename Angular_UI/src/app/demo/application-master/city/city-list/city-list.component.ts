import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { id } from 'date-fns/locale';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CityEditComponent } from '../city-edit/city-edit.component';
import { CityAddComponent } from '../city-add/city-add.component';

@Component({
    selector: 'app-city-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './city-list.component.html',
    styleUrls: ['./city-list.component.scss']
})
export class CityListComponent {
    searchClicked : boolean;
    cities : any[];
    districts : any;
    countryForm : FormGroup;
    stateRegionForm : FormGroup;
    districtForm : FormGroup;
    countries : any[];
    stateRegions : any[];
    countryId : any;
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private businessService: BusinessService, 
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {
        this.cities = [];
        this.districts = [];
        this.countries = [];
        this.stateRegions = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false;

        this.countryForm = this.formbuilder.group({
        'country' : ['0']
        })
        this.stateRegionForm = this.formbuilder.group({
        'stateRegion' : ['0']
        })
        this.districtForm = this.formbuilder.group({
        'district' : ['0']
        })

        this.getCountries('All');

    }

    public stateAddResult:any = this.commonSharedService.cityListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.countryForm.get('country').setValue(res.countryId);
            this.stateRegionForm.get('stateRegion').setValue(res.stateRegionId);
            this.districtForm.get('district').setValue(res.districtId);
            this.getCities(res.countryId, res.stateRegionId, res.districtId, 'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    filterData()
    {
        let countryId : number = this.countryForm.get('country').value;
        let stateRegionId : number = this.stateRegionForm.get('stateRegion').value;
        let districtId : number = this.districtForm.get('district').value;
        if(!isNaN(this.countryId) && this.countryId > 0 && stateRegionId > 0 && districtId > 0)
        {
            this.getCities(countryId, stateRegionId, districtId, 'All');
        }
        else
        {
            this.getCities(countryId, stateRegionId, districtId, 'All');
        }
    }

    // get country
    async getCountries(action : string) 
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getCountries('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.countries = response.countries;
                this.countries.unshift({ id : "0", name : 'Select Country'});
                this.countryForm.get('country').setValue(this.countries[0].id);
                this.searchClicked = false;
            }
            else
            {
                this.countries = [];
                this.countries.unshift({ id : "0", name : 'Select Country'});
                this.searchClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    // get stateRegion
    async getStateRegions(action : string) 
    {  
        try
        {
            let countryId = this.countryForm.get('country').value;
            if(countryId != undefined && countryId != '')
            {
                this.searchClicked = true;  
                let response = await this.businessService.getStateRegions(countryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.stateRegions = response.stateRegions;
                    this.stateRegions.unshift({ id : '0', name : 'Select State/Region'});
                    this.stateRegionForm.get('stateRegion').setValue(this.stateRegions[0].id);
                    this.searchClicked = false;
                }
                else
                {
                    this.stateRegions = [];
                    this.stateRegions.unshift({ id : '0', name : 'Select State/Region'});
                    this.searchClicked = false;
                }
            }
            else
            {
                this.stateRegions = [];
                this.stateRegions.unshift({ id : '0', name : 'Select State/Region'});
                this.searchClicked = false;
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
                let response = await this.businessService.getDistricts(countryId, stateRegionId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.districts = response.districts;
                    this.districts.unshift({ id : '0', name : 'All'});
                    this.districtForm.get('district').setValue(this.districts[0].id);
                    this.searchClicked = false;
                }
                else
                {
                    this.districts = [];
                    this.districts.unshift({ id : '0', name : 'All'});
                    this.searchClicked = false;
                }
            }
            else
            {
                this.districts = [];
                this.districts.unshift({ id : '0', name : 'All'});
                this.searchClicked = false;
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    async getCities(countryId : number, stateRegionId : number, districtId : number, action : string) 
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getCities(countryId, stateRegionId, districtId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblCity').DataTable().destroy();
                this.cities = response.cities;
                setTimeout(function(){
                $('#tblCity').DataTable();
                },1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.searchClicked = false;
                this.modalService.dismissAll(); 
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    addCity()
    {
        const dialogRef = this.modalService.open(CityAddComponent, 
        { 
        size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editCity(city : any)
    {
        const dialogRef = this.modalService.open(CityEditComponent, 
        { 
        size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = city;
    }

    updateStatus(city : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (city.isActive == 1 ? 'de-active' : 'active') + ' the city?',
        icon: 'warning',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true 
        }).then(async (willUpdate) => {
        if (willUpdate.dismiss) 
        {
        } 
        else 
        {        
            try
            {
                let tempJson = {
                    id : city.id,
                    tableName : city.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "City " + (city.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.cityListObject.next({
                        countryId : this.countryForm.get('country').value,
                        stateRegionId : this.stateRegionForm.get('stateRegion').value,
                        districtId : this.districtForm.get('district').value,
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

    deleteCity(city : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete city?',
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
            let tempJSON = { 
                "id" : city.id ,
                "country" : { "id" :  this.countryForm.get('country').value },
                "stateRegion" : { "id" : this.stateRegionForm.get('stateRegion').value },
                "district" : { "id" : city.district.id }
            };
            try
            {
                let response = await this.businessService.deleteCity(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "City Deleted.");
                    this.commonSharedService.cityListObject.next
                    ({
                        countryId : this.countryForm.get('country').value,
                        stateRegionId : this.stateRegionForm.get('stateRegion').value,
                        districtId : this.districtForm.get('district').value,
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
