import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { ChapterAddComponent } from '../chapter-add/chapter-add.component';
import { ChapterEditComponent } from '../chapter-edit/chapter-edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-chapter-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './chapter-list.component.html',
    styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent {
    
    chapters : any [];
    searchClicked : boolean;
    searchClickedGrade : boolean;
    searchClickedSyllabus : boolean;    
    searchClickedSubject : boolean;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm : FormGroup;
    grades : any[];
    syllabuses : any[];
    subjects : any[];
    
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
        this.chapters  = [];
        this.grades = [];
        this.syllabuses = [];
        this.subjects = [];
        this.getChapters(0,0,0,0,'All');

        this.gradeForm = this.formbuilder.group({
            "grade" : ['0']
        });
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['0']
        });
        this.subjectForm = this.formbuilder.group({
            "subject" : ['0']
        });
        this.getGrades();
    }

    public gradeAddResult:any = this.commonSharedService.chapterListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getChapters(res.gradeCategoryId, res.gradeId, res.syllabusId, res.subjectId, 'All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
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
                this.grades.unshift({ id : "0", name : "All"});
                this.syllabuses.unshift({ id : "0", name : "All" });
                this.gradeForm.get("grade").setValue(this.grades[0].id);
                this.getSyllabuses();
                this.searchClickedGrade = false;
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
    async getSyllabuses() 
    {
        try
        {
            
            this.searchClickedSyllabus = true;
            let response = await this.commonService.getSyllabuses('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabuses = response.syllabuses;
                this.syllabuses.unshift({ id : "0", name : "All" });
                // this.syllabusForm.get("syllabus").setValue(this.syllabuses[0].id);
                this.getSubjects();
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

    //get subject 
    async getSubjects() 
    {
        try
        {
            let gradeId = this.gradeForm.get('grade').value;
            let syllabusId = this.syllabusForm.get('syllabus').value;
            if(gradeId != undefined && gradeId != "" && syllabusId != undefined && syllabusId != "")
            {
                if(gradeId > 0 && syllabusId > 0)
                {
                    this.searchClickedSubject = true;
                    let response = await this.commonService.getSubjects(0, gradeId, syllabusId, 'All').toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.subjects = response.subjects;
                        this.subjects.unshift({ id : "0", name : "All"});
                        this.searchClickedSubject = false;
                    }
                    else
                    {
                        this.subjects = [];
                        this.subjects.unshift({ id : "0", name : "All"});
                        this.searchClickedSubject = false;
                    } 
                }
                else
                {
                    this.subjects = [];
                    this.subjects.unshift({ id : "0", name : "All"});
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
        let gradeId : number = this.gradeForm.get("grade").value;
        let syllabusId : number = this.syllabusForm.get("syllabus").value;
        let subjectId : number = this.subjectForm.get('subject').value;
        this.getChapters(0, gradeId, syllabusId, subjectId, 'All');
    }

    async getChapters(gradeCategoryId : number, gradeId : number, syllabusId : number, subjectId : number, action : string) 
    {
        try
        { 
            this.searchClicked = true;
            let response = await this.commonService.getChapters(gradeCategoryId, gradeId, syllabusId, subjectId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblChapter').DataTable().destroy();
                this.chapters = response.chapters;
                setTimeout(function(){
                $('#tblChapter').DataTable();
                }, 1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.chapters = [];
                this.searchClicked = false;
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }  
    }
    
    addChapter()
    {
        const dialogRef = this.modalService.open(ChapterAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editChapter(chapters : any)
    {
        const dialogRef = this.modalService.open(ChapterEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = chapters;
    }
    
    updateStatus(chapter : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (chapter.isActive == 1 ? 'de-active' : 'active') + ' the chapter?',
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
                    id : chapter.id,
                    tableName : chapter.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.changeSubChapTopStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Chapter " + (chapter.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.chapterListObject.next({
                        result : "success", 
                        responseData : {
                            gradeCategoryId : chapter.gradeCategory.id,
                            gradeId : chapter.grade.id,
                            syllabusId : chapter.syllabus.id,
                            subjectId : chapter.subject.id
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
    
    deleteChapter(chapter : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete chapter?',
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
            let tempJSON = { "id" : chapter.id };
            try
            {
                let response = await this.commonService.deleteChapter(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Chapter Deleted.");
                    this.commonSharedService.chapterListObject.next({
                        result : "success",
                        responseData : {
                            gradeCategoryId : chapter.gradeCategory.id,
                            gradeId : chapter.grade.id,
                            syllabusId : chapter.syllabus.id,
                            subjectId : chapter.subject.id
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
