import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolingProgramAddComponent } from '../schooling-program-add/schooling-program-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { SchoolingProgramEditComponent } from '../schooling-program-edit/schooling-program-edit.component';

@Component({
    selector: 'app-schooling-program-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './schooling-program-list.component.html',
    styleUrls: ['./schooling-program-list.component.scss']
})
export class SchoolingProgramListComponent {
    schoolingPrograms : any[];
    schoolingCategories : any[];
    schoolingCategoryForm : FormGroup;
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
        this.schoolingPrograms = [];

        this.schoolingCategoryForm = this.formbuilder.group({
            "schoolingCategory" : ['0']
        });
        this.getSchoolingCatrgories();
        this.getSchoolingPrograms(0, 'All');
    }

    public gradeAddResult:any = this.commonSharedService.schoolingProgramListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.schoolingCategoryForm.get("schoolingCategory").setValue(res.responseData.schoolingCategoryId);
            this.getSchoolingPrograms(res.responseData.schoolingCategoryId, 'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSchoolingCatrgories() 
    {
        try 
        {
            this.searchClicked = true;
            let response = await this.commonService.getSchoolingCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.schoolingCategories = response.schoolingCategories;
                this.schoolingCategories.unshift({ id : 0, name : "All"});
                this.searchClicked = false;
            }
            else
            {
                this.schoolingCategories = [];
                this.searchClicked = false;
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
            this.searchClicked = false;
        }
    }


    filterData()
    {
        let schoolingCategoryId : number = this.schoolingCategoryForm.get("schoolingCategory").value;
        if(!isNaN(schoolingCategoryId) && schoolingCategoryId > 0)
        {
            this.getSchoolingPrograms(schoolingCategoryId, 'All');
        }
        else
        {
            this.getSchoolingPrograms(schoolingCategoryId, 'All');
        }
    }

    async getSchoolingPrograms(schoolingCategoryId : number, action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getSchoolingPrograms(schoolingCategoryId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSchoolProgram').DataTable().destroy();
                this.schoolingPrograms = response.schoolingPrograms;
                setTimeout(function(){
                $('#tblSchoolProgram').DataTable();
                },1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.schoolingPrograms = [];
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    addSchoolProgram()
    {
        const dialogRef = this.modalService.open(SchoolingProgramAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    updateSchoolingProgram(schoolingProgram : any)
    {
        const dialogRef = this.modalService.open(SchoolingProgramEditComponent,
        {
            size: 'md', backdrop: 'static'            
        });
        dialogRef.componentInstance.modalParams = schoolingProgram;
    }

    updateStatus(schoolingProgram : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (schoolingProgram.isActive == 1 ? 'de-active' : 'active') + ' the schooling program?',
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
                    id : schoolingProgram.id,
                    tableName : schoolingProgram.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Schooling Program " + (schoolingProgram.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.schoolingProgramListObject.next({
                        result : "success", 
                        responseData : {
                        schoolingCategoryId : schoolingProgram.schoolingCategory.id
                        }
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
    
    deleteSchoolingProgram(schoolingProgram : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete school program?',
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
            let tempJSON = { "id" : schoolingProgram.id };
            try
            {
                let response = await this.commonService.deleteSchoolingProgram(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "School Program Deleted.");
                    this.commonSharedService.schoolingProgramListObject.next({
                        result : "success",
                        responseData : {
                            schoolingCategoryId : schoolingProgram.schoolingCategory.id
                        } 
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
