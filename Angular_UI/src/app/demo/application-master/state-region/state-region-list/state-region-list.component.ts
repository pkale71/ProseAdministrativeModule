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
import { StateRegionEditComponent } from '../state-region-edit/state-region-edit.component';
import { StateRegionAddComponent } from '../state-region-add/state-region-add.component';

@Component({
    selector: 'app-state-region-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './state-region-list.component.html',
    styleUrls: ['./state-region-list.component.scss']
})
export class StateRegionListComponent {
    searchClicked : boolean;
    stateRegions : any;
    countryForm : FormGroup;
    masterStateRegion : any[];
    countries : any[];
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
            this.stateRegions = [];
            this.masterStateRegion = [];
            this.countries = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false;

        this.countryForm = this.formbuilder.group({
            'country' : ['']
        });

        this.getCountries('All');
    }

    public stateAddResult:any = this.commonSharedService.stateRegionListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getStateRegions(res.countryId, 'All');
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
        if(!isNaN(this.countryId) && this.countryId > 0)
        {
            this.getStateRegions(countryId, 'All');
        }
        else
        {
            this.getStateRegions(countryId, 'All');
        }
    }

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
                this.searchClicked = false;
            }
            else
            {
                this.countries = [];
                this.countries.unshift({ id : "", name : 'All'});
                this.searchClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    async getStateRegions(countryId : number, action : string) 
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getStateRegions(countryId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblStateRegion').DataTable().destroy();
                this.masterStateRegion = response.stateRegions;
                this.stateRegions = this.masterStateRegion;
                setTimeout(function(){
                    $('#tblStateRegion').DataTable();
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

    addStateRegion()
    {
        const dialogRef = this.modalService.open(StateRegionAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editStateRegion(stateRegion : any)
    {
        const dialogRef = this.modalService.open(StateRegionEditComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = stateRegion;
    }

    updateStatus(stateRegion : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (stateRegion.isActive == 1 ? 'de-active' : 'active') + ' the state/region?',
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
                    id : stateRegion.id,
                    tableName : stateRegion.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "State/Region " + (stateRegion.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.stateRegionListObject.next({
                        countryId : this.countryForm.get('country').value,
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

    deleteStateRegion(stateRegion : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete state/region?',
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
                    "id" : stateRegion.id ,
                    "country" : { "id" :  stateRegion?.country?.id },
                    };
                let response = await this.businessService.deleteStateRegion(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "State/Region Deleted.");
                    this.commonSharedService.stateRegionListObject.next({
                        countryId : this.countryForm.get('country').value,
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
