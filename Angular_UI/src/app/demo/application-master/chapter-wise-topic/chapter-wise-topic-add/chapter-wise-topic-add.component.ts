import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

@Component({
    selector: 'app-chapter-wise-topic-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './chapter-wise-topic-add.component.html',
    styleUrls: ['./chapter-wise-topic-add.component.scss']
})
export class ChapterWiseTopicAppComponent 
{
    @Input() public modalParams;
    addChapterWiseSubjectForm: FormGroup;
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
    gradeWiseSyllabuses : any[];
    syllabusWiseSubjects : any[];
    subjectWiseChapters : any[];

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
        this.gradeWiseSyllabuses = [];
        this.syllabusWiseSubjects = [];
        this.subjectWiseChapters = [];
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

        this.addChapterWiseSubjectForm = this.formbuilder.group({
            id:[''],
            name: [''],
            academicSession : this.formbuilder.group({ 'id': [''] }),
            gradeCategory : this.formbuilder.group({ 'id': [''] }),
            grade : this.formbuilder.group({ 'id': [''] }),
            syllabus : this.formbuilder.group({ 'id': [''] }),      
            syllabusWiseSubject : this.formbuilder.group({ 'id': [''] }),      
            subjectWiseChapter : this.formbuilder.group({ 'id': [''] }),
            uploadFile : [''],
            selectedFile : ['']
        });

        this.academicSessionForm = this.formbuilder.group({
            'academicSession' : ['', Validators.required]
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
            'syllabusWiseSubject' : ['', Validators.required]
        });
        this.chapterForm = this.formbuilder.group({
            'subjectWiseChapter' : ['', Validators.required]
        });

        this.addChapterWiseSubjectForm.controls['uploadFile'].clearValidators();
        this.addChapterWiseSubjectForm.controls['name'].addValidators(Validators.required);
        this.addChapterWiseSubjectForm.updateValueAndValidity();
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
            this.academicSessions.unshift({ id: "", name: "Select Academin Session" });
        }
        else
        {
            this.academicSessions = [];
            this.academicSessions.unshift({ id: "", name: "Select Academin Session" });
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

    //get syllabus using grade wise syllabus
    async getGradeWiseSyllabuses() 
    {
        try
        {
            // this.syllabusForm.get("syllabus").setValue("");
            // this.subjectForm.get("syllabusWiseSubject").setValue("");
            // this.chapterForm.get("subjectWiseChapter").setValue("");
            // this.gradeWiseSyllabuses = [];
            // this.syllabusWiseSubjects = [];
            // this.subjectWiseChapters = [];
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            let gradeId = this.gradeForm.get("grade").value;
            if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            {
                this.syllabusClicked = true;
                let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
                    this.gradeWiseSyllabuses.unshift({ id : "", syllabus : {
                        id : "",
                        name : "Select Syllabus"
                        }
                    });
                    this.syllabusClicked = false;
                }
                else
                {
                    this.gradeWiseSyllabuses = [];
                    this.gradeWiseSyllabuses.unshift({ id : "", syllabus : {
                        id : "",
                        name : "Select Syllabus"
                        }
                    });
                    this.syllabusClicked = false;
                }
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
            // this.subjectForm.get("syllabusWiseSubject").setValue("");
            // this.chapterForm.get("subjectWiseChapter").setValue("");
            // this.syllabusWiseSubjects = [];
            // this.subjectWiseChapters = [];
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            let syllabusId = this.syllabusForm.get("syllabus").value;
            let gradeId = this.gradeForm.get("grade").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "" && syllabusId != undefined && syllabusId != "")
            {
                this.subjectClicked = true;
                let response = await this.commonService.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeCategoryId, gradeId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.syllabusWiseSubjects = response.syllabusWiseSubjects;
                    this.subjectClicked = false;
                    this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
                    this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
                }
                else
                {
                    this.syllabusWiseSubjects = [];
                    this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
                    this.subjectClicked = false;
                }  
            }
            else
            {
                this.syllabusWiseSubjects = [];
                this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
                this.subjectClicked = false;
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
            // this.chapterForm.get("subjectWiseChapter").setValue("");
            // this.subjectWiseChapters = [];
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            let syllabusId = this.syllabusForm.get("syllabus").value
            let gradeId = this.gradeForm.get("grade").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            let subjectId = this.subjectForm.get("syllabusWiseSubject").value
            if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeCategoryId != undefined && gradeCategoryId != ""  && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "" )
            {
                this.chapterClicked = true;
                let response = await this.commonService.getSubjectWiseChapters(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.subjectWiseChapters = response.subjectWiseChapters;
                    this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
                    this.chapterClicked = false;
                }
                else
                {
                    this.subjectWiseChapters = [];
                    this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
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
            this.addChapterWiseSubjectForm.controls['name'].clearValidators();
            this.addChapterWiseSubjectForm.controls['uploadFile'].addValidators(Validators.required);
            this.addChapterWiseSubjectForm.controls['name'].updateValueAndValidity();
            this.addChapterWiseSubjectForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addChapterWiseSubjectForm.controls['uploadFile'].clearValidators();
            this.addChapterWiseSubjectForm.controls['name'].addValidators(Validators.required);
            this.addChapterWiseSubjectForm.controls['uploadFile'].updateValueAndValidity();
            this.addChapterWiseSubjectForm.controls['name'].updateValueAndValidity();
        }
    }

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = event.target.files[0];
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                this.addChapterWiseSubjectForm.get('selectedFile').setValue(file);
            }
            else
            {
                this.addChapterWiseSubjectForm.get('selectedFile').setValue('');
            }
        }
        else
        {
            this.addChapterWiseSubjectForm.get('selectedFile').setValue('');
        }
    }

    async saveChapterWiseTopic()
    {
        if(!this.saveClicked)
        {
            if(this.addChapterWiseSubjectForm.valid && this.academicSessionForm.valid && this.chapterForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true; 
                this.addChapterWiseSubjectForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
                this.addChapterWiseSubjectForm.controls["subjectWiseChapter"].get("id").setValue(this.chapterForm.get("subjectWiseChapter").value);
                
                try
                {
                    if(this.isChecked)
                    {
                        let formData = new FormData();
                        formData.append('academicSession', JSON.stringify({ "id" : this.academicSessionForm.get('academicSession').value }));
                        formData.append('gradeCategory', JSON.stringify({ "id" : this.gradeCategoryForm.get('gradeCategory').value }));
                        formData.append('grade', JSON.stringify({ "id" : this.gradeForm.get('grade').value }));
                        formData.append('syllabus', JSON.stringify({ "id" : this.syllabusForm.get('syllabus').value}));
                        formData.append('subject', JSON.stringify({ "id" : this.subjectForm.get('syllabusWiseSubject').value}));
                        formData.append('chapter', JSON.stringify({ "id" : this.chapterForm.get('subjectWiseChapter').value}));
                        formData.append('uploadFile', this.addChapterWiseSubjectForm.get('selectedFile').value);
                        let response = await this.commonService.uploadChapterWiseTopics(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            let totalCount = response?.totalCount;
                            let saved = response?.insertCount;
                            let msg = '';
                            if(totalCount > 0)
                            {
                                msg = saved / totalCount + " Chapter Wise Topics Are Saved Successfully. ";
                                let duplicateCount = response?.duplicateCount;
                                if(duplicateCount > 0)
                                {
                                    msg = msg + duplicateCount + " Chapter Wise Topics Are Duplicate.";
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
                            this.commonSharedService.chapterWiseTopicListObject.next({result : "success"});
                            this.closeModal();
                        }                        
                    }
                    else
                    {
                        let response = await this.commonService.saveChapterWiseTopic(this.addChapterWiseSubjectForm.value).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "Chapter Wise Topic Saved");
                            this.commonSharedService.chapterWiseTopicListObject.next({result : "success"});
                            this.closeModal();
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
    }
}
