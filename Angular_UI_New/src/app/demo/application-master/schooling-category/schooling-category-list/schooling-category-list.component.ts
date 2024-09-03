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
import { SchoolingCategoryAddComponent } from '../schooling-category-add/schooling-category-add.component';
import { SchoolingCategoryEditComponent } from '../schooling-category-edit/schooling-category-edit.component';

@Component({
    selector: 'app-schooling-category-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './schooling-category-list.component.html',
    styleUrls: ['./schooling-category-list.component.scss']
})
export class SchoolingCategoryListComponent {
    schoolingCategories : any[];
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
        this.schoolingCategories = [];
        this.getSchoolingCatrgories('All');
    }

    public schoolingGroupAddResult:any = this.commonSharedService.schoolingCategoryListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getSchoolingCatrgories('All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSchoolingCatrgories(action : string) 
    {
        try 
        {
            this.searchClicked = true;
            let response = await this.commonService.getSchoolingCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSchoolingGroup').DataTable().destroy();
                this.schoolingCategories = response.schoolingCategories;
                setTimeout(function(){
                    $('#tblSchoolingGroup').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.schoolingCategories = [];
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

    addSchoolingCategory()
    {
        const dialogRef = this.modalService.open(SchoolingCategoryAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    // editSchoolingGroup(schoolingGroup : any)
    // {
    //     const dialogRef = this.modalService.open(SchoolingCategoryEditComponent, 
    //     { 
    //         size: 'md', backdrop: 'static' 
    //     });
    //     dialogRef.componentInstance.modalParams = schoolingGroup;
    // }

    updateStatus(schoolingCategory : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (schoolingCategory.isActive == 1 ? 'de-active' : 'active') + ' the schooling category?',
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
                    id : schoolingCategory.id,
                    tableName : schoolingCategory.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Schooling Category " + (schoolingCategory         .isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.schoolingCategoryListObject.next({
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
    
    deleteSchoolingCategory(schoolingCategory : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete schooling category?',
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
            let tempJSON = { "id" : schoolingCategory.id };
            try
            {
                let response = await this.commonService.deleteSchoolingCategory(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Schooling Category Deleted.");
                    this.commonSharedService.schoolingCategoryListObject.next({result : "success"});
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
