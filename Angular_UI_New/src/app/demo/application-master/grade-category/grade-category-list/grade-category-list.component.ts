import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeCategoryAddComponent } from '../grade-category-add/grade-category-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { GradeCategoryEditComponent } from '../grade-category-edit/grade-category-edit.component';

@Component({
    selector: 'app-grade-category-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './grade-category-list.component.html',
    styleUrls: ['./grade-category-list.component.scss']
})
export class GradeCategoryListComponent {
    gradeCategories : any[];
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
        this.gradeCategories = [];
        this.getGradeCategories('All');
    }

    public gradeAddResult:any = this.commonSharedService.gradeCategoryListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getGradeCategories('All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getGradeCategories(action : string) 
    {
        try 
        {
            this.searchClicked = true;
            let response = await this.commonService.getGradeCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblGradeCategory').DataTable().destroy();
                this.gradeCategories = response.gradeCategories;
                setTimeout(function(){
                    $('#tblGradeCategory').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.gradeCategories = [];
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

    addGradeCategory()
    {
        const dialogRef = this.modalService.open(GradeCategoryAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editGradeCategory(gradeCategory : any)
    {
        const dialogRef = this.modalService.open(GradeCategoryEditComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {
            "gradeCategory" : gradeCategory
        };
    }

    updateStatus(gradeCategory : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (gradeCategory.isActive == 1 ? 'de-active' : 'active') + ' the grade category?',
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
                    id : gradeCategory.id,
                    tableName : gradeCategory.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Grade Category " + (gradeCategory.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.gradeCategoryListObject.next({
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
    
    deleteGradeCategory(gradeCategory : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete grade category?',
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
            let tempJSON = { "id" : gradeCategory.id };
            try
            {
                let response = await this.commonService.deleteGradeCategory(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Grade Category Deleted.");
                    this.commonSharedService.gradeCategoryListObject.next({result : "success"});
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
