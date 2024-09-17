import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-chapter-add',
    standalone: true,
    imports: [CommonModule, SharedModule, TagInputModule],
    templateUrl: './chapter-add.component.html',
    styleUrls: ['./chapter-add.component.scss']
})
export class ChapterAddComponent 
{
    @Input() public modalParams;
    addChapterForm : FormGroup;
    applicableFromYearForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    subjectClicked : boolean;
    academicSessions : any[];
    gradeCategories : any[];
    grades : any[];
    syllabuses : any[];
    subjects : any[];
    names : string[] = [];    
    isChecked : boolean;

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
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.syllabusClicked = false;
        this.subjectClicked = false;
        this.isChecked = false;

        this.addChapterForm  = this.formbuilder.group({
            id:[''],
            name: ['', [Validators.required]],
            applicableFromYear : this.formbuilder.group({ 'id': [''] }),
            gradeCategory : this.formbuilder.group({ 'id': ['']}),
            grade : this.formbuilder.group({ 'id': [''] }),
            syllabus : this.formbuilder.group({ 'id': [''] }),
            subject : this.formbuilder.group({ 'id': ['']}),            
            uploadFile : [''],
            selectedFile : ['']
        });

        this.applicableFromYearForm = this.formbuilder.group({
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
            this.academicSessions.unshift({ id: "", year: "Select Applicable From Year" });
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
                    this.subjects.unshift({ id : "", name : "Select Subject"});
                    this.subjectClicked = false;
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

    onEnterKey(event: any) 
    {
        if (event.key === 'Enter') 
        {
            if (this.names.length >= 11) 
            {
                this.names.splice(-1, 1); 
                this.showNotification("warning","Select Only 10 Names");
                this.addChapterForm.setValue(this.names);
            }
        }
    }    

    getChange(event : any)
    {
        this.isChecked = event.target.checked;
        if(this.isChecked)
        {
            this.addChapterForm.controls['name'].clearValidators();
            this.addChapterForm.controls['uploadFile'].addValidators(Validators.required);
            this.addChapterForm.controls['name'].updateValueAndValidity();
            this.addChapterForm.controls['uploadFile'].updateValueAndValidity();
        }
        else
        {
            this.addChapterForm.controls['uploadFile'].clearValidators();
            this.addChapterForm.controls['name'].addValidators(Validators.required);
            this.addChapterForm.controls['uploadFile'].updateValueAndValidity();
            this.addChapterForm.controls['name'].updateValueAndValidity();
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

    fileChange(event : any)
    {
        if(event.target.files.length > 0)
        {
            const file = event.target.files[0];
            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            {
                this.addChapterForm.get('selectedFile').setValue(file);
            }
            else
            {
                this.addChapterForm.get('selectedFile').setValue('');
            }
        }
        else
        {
            this.addChapterForm.get('selectedFile').setValue('');
        }
    }

    async saveChapter()
    {
        if(!this.saveClicked)
        {
            if(this.addChapterForm.valid && this.applicableFromYearForm.valid  && this.subjectForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true; 
                this.addChapterForm.controls['applicableFromYear'].get('id').setValue(this.applicableFromYearForm.get('applicableFromYear').value);
                this.addChapterForm.controls['subject'].get("id").setValue(this.subjectForm.get('subject').value);
                try
                {
                    if(this.isChecked)
                    {
                        let formData = new FormData();
                        formData.append('applicableFromYear', JSON.stringify({ "id" : this.applicableFromYearForm.get('applicableFromYear').value }));
                        formData.append('gradeCategory', JSON.stringify({ "id" : this.gradeCategoryForm.get('gradeCategory').value }));
                        formData.append('grade', JSON.stringify({ "id" : this.gradeForm.get('grade').value }));
                        formData.append('syllabus', JSON.stringify({ "id" : this.syllabusForm.get('syllabus').value}));
                        formData.append('subject', JSON.stringify({ "id" : this.subjectForm.get('subject').value}));
                        formData.append('uploadFile', this.addChapterForm.get('selectedFile').value);
                        let response = await this.commonService.uploadChapters(formData).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            let totalCount = response?.totalCount;
                            let saved = response?.insertCount;
                            let msg = '';
                            if(totalCount > 0)
                            {
                                msg = saved + "/" + totalCount + " Chapter Are Saved Successfully. ";
                                let duplicateCount = response?.duplicateCount;
                                if(duplicateCount > 0)
                                {
                                    msg = msg + duplicateCount + " Chapter Are Duplicate.";
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
                            this.commonSharedService.chapterListObject.next({result : "success"});
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
                            "subject" : { "id" : this.subjectForm.get('subject').value },
                            "applicableFromYear" : { "id" : this.applicableFromYearForm.get('applicableFromYear').value },
                            "names" : [{ "name" : allNames.toString() }]
                        }
                        let response = await this.commonService.saveChapter(tempJSON).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "Chapter Name Saved");
                            this.names = [];
                            this.isValidForm = false;
                            this.saveClicked = false;
                        }
                        else
                        {
                            this.showNotification("warning", "Chapter Name Not Saved")
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
        this.commonSharedService.chapterListObject.next({
                result : "success",
                response : {
                    gradeCategoryId : this.gradeCategoryForm.get('gradeCategory').value,
                    gradeId : this.gradeForm.get('grade').value,
                    syllabusId : this.syllabusForm.get('syllabus').value,
                    subjectId : this.subjectForm.get('subject').value
                }
            });
    }
}
