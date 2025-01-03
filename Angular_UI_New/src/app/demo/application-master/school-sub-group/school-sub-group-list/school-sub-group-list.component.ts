import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolSubGroupAddComponent } from '../school-sub-group-add/school-sub-group-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-school-sub-group-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './school-sub-group-list.component.html',
    styleUrls: ['./school-sub-group-list.component.scss']
})
export class SchoolSubGroupListComponent {
    schoolSubGroups : any[];
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
        this.schoolSubGroups = [];
        this.getSchoolSubGroups('All');
    }

    public gradeAddResult:any = this.commonSharedService.schoolSubGroupListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getSchoolSubGroups('All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSchoolSubGroups(action : string) 
    {
        try 
        {
            this.searchClicked = true;
            let response = await this.commonService.getSchoolSubGroups('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSchoolSubGroup').DataTable().destroy();
                this.schoolSubGroups = response.schoolSubGroups;
                setTimeout(function(){
                    $('#tblSchoolSubGroup').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.schoolSubGroups = [];
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

    addSchoolSubGroup()
    {
        const dialogRef = this.modalService.open(SchoolSubGroupAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    updateStatus(schoolSubGroup : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (schoolSubGroup.isActive == 1 ? 'de-active' : 'active') + ' the school sub-group?',
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
                    id : schoolSubGroup.id,
                    tableName : schoolSubGroup.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "School Sub-Group " + (schoolSubGroup.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.schoolSubGroupListObject.next({
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
    
    deleteSchoolSubGroup(schoolSubGroup : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete school sub-group?',
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
            let tempJSON = { "id" : schoolSubGroup.id };
            try
            {
                let response = await this.commonService.deleteSchoolSubGroup(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "School Sub-Group Deleted.");
                    this.commonSharedService.schoolSubGroupListObject.next({result : "success"});
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
