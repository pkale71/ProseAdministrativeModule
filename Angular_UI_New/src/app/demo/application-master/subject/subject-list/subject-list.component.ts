import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SubjectAddComponent } from '../subject-add/subject-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { SubjectEditComponent } from '../subject-edit/subject-edit.component';
import { SubjectDetailComponent } from '../subject-detail/subject-detail.component';

@Component({
    selector: 'app-subject-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './subject-list.component.html',
    styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent {
    
    subjects : any [];
    searchClicked : boolean;
    searchClickedGrade : boolean;
    searchClickedSyllabus : boolean;
    academicSessionForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    academicSessions : any[];
    grades : any[];
    syllabuses : any[];

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
        this.searchClickedGrade = false;
        this.searchClickedSyllabus = false;
        this.subjects = [];
        this.academicSessions = [];
        this.grades = [];
        this.syllabuses = [];
        this.getSubjects(0, 0, 0, 'All');

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['0']
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['0']
        });
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['0']
        });
        
        this.getAcademicSessions();
        this.getGrades();
    }

    public gradeAddResult:any = this.commonSharedService.subjectListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.gradeForm.get("grade").setValue(res.response.gradeId);
            this.getSyllabuses(res.response.gradeCategoryId);
            this.syllabusForm.get("syllabus").setValue(res.response.syllabusId);
            this.getSubjects(res.response.gradeCategoryId, res.response.gradeId, res.response.syllabusId, 'All');
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
                this.academicSessions.unshift({ id: "0", year : "All"});
            }
            else
            {
                this.academicSessions = [];
                this.academicSessions.unshift({ id: "0", year : "All"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }
    
    // get grades
    async getGrades() 
    {  
        try 
        {
            this.searchClickedGrade = true;
            let response = await this.commonService.getGrades(0, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.grades = response.grades;
                this.searchClickedGrade = false;
                this.grades.unshift({ id : "0", name : "All"});
                this.getSyllabuses(0);
            }
            else
            {
                this.grades = [];
                this.grades.unshift({ id : "0", name : "All"});
                this.searchClickedGrade = false;
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedGrade = false;
        }
    }

    // get syllabus 
    async getSyllabuses(gradeCategoryId : number) 
    {
        try
        {
            if(gradeCategoryId > 0)
            {
                let filterGrades = this.grades.filter(grade => grade.id == gradeCategoryId);
                if(filterGrades.length > 0)
                {
                    gradeCategoryId = filterGrades[0].gradeCategory.id;
                }
            }
            this.searchClickedSyllabus = true;
            let response = await this.commonService.getSyllabuses(gradeCategoryId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabuses = response.syllabuses;
                this.syllabuses.unshift({ id : "0", name : "All" });
                this.searchClickedSyllabus = false;
            }
            else
            {
                this.syllabuses = [];  
                this.syllabuses.unshift({ id : "0", name : "All" });
                this.searchClickedSyllabus = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);  
            this.searchClickedSyllabus = false;
        }
    }

    filterData()
    {
        let gradeId : number = this.gradeForm.get("grade").value;
        let syllabusId : number = this.syllabusForm.get("syllabus").value;
        this.getSubjects(0, gradeId, syllabusId, 'All');
    }

    async getSubjects(gradeCategoryId : number, gradeId : number, syllabusId : number, action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getSubjects(gradeCategoryId, gradeId, syllabusId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $("#tblSubject").DataTable().destroy();
                this.subjects = response.subjects;
                setTimeout(function(){
                $('#tblSubject').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.subjects = [];
                this.searchClicked = false;
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }
            
    addSubject()
    {
        const dialogRef = this.modalService.open(SubjectAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editSubject(subject : any)
    {
        const dialogRef = this.modalService.open(SubjectEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = subject;
    }

    detailSubject(subject : any)
    {
        const dialogRef = this.modalService.open(SubjectDetailComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = subject;
    }

    updateStatus(subject : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (subject.isActive == 1 ? 'de-active' : 'active') + ' the subject?',
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
                    id : subject.id,
                    tableName : subject.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.changeSubChapTopStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Subject " + (subject.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.subjectListObject.next({
                        result : "success", 
                        responseData : {
                            gradeCategoryId : subject.gradeCategory.id,
                            gradeId : subject.grade.id,
                            syllabusId : subject.syllabus.id
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
    
    deleteSubject(subject:any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete subject?',
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
            let tempJSON = { "id" : subject.id };
            try
            {
                let response = await this.commonService.deleteSubject(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Subject Deleted.");
                    this.commonSharedService.subjectListObject.next({
                        result : "success",
                        response : {
                            gradeCategoryId : subject.gradeCategory.id,
                            gradeId : subject.grade.id,
                            syllabusId : subject.syllabus.id
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
