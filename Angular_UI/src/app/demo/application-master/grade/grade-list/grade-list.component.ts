import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeAddComponent } from '../grade-add/grade-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { id } from 'date-fns/locale';

@Component({
    selector: 'app-grade-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './grade-list.component.html',
    styleUrls: ['./grade-list.component.scss']
})
export class GradeListComponent 
{  
    grades : any [];
    loadingData : boolean;
    searchClicked : boolean;
    gradeCategories: any[];
    gradeCategoryForm: FormGroup;
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {
            // this.grades = this.activatedRoute.snapshot.data['grades'].data.grades;
        }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.loadingData = false;
        this.getGradeCategories();
        this.grades = [];

        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['']
        });        
        this.getGrades(0, 'All');
    }

    public gradeAddResult:any = this.commonSharedService.gradeListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.gradeCategoryForm.get("gradeCategory").setValue(res.gradeCategoryId);
            this.getGrades(res.gradeCategoryId, 'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getGrades(gradeCategoryId : any, action : string) 
    {  
        try
        {
            //get Grade Categories
            this.loadingData = true;
            this.searchClicked = true; 
            gradeCategoryId = gradeCategoryId.toString() == '' ? 0 : gradeCategoryId; 
            let response = await this.commonService.getGrades(gradeCategoryId, action).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblGrade').DataTable().destroy();
                this.grades = response.grades;
                setTimeout(function(){
                $('#tblGrade').DataTable();
                },1000);
                this.loadingData = false;
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.loadingData = false;
                this.searchClicked = false;
                this.modalService.dismissAll(); 
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.loadingData = false;
            this.searchClicked = false;
        }
    }

    //gradeCategory
    async getGradeCategories() 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "", name : "All"});
            }
            else
            {
                this.gradeCategories = [];
                this.gradeCategories.unshift({ id : "", name : "All"});
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
        }
    }

    filterData()
    {
        let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
        if(!isNaN(gradeCategoryId) && gradeCategoryId > 0)
        {
            this.getGrades(gradeCategoryId, 'All');
        }
        else
        {
            this.getGrades(gradeCategoryId, 'All');
        }
    }
    
    addGradeForm()
    {
        const dialogRef = this.modalService.open(GradeAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    updateStatus(grade : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (grade.isActive == 1 ? 'de-active' : 'active') + ' the grade?',
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
                    id : grade.id,
                    tableName : grade.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Grade " + (grade.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.gradeListObject.next({
                        gradeCategoryId : grade.gradeCategory.id,
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

    deleteGrade(grade : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete grade?',
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
            let tempJSON = { "id" : grade.id };
            try
            {
                let response = await this.commonService.deleteGrade(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Grade Deleted.");
                    this.commonSharedService.gradeListObject.next({
                        gradeCategoryId : grade.gradeCategory.id,  
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
