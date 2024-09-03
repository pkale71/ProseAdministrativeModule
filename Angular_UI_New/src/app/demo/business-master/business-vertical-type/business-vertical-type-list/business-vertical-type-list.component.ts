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
import { BusinessVerticalTypeEditComponent } from '../business-vertical-type-edit/business-vertical-type-edit.component';
import { BusinessVerticalTypeAddComponent } from '../business-vertical-type-add/business-vertical-type-add.component';

@Component({
    selector: 'app-business-vertical-type-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './business-vertical-type-list.component.html',
    styleUrls: ['./business-vertical-type-list.component.scss']
})
export class BusinessVerticalTypeListComponent {
    searchClicked : boolean;
    businessVerticalGroupClicked : boolean;
    businessVerticalTypes : any[];
    masterBusinessVerticalTypes : any[];
    businessVerticalForm : FormGroup;
    businessVerticalGroupForm : FormGroup;
    businessVerticals : any[];
    businessVerticalGroups : any[];
    
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
            this.masterBusinessVerticalTypes = [];
            this.businessVerticals = [];
            this.businessVerticalGroups = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.getBusinessVerticalTypes(0, 0, 'All');

        this.businessVerticalForm = this.formbuilder.group({
            "businessVertical" : ['0']
        });
        this.businessVerticalGroupForm = this.formbuilder.group({
            "businessVerticalGroup" : ['0']
        });

        this.getBusinessVerticals();
    }

    public businessVerticalGroupAddResult:any = this.commonSharedService.businessVerticalTypeListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getBusinessVerticalTypes(0, 0,'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    // get business vertical
    async getBusinessVerticals() 
    {  
        try
        {
            let response = await this.businessService.getBusinessVerticals('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.businessVerticals = response.businessVerticals;
                this.businessVerticals.unshift({ id : '0', name : "All"});
                this.getBusinessVerticalGroups();
            }
            else
            {
                this.businessVerticals = [];
                this.businessVerticals.unshift({ id : '0', name : "All"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    async getBusinessVerticalGroups() 
    {  
        try
        {
            let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
            if(businessVerticalId != undefined && businessVerticalId != "")
            {
                this.businessVerticalGroupClicked = true;  
                let response = await this.businessService.getBusinessVerticalGroups(businessVerticalId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.businessVerticalGroups = response.businessVerticalGroups;
                    this.businessVerticalGroups.unshift({ id : '0', name : "All"});
                    this.businessVerticalGroupClicked = false;
                }
                else
                {
                    this.businessVerticalGroups = [];
                    this.businessVerticalGroups.unshift({ id : '0', name : "All"});
                    this.businessVerticalGroupClicked = false;
                }
            }
            else
            {
                this.businessVerticalGroups = [];
                this.businessVerticalGroups.unshift({ id : '0', name : "All"});
                this.businessVerticalGroupClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.businessVerticalGroupClicked = false;
        }
    }

    filterData()
    {
        let businessVerticalId : number = this.businessVerticalForm.get("businessVertical").value;
        let businessVerticalGroupId : number = this.businessVerticalGroupForm.get("businessVerticalGroup").value;
        if(!isNaN(businessVerticalId) && businessVerticalId > 0 && businessVerticalGroupId > 0)
        {
            this.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, 'All');
        }
        else
        {
            this.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, 'All');
        }
    }

    async getBusinessVerticalTypes(businessVerticalId : number, businessVerticalGroupId : number, action : string) 
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblBusinessVerticalType').DataTable().destroy();
                this.masterBusinessVerticalTypes = response.businessVerticalTypes;
                this.businessVerticalTypes = this.masterBusinessVerticalTypes;
                setTimeout(function(){
                $('#tblBusinessVerticalType').DataTable();
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

    addBusinessVertical()
    {
        const dialogRef = this.modalService.open(BusinessVerticalTypeAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editBusinessVerticalType(businessVerticalType : any)
    {
        const dialogRef = this.modalService.open(BusinessVerticalTypeEditComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = businessVerticalType;
    }

    updateStatus(businessVerticalType : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (businessVerticalType.isActive == 1 ? 'de-active' : 'active') + ' the business vertical type?',
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
                    id : businessVerticalType.id,
                    tableName : businessVerticalType.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Business Vertical Type " + (businessVerticalType.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.businessVerticalTypeListObject.next({
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

    deleteBusinessVerticalType(businessVerticalType : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete business vertical type?',
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
            let tempJSON = { "id" : businessVerticalType.id };
            try
            {
                let response = await this.businessService.deleteBusinessVerticalType(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Business Vertical Type Deleted.");
                    this.commonSharedService.businessVerticalTypeListObject.next({result : "success"});
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
