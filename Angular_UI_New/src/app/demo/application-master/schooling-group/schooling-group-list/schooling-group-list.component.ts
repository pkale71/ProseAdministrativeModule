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
import { SchoolingGroupAddComponent } from '../schooling-group-add/schooling-group-add.component';
import { SchoolingGroupEditComponent } from '../schooling-group-edit/schooling-group-edit.component';

@Component({
    selector: 'app-schooling-group-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './schooling-group-list.component.html',
    styleUrls: ['./schooling-group-list.component.scss']
})
export class SchoolingGroupListComponent {
    schoolingGroups : any[];
    searchClicked : boolean;
    
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
        this.schoolingGroups = [];
        this.getSchoolingGroups('All');
    }

    public schoolingGroupAddResult:any = this.commonSharedService.schoolingGroupListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getSchoolingGroups('All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSchoolingGroups(action : string) 
    {
        try 
        {
            this.searchClicked = true;
            let response = await this.commonService.getSchoolingGroups('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSchoolingGroup').DataTable().destroy();
                this.schoolingGroups = response.schoolingGroups;
                setTimeout(function(){
                    $('#tblSchoolingGroup').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.schoolingGroups = [];
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
            this.searchClicked = false;
            this.modalService.dismissAll();
        }
    }

    addSchoolingGroup()
    {
        const dialogRef = this.modalService.open(SchoolingGroupAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    // editSchoolingGroup(schoolingGroup : any)
    // {
    //     const dialogRef = this.modalService.open(SchoolingGroupEditComponent, 
    //     { 
    //         size: 'md', backdrop: 'static' 
    //     });
    //     dialogRef.componentInstance.modalParams = schoolingGroup;
    // }

    updateStatus(schoolingGroup : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (schoolingGroup.isActive == 1 ? 'de-active' : 'active') + ' the schooling group?',
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
                    id : schoolingGroup.id,
                    tableName : schoolingGroup.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Schooling Group " + (schoolingGroup.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.schoolingGroupListObject.next({
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
    
    deleteSchoolingGroup(schoolingGroup : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete schooling group?',
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
            let tempJSON = { "id" : schoolingGroup.id };
            try
            {
                let response = await this.commonService.deleteSchoolingGroup(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Schooling Group Deleted.");
                    this.commonSharedService.schoolingGroupListObject.next({result : "success"});
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
