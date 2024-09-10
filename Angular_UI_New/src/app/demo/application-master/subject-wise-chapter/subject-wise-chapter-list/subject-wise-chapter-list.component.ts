import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SubjectWiseChapterAddComponent } from '../subject-wise-chapter-add/subject-wise-chapter-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { SubjectwiseChapterEditComponent } from '../subject-wise-chapter-edit/subject-wise-chapter-edit.component';

@Component({
    selector: 'app-subject-wise-chapter-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './subject-wise-chapter-list.component.html',
    styleUrls: ['./subject-wise-chapter-list.component.scss']
})
export class SubjectWiseChapterListComponent {
    
    subjectWiseChapters : any [];
    searchClicked : boolean;
    searchClickedGrade : boolean;
    searchClickedSyllabus : boolean;    
    searchClickedSubject : boolean;
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm : FormGroup;
    academicSessions : any[];
    grades : any[];
    gradeCategories : any[];
    gradeWiseSyllabuses : any[];
    syllabusWiseSubjects : any[];
    
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
        this.searchClickedSubject = false;
        this.subjectWiseChapters  = [];
        this.academicSessions = [];
        this.gradeCategories = [];
        this.grades = [];
        this.gradeWiseSyllabuses = [];
        this.syllabusWiseSubjects = [];
        this.getSubjectWiseChapters(0,0,0,0,0,'All');

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['0']
        });
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['0']
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['0']
        });
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['0']
        });
        this.subjectForm = this.formbuilder.group({
            "subject" : ['0']
        });

        this.getAcademicSessions();
        this.getGradeCategories();
    }

    public gradeAddResult:any = this.commonSharedService.subjectWiseChapterListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getSubjectWiseChapters(0,0,0,0,0,'All');
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
    async getGradeCategories() 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "0", name : "All"});
                this.grades.unshift({ id : "0", name : "All"}); 
                this.getGrades();
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
    async getGrades() 
    {  
        try 
        {
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "")
            {
                this.searchClickedGrade = true;
                let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.grades = response.grades;
                    this.grades.unshift({ id : "0", name : "All"});
                    this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
                        id : "0",
                        name : "All"
                        }
                    });
                    this.gradeForm.get("grade").setValue(this.grades[0].id);
                    this.getGradeWiseSyllabuses();
                    this.searchClickedGrade = false;
                }
                else
                {
                    this.grades = [];
                    this.grades.unshift({ id : "0", name : "All"});
                    this.searchClickedGrade = false;
                }
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

    // get syllabus using grade wise syllabus
    async getGradeWiseSyllabuses() 
    {
        try
        {
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            let gradeId = this.gradeForm.get("grade").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            {
                this.searchClickedSyllabus = true;
                let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
                    this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
                        id : "0",
                        name : "All"
                        }
                    });
                    this.syllabusForm.get("syllabus").setValue(this.gradeWiseSyllabuses[0].id);
                    this.getSyllabusWiseSubjects();
                    this.searchClickedSyllabus = false;
                }
                else
                {
                    this.gradeWiseSyllabuses = [];
                    this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : 
                        {
                        id : "0",
                        name : "All"
                        }  
                    });
                    this.searchClickedSyllabus = false;
                }
            } 
            else
            {
                this.gradeWiseSyllabuses = [];
                this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
                    id : "0",
                    name : "All"
                    }  
                });
                this.searchClickedSyllabus = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedSyllabus = false;
        }
    }

    //get subject using syllabus wise subject
    async getSyllabusWiseSubjects() 
    {
        try
        {
            let academicSessionId = this.academicSessionForm.get('academicSession').value;
            let syllabusId = this.syllabusForm.get('syllabus').value;
            let gradeId = this.gradeForm.get('grade').value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "" && gradeCategoryId != undefined && gradeCategoryId != "")
            {
                this.searchClickedSubject = true;
                let response = await this.commonService.getSubjects(syllabusId, gradeCategoryId, gradeId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.syllabusWiseSubjects = response.syllabusWiseSubjects;
                    this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
                    this.searchClickedSubject = false;
                }
                else
                {
                    this.syllabusWiseSubjects = [];
                    this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
                    this.searchClickedSubject = false;
                }  
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedSubject = false;
        }
    }


    filterData()
    {
        let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
        let syllabusId : number = this.syllabusForm.get("syllabus").value;
        let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
        let gradeId : number = this.gradeForm.get("grade").value;
        let subjectId : number = this.subjectForm.get('subject').value;

        this.getSubjectWiseChapters(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, 'All');
    }

    async getSubjectWiseChapters(academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, subjectId : number, action : string) 
    {
        try
        { 
            this.searchClicked = true;
            let response = await this.commonService.getSubjectWiseChapters(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSubjectWiseChapter').DataTable().destroy();
                this.subjectWiseChapters = response.subjectWiseChapters;
                setTimeout(function(){
                $('#tblSubjectWiseChapter').DataTable();
                }, 1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.subjectWiseChapters = [];
                this.searchClicked = false;
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }  
    }
    
    addSubjectWiseChapter()
    {
        const dialogRef = this.modalService.open(SubjectWiseChapterAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editSubjectWiseChapter(subjectWiseChapters : any)
    {
        const dialogRef = this.modalService.open(SubjectwiseChapterEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = subjectWiseChapters;
    }
    
    updateStatus(subjectWiseChapter : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (subjectWiseChapter.isActive == 1 ? 'de-active' : 'active') + ' the subject wise chapter?',
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
                    id : subjectWiseChapter.id,
                    tableName : subjectWiseChapter.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Subject Wise Chapter " + (subjectWiseChapter.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.subjectWiseChapterListObject.next({
                        result : "success", 
                        responseData : {
                        academicSessionId : subjectWiseChapter.academicSession.id,
                        gradeId : subjectWiseChapter.grade.id,
                        syllabusId : subjectWiseChapter.syllabus.id,
                        subjectId : subjectWiseChapter.subject.id
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
    
    deleteSubjectWiseChapter(subjectWiseChapter : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete subject wise chapter?',
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
            let tempJSON = { "id" : subjectWiseChapter.id };
            try
            {
                let response = await this.commonService.deleteSubjectWiseChapter(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Subject Wise Chapter Deleted.");
                    this.commonSharedService.subjectWiseChapterListObject.next({result : "success"});
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
