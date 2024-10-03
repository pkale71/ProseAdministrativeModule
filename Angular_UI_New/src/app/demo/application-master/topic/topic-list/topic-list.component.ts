import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { TopicAddComponent } from '../topic-add/topic-add.component';
import { TopicEditComponent } from '../topic-edit/topic-edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-topic-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './topic-list.component.html',
    styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent {
  
    searchClicked : boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    subjectClicked : boolean;
    chapterClicked : boolean;
    topics : any [];
    academicSessionForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm : FormGroup;
    chapterForm : FormGroup;
    academicSessions : any[];
    grades : any[];
    syllabuses : any[];
    subjects : any[];
    chapters : any[];
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private commonService: CommonService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {   
            this.topics = [];
            this.academicSessions = [];
            this.grades = [];
            this.syllabuses = [];
            this.subjects = [];
            this.chapters = [];
        }

    ngOnInit() 
    {
        this.searchClicked = false; 
        this.gradeClicked = false;
        this.syllabusClicked = false;
        this.subjectClicked = false;
        this.chapterClicked = false;
        this.getTopics(0,0,0,0,0,'All');

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['0']
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
        this.chapterForm = this.formbuilder.group({
            'chapter' : ['0']
        });

        this.getGrades();
    }

    public gradeAddResult:any = this.commonSharedService.topicListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getTopics(res.gradeCategoryId, res.gradeId, res.syllabusId, res.subjectId, res.chapterId, 'All');
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
            this.gradeClicked = true;
            let response = await this.commonService.getGrades(0, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.grades = response.grades;
                this.grades.unshift({ id : "0", name : "All"});
                this.gradeForm.get("grade").setValue(this.grades[0].id);
                this.getSyllabuses(0);
                this.gradeClicked = false;
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
            this.syllabusClicked = true;
            let gradeId = this.gradeForm.get("grade").value;
            if(gradeId != undefined && gradeId != "")
            {
                let response = await this.commonService.getSyllabuses(gradeCategoryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.syllabuses = response.syllabuses;
                    this.syllabuses.unshift({ id : "0", name : "All" });
                    this.syllabusForm.get("syllabus").setValue(this.syllabuses[0].id);
                    this.getSubjects();
                    this.syllabusClicked = false;
                }
                else
                {
                    this.syllabuses = [];
                    this.syllabuses.unshift({ id : "0", name : "All" });
                    this.syllabusClicked = false;
                }
            } 
            else
            {
                this.syllabuses = [];
                this.syllabuses.unshift({ id : "0", name : "All" });
                this.syllabusClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.syllabusClicked = false;
        }
    }
    
    //get subject
    async getSubjects() 
    {
        try
        {
            this.subjectClicked = true;
            let gradeId = this.gradeForm.get('grade').value;
            let syllabusId = this.syllabusForm.get('syllabus').value;
            if(syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "")
            {
                if( gradeId > 0 && syllabusId > 0)
                {
                    let response = await this.commonService.getSubjects(0, gradeId, syllabusId, 'All').toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.subjects = response.subjects;
                        this.subjects.unshift({ id : "0", name : "All"});
                        this.getChapters();
                        this.subjectClicked = false;
                    }
                    else
                    {
                        this.subjects = [];
                        this.subjects.unshift({ id : "0", name : "All"});
                        this.getChapters();
                        this.subjectClicked = false;
                    }  
                }
                else
                {
                    this.subjects = [];
                    this.subjects.unshift({ id : "0", name : "All"});
                    this.getChapters();
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
    
    //get chapter 
    async getChapters()
    {
        try
        { 
            this.chapterClicked = true;
            let gradeId = this.gradeForm.get('grade').value;
            let syllabusId = this.syllabusForm.get('syllabus').value;
            let subjectId = this.subjectForm.get('subject').value;
            if(syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "")
            {
                if(gradeId > 0 && syllabusId > 0 && subjectId > 0)
                {
                    let response = await this.commonService.getChapters(0, gradeId, syllabusId, subjectId, 'All').toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.chapters = response.chapters;
                        this.chapters.unshift({ id : "0", name : "All"});
                        this.chapterClicked = false;
                    }
                    else
                    {
                        this.chapters = [];
                        this.chapters.unshift({ id : "0", name : "All"});
                        this.chapterClicked = false;
                    }
                }
                else
                {
                    this.chapters = [];
                    this.chapters.unshift({ id : "0", name : "All" });
                    this.chapterClicked = false;
                }
            }
            else
            {
                this.chapters = [];
                this.chapters.unshift({ id : "0", name : "All"});
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
        let gradeId : number = this.gradeForm.get("grade").value;
        let syllabusId : number = this.syllabusForm.get("syllabus").value;
        let subjectId : number = this.subjectForm.get('subject').value;
        let chapterId : number = this.chapterForm.get('chapter').value;
        this.getTopics(0, gradeId, syllabusId, subjectId, chapterId, 'All');
    }

    async getTopics(gradeCategoryId : number, gradeId : number, syllabusId : number, subjectId : number, chapterId : number, action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getTopics(gradeCategoryId, gradeId, syllabusId, subjectId, chapterId, action).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblTopic').DataTable().destroy();
                this.topics = response.topics;
                setTimeout(function(){
                $('#tblTopic').DataTable();
                }, 1000);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.searchClicked = false;
                this.topics = [];
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
        }  
    }

    addTopic()
    {
        const dialogRef = this.modalService.open(TopicAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editTopic(topics : any)
    {
        const dialogRef = this.modalService.open(TopicEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = topics;
    }

    updateStatus(topic : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (topic.isActive == 1 ? 'de-active' : 'active') + ' the topic?',
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
                    id : topic.id,
                    tableName : topic.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.changeSubChapTopStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Topic " + (topic.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.topicListObject.next({
                        result : "success", 
                        responseData : {
                            gradeCategoryId : topic.gradeCategory.id,
                            gradeId : topic.grade.id,
                            syllbusId : topic.syllabus.id,
                            subjectId : topic.subject.id,
                            chapterId : topic.chapter.id
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
    
    deleteTopic(topic : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete topic?',
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
            let tempJSON = { "id" : topic.id };
            try
            {
                let response = await this.commonService.deleteTopic(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Topic Deleted.");
                    this.commonSharedService.topicListObject.next({
                        result : "success",
                        response : {
                            gradeCategoryId : topic.gradeCategory.id,
                            gradeId : topic.grade.id,
                            syllabusId : topic.syllabus.id,
                            subjectId : topic.subject.id,
                            chapterId : topic.chapter.id
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
