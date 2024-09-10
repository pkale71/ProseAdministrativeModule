import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { BatchTypeAddComponent } from '../batch-type-add/batch-type-add.component';
import { BatchTypeEditComponent } from '../batch-type-edit/batch-type-edit.component';

@Component({
    selector: 'app-batch-type-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './batch-type-list.component.html',
    styleUrls: ['./batch-type-list.component.scss']
})
export class BatchTypeListComponent {
    academicSessions : any[];
    searchClicked : boolean;
    batchTypes : any[];
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {
        }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.academicSessions = [];
        this.batchTypes = [];
        this.getBatchTypes(0, 'All');
    }

    public BatchTypeAddResult:any = this.commonSharedService.batchTypeListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getBatchTypes(res.academicSessionId, 'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getBatchTypes(academicSessionId : number, action : string) 
    {
    try
        {
            this.searchClicked = true;
            let response = await this.commonService.getBatchTypes(academicSessionId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblBatchType').DataTable().destroy();
                this.batchTypes = response.batchTypes;
                setTimeout(function(){
                    $('#tblBatchType').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.batchTypes = [];
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }
    
    addBatchType()
    {
        const dialogRef = this.modalService.open(BatchTypeAddComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editBatchType(batchType : any)
    {
        const dialogRef = this.modalService.open(BatchTypeEditComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = batchType;
    }

    updateStatus(batchType : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (batchType.isActive == 1 ? 'de-active' : 'active') + ' the batch-type?',
        icon: 'warning',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true 
        }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
        } 
        else 
        {        
            try
            {
                let tempJson = {
                    id : batchType.id,
                    tableName : batchType.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Batch-Type " + (batchType.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.batchTypeListObject.next({
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
    
    deleteBatchType(batchType:any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete batch-type?',
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
            let tempJSON = { "id" : batchType.id };
            try
            {
                let response = await this.commonService.deleteBatchType(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Batch-Type Deleted.");
                    this.commonSharedService.batchTypeListObject.next({
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
