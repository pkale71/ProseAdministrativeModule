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
import { CoachEditComponent } from '../coach-edit/coach-edit.component';
import { CoachAddComponent } from '../coach-add/coach-add.component';

@Component({
    selector: 'app-coach-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './coach-list.component.html',
    styleUrls: ['./coach-list.component.scss']
    })
    export class CoachListComponent {
        searchClicked : boolean;
        businessVerticalForm : FormGroup;
        businessVerticalTypeForm : FormGroup;
        businessVerticals : any[];
        businessVerticalTypes : any[];
        masterCoaches : any[];
        coaches : any[];
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private businessService: BusinessService, 
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {
            this.businessVerticalTypes = [];
            this.coaches = [];
            this.masterCoaches = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.getCoaches(0, 0, 'All');

        this.businessVerticalForm = this.formbuilder.group({
            "businessVertical" : ['0']
        });
        this.businessVerticalTypeForm = this.formbuilder.group({
            "businessVerticalType" : ['0']
        });

        this.getBusinessVerticals('All');
    }

    public businessVerticalGroupAddResult:any = this.commonSharedService.coachListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getCoaches(0, 0, 'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    // get business vertical
    async getBusinessVerticals(action : string) 
    {  
        try
        {
            let response = await this.businessService.getBusinessVerticals('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.businessVerticals = response.businessVerticals;
                this.businessVerticals.unshift({ id : '0', name : "All" });
                this.getBusinessVerticalTypes(0,'All');
            }
            else
            {
                this.businessVerticals = [];
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    // get business type
    async getBusinessVerticalTypes(businessVerticalGroupId : number, action : string) 
    {  
        try
        {
            let businessVerticalId = this.businessVerticalForm.get('businessVertical').value;
            if(businessVerticalId != undefined && businessVerticalId != '')
            {
                this.searchClicked = true;  
                let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.businessVerticalTypes = response.businessVerticalTypes;
                    this.businessVerticalTypes.unshift({ id : '0', name : "All"});
                    this.searchClicked = false;
                }
                else
                {
                    this.businessVerticalTypes = [];
                    this.businessVerticalTypes.unshift({ id : '', name : "All"});
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
    
    filterData()
    {
        let businessVerticalId : number = this.businessVerticalForm.get('businessVertical').value;
        let businessVerticalTypeId : number = this.businessVerticalTypeForm.get("businessVerticalType").value;
        if(!isNaN(businessVerticalId) && businessVerticalId > 0 && businessVerticalTypeId > 0)
        {
            this.getCoaches(businessVerticalId, businessVerticalTypeId, 'All');
        }
        else
        {
            this.getCoaches(businessVerticalId, businessVerticalTypeId, 'All');
        }
    }

    async getCoaches(businessVerticalId : number, businessVerticalTypeId : number, action : string) 
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getCoaches(businessVerticalId, businessVerticalTypeId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblCoach').DataTable().destroy();
                this.masterCoaches = response.coaches;
                this.coaches = this.masterCoaches;
                setTimeout(function(){
                $('#tblCoach').DataTable();
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

    addCoach()
    {
        const dialogRef = this.modalService.open(CoachAddComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editCoach(coach : any)
    {
        const dialogRef = this.modalService.open(CoachEditComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = coach;
    }

    updateStatus(coach : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (coach.isActive == 1 ? 'de-active' : 'active') + ' the coach?',
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
                    id : coach.uuid,
                    tableName : coach.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Coach Status " + (coach.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.coachListObject.next({
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

    deleteCoach(coach : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete coach?',
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
            let tempJSON = { "uuid" : coach.uuid };
            try
            {
                let response = await this.businessService.deleteCoach(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Coach Deleted.");
                    this.commonSharedService.coachListObject.next({result : "success"});
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
