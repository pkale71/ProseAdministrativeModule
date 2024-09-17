import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-topic-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './topic-edit.component.html',
    styleUrls: ['./topic-edit.component.scss']
})
export class TopicEditComponent {
    @Input() public modalParams;
    editTopicForm: FormGroup;
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm : FormGroup;
    chapterForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    subjectClicked : boolean;
    chapterClicked : boolean;
    academicSessions : any[];
    gradeCategories : any[];
    grades : any[];
    syllabuses : any[];
    subjects : any[];
    chapters : any[];
    topics : any;

    constructor(private commonService: CommonService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        )
    {
        this.academicSessions = [];
        this.gradeCategories = [];
        this.grades = [];
        this.syllabuses = [];
        this.subjects = [];
        this.chapters = [];
    }

    ngOnInit() 
    {
        //get modal params
        this.topics = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.syllabusClicked = false;
        this.subjectClicked = false;
        this.chapterClicked = false;
        
        this.editTopicForm = this.formbuilder.group({
            id:[''],
            name: ['', [Validators.required]],
            academicSession : this.formbuilder.group({ 'id': [''] }),
            gradeCategory : this.formbuilder.group({ 'id': [''] }),
            grade : this.formbuilder.group({ 'id': [''] }),
            syllabus : this.formbuilder.group({ 'id': [''] }),      
            subject : this.formbuilder.group({ 'id': [''] }),      
            chapter : this.formbuilder.group({ 'id': [''] })
        });

        this.academicSessionForm = this.formbuilder.group({
            'applicableFromYear' : ['', Validators.required]
        });
        this.gradeCategoryForm = this.formbuilder.group({
            'gradeCategory' : ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            'grade' : ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            'syllabus' : ['', Validators.required]
        });
        this.subjectForm = this.formbuilder.group({
            'subject' : ['', Validators.required]
        });
        this.chapterForm = this.formbuilder.group({
            'chapter' : ['', Validators.required]
        });
        // assign form data
        this.editTopicForm.patchValue(this.topics);
        this.academicSessionForm.get("applicableFromYear").setValue(this.topics.applicableFromYear.id);
        this.getAcademicSessions();
        this.gradeCategoryForm.get("gradeCategory").setValue(this.topics.gradeCategory.id);
        this.getGradeCategories(this.topics.gradeCategory);
        this.gradeForm.get("grade").setValue(this.topics.grade.id);
        this.getGrades(this.topics.grade);
        this.syllabusForm.get("syllabus").setValue(this.topics.syllabus.id);
        this.getSyllabuses(this.topics.syllabus);
        this.subjectForm.get('subject').setValue(this.topics.subject.id);
        this.getSubjects(this.topics.subject);
        this.chapterForm.get('chapter').setValue(this.topics.chapter.id);
        this.getChapters(this.topics.chapter);
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get academic session
    async getAcademicSessions() 
    {
        let response = await this.commonService.getAcademicSessions().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.academicSessions = response.academicSessions;
            this.academicSessions.unshift({ id: "", year: "Select Applicable From Year" });
        }
        else
        {
            this.academicSessions = [];
            this.academicSessions.unshift({ id: "", year: "Select Applicable From Year" });
        }
    }

    //gradeCategory
    async getGradeCategories(gradeCategory : any) 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
                // here access deactive data
                if(gradeCategory != '')
                {
                    let filterGradeCategory = this.gradeCategories.filter(tempGradeCategory => parseInt(tempGradeCategory.id) == parseInt(gradeCategory.id));
                    if(filterGradeCategory.length == 0)
                    {
                        this.gradeCategories.push({ id : gradeCategory.id, name : gradeCategory.name });
                    }
                }
            }
            else
            {
                this.gradeCategories = [];
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
        }
    }
    
    // get grades
    async getGrades(grade : any) 
    {  
        try 
        {
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "")
            {
                this.gradeClicked = true;
                let response = await this.commonService.getGrades(gradeCategoryId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.grades = response.grades;
                    this.grades.unshift({ id: "", name: "Select Grade" });
                    this.gradeClicked = false;
                    // here access deactive data
                    if(grade != '')
                    {
                        let filterGrade = this.grades.filter(tempGrade => parseInt(tempGrade.id) == parseInt(grade.id))
                        {
                            if(filterGrade.length == 0)
                            {
                                this.grades.push({ id : grade.id, name : grade.name });
                            }
                        }
                    }
                }
                else
                {
                    this.grades = [];
                    this.grades.unshift({ id: "", name: "Select Grade" });
                    this.gradeClicked = false;
                }
            }
            else
            {
                this.grades = [];
                this.grades.unshift({ id: "", name: "Select Grade" });
                this.gradeClicked = false;
            }    
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.gradeClicked = false;
        }
    }

    //get syllabus 
    async getSyllabuses(syllabus : any) 
    {
        try
        {
            // this.syllabusForm.get("syllabus").setValue("");
            // this.subjectForm.get("syllabusWiseSubject").setValue("");
            // this.chapterForm.get("subjectWiseChapter").setValue("");
            // this.gradeWiseSyllabuses = [];
            // this.syllabusWiseSubjects = [];
            // this.subjectWiseChapters = [];
            this.syllabusClicked = true;
            let response = await this.commonService.getSyllabuses('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabuses = response.syllabuses;
                this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
                this.syllabusClicked = false;
                // here access dactive data
                if(syllabus != '')
                {
                    let filterSyllabus = this.syllabuses.filter(tempSyllabus => parseInt(tempSyllabus.id) == parseInt(syllabus.id));
                    if(filterSyllabus.length == 0)
                    {
                        this.syllabuses.push({ id : syllabus.id, name : syllabus.name });
                    }
                }
            }
            else
            {
                this.syllabuses = [];
                this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
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
    async getSubjects(subject : any) 
    {
        try
        {
            // this.subjectForm.get("syllabusWiseSubject").setValue("");
            // this.chapterForm.get("subjectWiseChapter").setValue("");
            // this.syllabusWiseSubjects = [];
            // this.subjectWiseChapters = [];
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            let gradeId = this.gradeForm.get("grade").value;
            let syllabusId = this.syllabusForm.get("syllabus").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "" && syllabusId != undefined && syllabusId != "")
            {
                this.subjectClicked = true;
                let response = await this.commonService.getSubjects(gradeCategoryId, gradeId, syllabusId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.subjects = response.subjects;
                    this.subjectClicked = false;
                    this.subjects.unshift({ id : "", name : "Select Subject"});
                    this.chapters.unshift({ id : "", name : "Select Chapter"});
                    // here access deactive data 
                    if(subject != '')
                    {
                        let filterSubject = this.subjects.filter(tempSubject => parseInt(tempSubject.id) == parseInt(subject.id));
                        if(filterSubject.length == 0)
                        {
                            this.subjects.push({ id : subject.id, name : subject.name });
                        }
                    }
                }
                else
                {
                    this.subjects = [];
                    this.subjects.unshift({ id : "", name : "Select Subject"});
                    this.subjectClicked = false;
                }  
            }
            else
            {
                this.subjects = [];
                this.subjects.unshift({ id : "", name : "Select Subject"});
                this.subjectClicked = false;
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.subjectClicked = false;
        }
    }

    //get chapter 
    async getChapters(chapter : any) 
    {
        try
        { 
            // this.chapterForm.get("subjectWiseChapter").setValue("");
            // this.subjectWiseChapters = [];
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            let gradeId = this.gradeForm.get("grade").value;
            let syllabusId = this.syllabusForm.get("syllabus").value
            let subjectId = this.subjectForm.get("subject").value
            if(gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "" && syllabusId != undefined && syllabusId != "" && subjectId != undefined && subjectId != "" )
            {
                this.chapterClicked = true;
                let response = await this.commonService.getChapters(gradeCategoryId, gradeId, syllabusId, subjectId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.chapters = response.chapters;
                    this.chapters.unshift({ id : "", name : "Select Chapter" });
                    this.chapterClicked = false;
                    // here access deactive data
                    if(chapter != '')
                    {
                        let filterChapter = this.chapters.filter(tempChapter => parseInt(tempChapter.id) == parseInt(chapter.id));
                        if(filterChapter.length == 0)
                        {
                            this.chapters.push({ id : chapter.id, name : chapter.name });
                        }
                    }
                }
                else
                {
                    this.chapters = [];
                    this.chapters.unshift({ id : "", name : "Select Chapter"});
                    this.chapterClicked = false;
                }
            }
            else
            {
                this.chapters = [];
                this.chapters.unshift({ id : "", name : "Select Chapter"});
                this.chapterClicked = false;
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
            this.chapterClicked = false;
        }  
    }

    async saveTopic()
    {
        if(!this.saveClicked)
        {
            if(this.editTopicForm.valid && this.academicSessionForm.valid && this.chapterForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true; 
                try
                {
                    let tempJSON = {
                        "id" : this.topics.id,
                        "applicableFromYear" : { "id" : this.academicSessionForm.get('applicableFromYear').value },
                        "chapter" : { "id" : this.chapterForm.get('chapter').value },
                        "name" : this.editTopicForm.get('name').value
                    }
                    let response = await this.commonService.updateTopic(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Topic Updated");
                        this.commonSharedService.topicListObject.next({
                            result : "success",
                            response : {
                                gradeCategoryId : this.gradeCategoryForm.get('gradeCategory').value,
                                gradeId : this.gradeForm.get('grade').value,
                                syllabusId : this.syllabusForm.get('syllabus').value,
                                subjectId : this.subjectForm.get('subject').value,
                                chapterId : this.chapterForm.get('chapter').value
                            }
                        });
                        this.closeModal();
                    }
                    else
                    {
                        this.showNotification("error", "Topic Not Updated");
                    }
                }
                catch(e)
                {
                    this.showNotification("error", e);
                    this.isValidForm = false;
                    this.saveClicked = false;
                }
            }
            else
            {
                this.isValidForm = false;
                this.saveClicked = false;
            }
        }
    }

    closeModal()
    {
        this.activeModal.close(); 
    }
}
