import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeWiseSyllabusAddComponent } from '../grade-wise-syllabus-add/grade-wise-syllabus-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { GradeWiseSyllabusEditComponent } from '../grade-wise-syllabus-edit/grade-wise-syllabus-edit.component';

@Component({
    selector: 'app-grade-wise-syllabus-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './grade-wise-syllabus-list.component.html',
    styleUrls: ['./grade-wise-syllabus-list.component.scss']
})
export class GradeWiseSyllabusListComponent {

    gradeWiseSyllabuses : any [];
    searchClicked : boolean;
    gradeCategories : any[];
    grades : any[];
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    academicSessions : any[];
    
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
        this.gradeWiseSyllabuses = [];
        this.gradeCategories = [];
        this.academicSessions = [];
        this.grades = [];
        this.getGradeWiseSyllabuses(0, 0, 0, 'All');
        this.getAcademicSessions();
        this.getGradeCategories('All');

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['0']
        })
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['0']
        })
        this.gradeForm = this.formbuilder.group({
            "grade" : ['0']
        })
    }

    public gradeAddResult:any = this.commonSharedService.gradeWiseSyllabusListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.academicSessionForm.get("academicSession").setValue(res.responseData.academicSessionId);
            this.gradeCategoryForm.get("gradeCategory").setValue(res.responseData.gradeCategoryId);
            this.getGrades(res.responseData.gradeId);
            this.gradeForm.get("grade").setValue(res.responseData.gradeId);
            this.getGradeWiseSyllabuses(res.responseData.academicSessionId, res.responseData.gradeCategoryId, res.responseData.gradeId,'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get academic session
    async getAcademicSessions() 
    {
        try
        {
            let response = await this.commonService.getAcademicSessions().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.academicSessions = response.academicSessions;
                this.academicSessions.unshift({ id: "0", name : "All"});
            }
            else
            {
                this.academicSessions = [];
                this.academicSessions.unshift({ id: "0", name : "All"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    //gradeCategory
    async getGradeCategories(action : string) 
    {
        try
        {
        let response = await this.commonService.getGradeCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "0", name : "All"});
                this.grades.unshift({ id : "0", name : "All"});
            }
            else
            {
                this.gradeCategories = [];
                this.gradeCategories.unshift({ id : "0", name : "All"});
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
        }
    }
    
    // get grades
    async getGrades(gradeId : any) 
    {  
        try 
        {
            this.searchClicked = true;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "")
            {
                let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.grades = response.grades;
                    this.searchClicked = false;
                    this.grades.unshift({ id : "0", name : "All"});
                    
                    if(gradeId == '')
                    {
                        this.gradeForm.get("grade").setValue(this.grades[0].id);
                    }
                    else
                    {
                        this.gradeForm.get("grade").setValue(gradeId);
                    }
                }
                else
                {
                    this.searchClicked = false;
                    this.grades = [];
                    this.grades.unshift({ id : "0", name : "All"});
                }
            }
            else
            {
            this.searchClicked = false;
            this.grades = [];
            this.grades.unshift({ id : "0", name : "All"});
            }    
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }


    filterData()
    {
        let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
        let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
        let gradeId : number = this.gradeForm.get("grade").value;
        this.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'All');
    }

    async getGradeWiseSyllabuses(academicSessionId : number, gradeCategoryId : number, gradeId : number, action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblGradeWiseSyllabus').DataTable().destroy();
                this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
                setTimeout(function(){
                $('#tblGradeWiseSyllabus').DataTable();
                },1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.searchClicked = false;
                this.gradeWiseSyllabuses = [];
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
            this.gradeWiseSyllabuses = [];
        }
    }
    
    addGradeWiseSyllabus()
    {
        const dialogRef = this.modalService.open(GradeWiseSyllabusAddComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    updateGradeWiseSyllabus(gradeWiseSyllabus : any)
    {
        const dialogRef = this.modalService.open(GradeWiseSyllabusEditComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = gradeWiseSyllabus;
    }

    updateStatus(gradeWiseSyllabus : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (gradeWiseSyllabus.isActive == 1 ? 'de-active' : 'active') + ' the grade wise syllabus?',
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
                    id : gradeWiseSyllabus.id,
                    tableName : gradeWiseSyllabus.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Grade wise syllabus " + (gradeWiseSyllabus.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.gradeWiseSyllabusListObject.next({
                        result : "success", 
                        responseData : {
                        academicSessionId : this.academicSessionForm.get("academicSession").value,
                        gradeCategoryId : this.gradeCategoryForm.get("gradeCategory").value,
                        gradeId : this.gradeForm.get("grade").value
                        }
                    });
                    this.modalService.dismissAll();
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });   
    }
    
    deleteGradeWiseSyllabus(gradeWiseSyllabus : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete grade wise syllabus?',
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
            let tempJSON = { "id" : gradeWiseSyllabus.id };
            try
            {
                let response = await this.commonService.deleteGradeWiseSyllabus(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Grade Wise Syllabus Deleted.");
                    this.commonSharedService.gradeWiseSyllabusListObject.next({
                        result : "success",
                        responseData : {
                            academicSessionId : this.academicSessionForm.get("academicSession").value,
                            gradeCategoryId : this.gradeCategoryForm.get("gradeCategory").value,
                            gradeId : this.gradeForm.get("grade").value
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
