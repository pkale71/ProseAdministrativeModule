import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { ChapterWiseTopicAppComponent } from '../chapter-wise-topic-add/chapter-wise-topic-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { ChapterWiseTopicEditComponent } from '../chapter-wise-topic-edit/chapter-wise-topic-edit.component';

@Component({
    selector: 'app-chapter-wise-topic-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './chapter-wise-topic-list.component.html',
    styleUrls: ['./chapter-wise-topic-list.component.scss']
})
export class ChapterWiseTopicListComponent {
  
    searchClicked : boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    subjectClicked : boolean;
    chapterClicked : boolean;
    chapterWiseTopics : any [];
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm : FormGroup;
    chapterForm : FormGroup;
    academicSessions : any[];
    gradeCategories : any[];
    grades : any[];
    gradeWiseSyllabuses : any[];
    syllabusWiseSubjects : any[];
    subjectWiseChapters : any[];
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {   
            this.chapterWiseTopics = [];
            this.academicSessions = [];
            this.gradeCategories = [];
            this.grades = [];
            this.gradeWiseSyllabuses = [];
            this.syllabusWiseSubjects = [];
            this.subjectWiseChapters = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false; 
        this.gradeClicked = false;
        this.syllabusClicked = false;
        this.subjectClicked = false;
        this.chapterClicked = false;
        this.getChapterWiseTopics(0,0,0,0,0,0,'All');

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['0']
        })
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['0']
        })
        this.gradeForm = this.formbuilder.group({
            "grade" : ['0']
        })
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['0']
        })
        this.subjectForm = this.formbuilder.group({
            "subject" : ['0']
        })
        this.chapterForm = this.formbuilder.group({
            'chapter' : ['0']
        })

        this.getAcademicSessions();
        this.getGradeCategories();
    }

    public gradeAddResult:any = this.commonSharedService.chapterWiseTopicListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getChapterWiseTopics(0,0,0,0,0,0,'All');
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
            this.gradeClicked = true;
            // this.grades = [];
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "")
            {
                let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.grades = response.grades;
                    this.grades.unshift({ id : "0", name : "All"});
                    // this.gradeWiseSyllabuses = [];
                    this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
                        id : "0",
                        name : "All"
                        }
                    });
                    // this.syllabusWiseSubjects = [];
                    // this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
                    // this.subjectWiseChapters = [];
                    // this.subjectWiseChapters.unshift({ id : "0", name : "All"});
                    this.gradeForm.get("grade").setValue(this.grades[0].id);
                    this.getGradeWiseSyllabuses();
                    this.gradeClicked = false;
                }
                else
                {
                    this.grades = [];
                    this.grades.unshift({ id : "0", name : "All"});
                    this.gradeClicked = false;
                }
            }
            else
            {
                this.grades = [];
                this.grades.unshift({ id : "0", name : "All"});
                this.gradeClicked = false;
            }    
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.gradeClicked = false;
        }
    }
    
    // get syllabus using grade wise syllabus
    async getGradeWiseSyllabuses() 
    {
        try
        {
            this.syllabusClicked = true;
            // this.gradeWiseSyllabuses = [];
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            let gradeId = this.gradeForm.get("grade").value;
            if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            {
                let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
                    this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
                        id : "0",
                        name : "All"
                        }
                    });
                    // this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
                    this.syllabusForm.get("syllabus").setValue(this.gradeWiseSyllabuses[0].id);
                    this.getSyllabusWiseSubjects();
                    this.syllabusClicked = false;
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
                    this.syllabusClicked = false;
                }
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
                this.syllabusClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.syllabusClicked = false;
        }
    }
    
    //get subject using syllabus wise subject
    async getSyllabusWiseSubjects() 
    {
        try
        {
            // this.syllabusWiseSubjects = [];
            this.subjectClicked = true;
            let academicSessionId = this.academicSessionForm.get('academicSession').value;
            let syllabusId = this.syllabusForm.get('syllabus').value;
            let gradeId = this.gradeForm.get('grade').value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            {
                let response = await this.commonService.getSubjects(syllabusId, gradeCategoryId, gradeId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.syllabusWiseSubjects = response.syllabusWiseSubjects;
                    this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
                    this.getSubjectWiseChapters();
                    this.subjectClicked = false;

                }
                else
                {
                    this.syllabusWiseSubjects = [];
                    this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
                    this.subjectClicked = false;
                }  
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.subjectClicked = false;
        }
    }
    
    //get chapter using subject wise chapter
    async getSubjectWiseChapters()
    {
        try
        { 
            this.chapterClicked = true;
            // this.subjectWiseChapters = [];
            let academicSessionId = this.academicSessionForm.get('academicSession').value;
            let syllabusId = this.syllabusForm.get('syllabus').value;
            let gradeId = this.gradeForm.get('grade').value;
            let gradeCategoryId = this.gradeCategoryForm.get('gradeCategory').value;
            let subjectId = this.subjectForm.get('subject').value;
            if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "")
            {
                let response = await this.commonService.getSubjectWiseChapters(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.subjectWiseChapters = response.subjectWiseChapters;
                    this.subjectWiseChapters.unshift({ id : "0", name : "All"});
                    this.chapterClicked = false;
                }
                else
                {
                    this.subjectWiseChapters = [];
                    this.subjectWiseChapters.unshift({ id : "0", name : "All"});
                    this.chapterClicked = false;
                }
            }
            else
            {
                this.subjectWiseChapters = [];
                this.subjectWiseChapters.unshift({ id : "0", name : "All"});
                this.chapterClicked = false;
            }  
        }  
        catch(e)
        {
            this.showNotification("error", e);
            this.chapterClicked = false;
        }  
    } 
    
    filterData()
    {
        let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
        let syllabusId : number = this.syllabusForm.get("syllabus").value;
        let gradeCategoryId = this.gradeCategoryForm.get('gradeCategory').value;
        let gradeId : number = this.gradeForm.get("grade").value;
        let subjectId : number = this.subjectForm.get('subject').value;
        let chapterId : number = this.chapterForm.get('chapter').value;
        this.getChapterWiseTopics(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, chapterId, 'All');
    }

    async getChapterWiseTopics(academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, subjectId : number, chapterId : number, action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getChapterWiseTopics(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, chapterId, action).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblChapterWiseTopic').DataTable().destroy();
                this.chapterWiseTopics = response.chapterWiseTopics;
                setTimeout(function(){
                $('#tblChapterWiseTopic').DataTable();
                }, 1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.searchClicked = false;
                this.chapterWiseTopics = [];
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
        }  
    }

    addChapterWiseTopic()
    {
        const dialogRef = this.modalService.open(ChapterWiseTopicAppComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editChapterWiseTopic(chapterWiseTopics : any)
    {
        const dialogRef = this.modalService.open(ChapterWiseTopicEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = chapterWiseTopics;
    }

    updateStatus(chapterWiseTopic : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (chapterWiseTopic.isActive == 1 ? 'de-active' : 'active') + ' the chapter wise topic?',
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
                    id : chapterWiseTopic.id,
                    tableName : chapterWiseTopic.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Chapter Wise Topic " + (chapterWiseTopic.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.chapterWiseTopicListObject.next({
                        result : "success", 
                        responseData : {
                            academicSessionId : chapterWiseTopic.academicSession.id,
                            chapterId : chapterWiseTopic.id
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
    
    deleteChapterWiseTopic(chapterWiseTopic : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete chapter wise topic?',
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
            let tempJSON = { "id" : chapterWiseTopic.id };
            try
            {
                let response = await this.commonService.deleteChapterWiseTopic(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Chapter Wise Topic Deleted.");
                    this.commonSharedService.chapterWiseTopicListObject.next({result : "success"});
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
