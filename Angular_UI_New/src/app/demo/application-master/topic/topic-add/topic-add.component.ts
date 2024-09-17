import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-topic-add',
    standalone: true,
    imports: [CommonModule, SharedModule, TagInputModule],
    templateUrl: './topic-add.component.html',
    styleUrls: ['./topic-add.component.scss']
})
export class TopicAddComponent 
{
    @Input() public modalParams;
    addTopicForm: FormGroup;
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
    isChecked : boolean;
    academicSessions : any[];
    gradeCategories : any[];
    grades : any[];
    syllabuses : any[];
    subjects : any[];
    chapters : any[];
    names : string[] = [];

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
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.syllabusClicked = false;
        this.subjectClicked = false;
        this.chapterClicked = false;
        this.isChecked = false;

        this.addTopicForm = this.formbuilder.group({
            id :[''],
            name : [[this.names]],
            applicableFromYear : this.formbuilder.group({ 'id': [''] }),
            gradeCategory : this.formbuilder.group({ 'id': [''] }),
            grade : this.formbuilder.group({ 'id': [''] }),
            syllabus : this.formbuilder.group({ 'id': [''] }),      
            subject : this.formbuilder.group({ 'id': [''] }),      
            chapter : this.formbuilder.group({ 'id': [''] }),
            uploadFile : [''],
            selectedFile : ['']
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

        this.addTopicForm.controls['uploadFile'].clearValidators();
        this.addTopicForm.controls['name'].addValidators(Validators.required);
        this.addTopicForm.updateValueAndValidity();
        this.getAcademicSessions();
        this.getGradeCategories();    
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
            this.academicSessions.unshift({ id: "", year: "Select Academin Session" });
        }
    }

    //gradeCategory
    async getGradeCategories() 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
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
    async getGrades() 
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
    async getSyllabuses() 
    {
        try
        {
            this.syllabusClicked = true;
            let response = await this.commonService.getSyllabuses('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabuses = response.syllabuses;
                this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
                this.syllabusClicked = false;
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
    async getSubjects() 
    {
        try
        {
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
    async getChapters() 
    {
        try
        { 
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            let gradeId = this.gradeForm.get("grade").value;
            let syllabusId = this.syllabusForm.get("syllabus").value;
            let subjectId = this.subjectForm.get("subject").value
            if(syllabusId != undefined && syllabusId != "" && gradeCategoryId != undefined && gradeCategoryId != ""  && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "" )
            {
                this.chapterClicked = true;
                let response = await this.commonService.getChapters(gradeCategoryId, gradeId, syllabusId, subjectId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.chapters = response.chapters;
                    this.chapters.unshift({ id : "", name : "Select Chapter"});
                    this.chapterClicked = false;
                }
                else
                {
                    this.chapters = [];
                    this.chapters.unshift({ id : "", name : "Select Chapter"});
                    this.chapterClicked = false;
                }
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
            this.chapterClicked = false;
        }  
    }

    async getDocuments(formatFor : string) 
    {  
        try
        {
            this.commonSharedService.ExcelFormatDownload(formatFor);      
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    getChange(event : any)
    {
        this.isChecked = event.target.checked;
        if(this.isChecked)
        {
            this.addTopicForm.controls['name'].clearValidators();
            this.addTopicForm.controls['uploadFile'].addValidators(Validators.required);
            this.addTopicForm.controls['name'].updateValueAndValidity();
            this.addTopicForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addTopicForm.controls['uploadFile'].clearValidators();
            this.addTopicForm.controls['name'].addValidators(Validators.required);
            this.addTopicForm.controls['uploadFile'].updateValueAndValidity();
            this.addTopicForm.controls['name'].updateValueAndValidity();
        }
    }

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = event.target.files[0];
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                this.addTopicForm.get('selectedFile').setValue(file);
            }
            else
            {
                this.addTopicForm.get('selectedFile').setValue('');
            }
        }
        else
        {
            this.addTopicForm.get('selectedFile').setValue('');
        }
    }

    onEnterKey(event: any) 
    {
        if (event.key === 'Enter') 
        {
            if (this.names.length >= 11) 
            {
                this.names.splice(-1, 1); 
                this.showNotification("warning","Select Only 10 Names");
                this.addTopicForm.setValue(this.names);
            }
        }
    }    

    async saveTopic()
    {
        if(!this.saveClicked)
        {
            if(this.addTopicForm.valid && this.academicSessionForm.valid && this.chapterForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true; 
                this.addTopicForm.controls["applicableFromYear"].get("id").setValue(this.academicSessionForm.get("applicableFromYear").value);
                this.addTopicForm.controls["chapter"].get("id").setValue(this.chapterForm.get("chapter").value);
                
                try
                {
                    if(this.isChecked)
                    {
                        let formData = new FormData();
                        formData.append('applicableFromYear', JSON.stringify({ "id" : this.academicSessionForm.get('applicableFromYear').value }));
                        formData.append('gradeCategory', JSON.stringify({ "id" : this.gradeCategoryForm.get('gradeCategory').value }));
                        formData.append('grade', JSON.stringify({ "id" : this.gradeForm.get('grade').value }));
                        formData.append('syllabus', JSON.stringify({ "id" : this.syllabusForm.get('syllabus').value}));
                        formData.append('subject', JSON.stringify({ "id" : this.subjectForm.get('subject').value}));
                        formData.append('chapter', JSON.stringify({ "id" : this.chapterForm.get('chapter').value}));
                        formData.append('uploadFile', this.addTopicForm.get('selectedFile').value);
                        let response = await this.commonService.uploadTopics(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            let totalCount = response?.totalCount;
                            let saved = response?.insertCount;
                            let msg = '';
                            if(totalCount > 0)
                            {
                                msg = saved + "/" + totalCount + " Topics Are Saved Successfully. ";
                                let duplicateCount = response?.duplicateCount;
                                if(duplicateCount > 0)
                                {
                                    msg = msg + duplicateCount + " Topics Are Duplicate.";
                                }
                            }
                            else
                            {
                                msg = "No Record Found."
                            }
                            if( totalCount > 0)
                            {
                                this.showNotification("success", msg);
                            }
                            else
                            {
                                this.showNotification("warning", msg);
                            }
                            this.commonSharedService.topicListObject.next({result : "success"});
                            this.closeModal();
                        }                        
                    }
                    else
                    {
                        let allNames = [];
                        for(let i = 0; i < this.names.length; i++)
                        {
                            allNames.push(this.names[i]);
                        }
                        let tempJSON = {
                            "chapter" : { "id" : this.chapterForm.get('chapter').value },
                            "applicableFromYear" : { "id" : this.academicSessionForm.get('applicableFromYear').value },
                            "names" : [{ "name" : allNames.toString() }]
                        }
                        let response = await this.commonService.saveTopic(tempJSON).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "Topic Saved");
                            this.names = [];
                            this.isValidForm = false;
                            this.saveClicked = false;
                        }
                        else
                        {
                            this.showNotification("warning", "Topic Name Not Saved");
                        }
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
        this.commonSharedService.topicListObject.next({
            result : "success", 
            responseData : {
                gradeCategoryId : this.gradeCategoryForm.get('gradeCategory').value,
                gradeId : this.gradeForm.get('grade').value,
                syllabusId : this.syllabusForm.get('syllabus').value,
                subjectId : this.subjectForm.get('subject').value,
                chapterId : this.chapterForm.get('chapter').value
            }
        });
    }
}
