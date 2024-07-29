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
import { DistrictEditComponent } from '../district-edit/district-edit.component';
import { DistrictAddComponent } from '../district-add/district-add.component';

@Component({
    selector: 'app-district-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './district-list.component.html',
    styleUrls: ['./district-list.component.scss']
})
    export class DistrictListComponent {
    searchClicked : boolean;
    districts : any;
    countryForm : FormGroup;
    stateRegionForm : FormGroup;
    countries : any[];
    stateRegions : any[];
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private businessService: BusinessService, 
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {
        this.districts = [];
        this.countries = [];
        this.stateRegions = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false;

        this.countryForm = this.formbuilder.group({
            'country' : ['']
        })

        this.stateRegionForm = this.formbuilder.group({
            'stateRegion' : ['']
        })

        this.getCountries('All');
    }

    public stateAddResult:any = this.commonSharedService.districtListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getDistricts(res.countryId, res.stateRegionId, 'All');
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
        if(!isNaN(countryId) && countryId > 0 && stateRegionId > 0)
        {
            this.getDistricts(countryId, stateRegionId, 'All');
        }
        else
        {
            this.getDistricts(countryId, stateRegionId, 'All');
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
                this.countries.unshift({ id : "", name : 'Select Country'});
                this.getStateRegions('All');
                this.searchClicked = false;
            }
            else
            {
                this.countries = [];
                this.countries.unshift({ id : "", name : 'Select Country'});
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
                    this.stateRegions.unshift({ id : '', name : 'All'});
                    this.searchClicked = false;
                }
                else
                {
                    this.stateRegions = [];
                    this.stateRegions.unshift({ id : '', name : 'All'});
                    this.searchClicked = false;
                }
            }
            else
            {
                this.stateRegions = [];
                this.stateRegions.unshift({ id : '', name : 'All'});
                this.searchClicked = false;
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    async getDistricts(countryId : number, stateRegionId : number, action : string) 
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getDistricts(countryId, stateRegionId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblDistrict').DataTable().destroy();
                this.districts = response.districts;
                setTimeout(function(){
                $('#tblDistrict').DataTable();
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

    addDistrict()
    {
        const dialogRef = this.modalService.open(DistrictAddComponent, 
        { 
        size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editDistrict(district : any)
    {
        const dialogRef = this.modalService.open(DistrictEditComponent, 
        { 
        size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = district;
    }

    updateStatus(district : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (district.isActive == 1 ? 'de-active' : 'active') + ' the district?',
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
                    id : district.id,
                    tableName : district.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "District " + (district.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.districtListObject.next({
                    countryId : this.countryForm.get('country').value,
                    stateRegionId : this.stateRegionForm.get('stateRegion').value,
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

    deleteDistrict(district : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete district?',
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
            try
            {
                let tempJSON = { 
                    "id" : district.id ,
                    "country" : { "id" :  this.countryForm.get('country').value },
                    "stateRegion" : { "id" : district.stateRegion.id }
                    };
                let response = await this.businessService.deleteDistrict(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "State Region Deleted.");
                    this.commonSharedService.districtListObject.next({
                    result : "success",
                    countryId : this.countryForm.get('country').value,
                    stateRegionId : this.stateRegionForm.get('stateRegion').value
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
