import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-chapter-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './chapter-edit.component.html',
    styleUrls: ['./chapter-edit.component.scss']
})
export class ChapterEditComponent {
    @Input() public modalParams;
    editChapterForm: FormGroup;
    applicableFromYearForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectForm : FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    subjectClicked : boolean;
    chapters: any;
    syllabuses : any[];
    gradeCategories : any[];
    grades : any[];
    academicSessions : any[];
    subjects : any[];

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router
    ) {
        this.academicSessions = [],
        this.gradeCategories = [],
        this.grades = [],
        this.syllabuses = [],
        this.subjects = []
    }

    ngOnInit() 
    {
        //get modal params
        this.chapters = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.syllabusClicked = false;
        this.subjectClicked = false;
        
        this.editChapterForm = this.formbuilder.group({
            id: [''],
            name: ['', Validators.required],
            applicableFromYear: this.formbuilder.group({ 'id' : ['']}),
            gradeCategory: this.formbuilder.group({ 'id' : ['']}),
            grade: this.formbuilder.group({ 'id' : ['']}),
            syllabus: this.formbuilder.group({ 'id' : ['']}),
            subject: this.formbuilder.group({ 'id' : ['']})
        });

        this.applicableFromYearForm = this.formbuilder.group({
            "applicableFromYear" : ['', [Validators.required]]
        });
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['', Validators.required]
        });
        this.subjectForm = this.formbuilder.group({
            'subject' : ['', Validators.required]
        });

        //Assign Form Data
        this.editChapterForm.patchValue(this.chapters);
        this.applicableFromYearForm.get("applicableFromYear").setValue(this.chapters.applicableFromYear.id);
        this.getAcademicSessions();
        this.gradeCategoryForm.get("gradeCategory").setValue(this.chapters.gradeCategory.id);
        this.getGradeCategories(this.chapters.gradeCategory);
        this.gradeForm.get("grade").setValue(this.chapters.grade.id);
        this.getGrades(this.chapters.grade); 
        this.syllabusForm.get("syllabus").setValue(this.chapters.syllabus.id);
        this.getSyllabuses(this.chapters.syllabus); 
        this.subjectForm.get('subject').setValue(this.chapters.subject.id);
        this.getSubjects(this.chapters.subject);
    }

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
                this.academicSessions.unshift({ id : "", year : "Select Applicable From Year" });
            }
            else
            {
                this.academicSessions = [];
                this.academicSessions.unshift({ id : "", year : "Select Applicable From Year" });
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
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
                    //here access deactive data
                    if(grade != '')
                    {
                        let filterGrade = this.grades.filter(tempGrade => parseInt(tempGrade.id) == parseInt(grade.id));
                        if(filterGrade.length == 0)
                        {
                            this.grades.push({ id : grade.id, name : grade.name });
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

    // syllabus
    async getSyllabuses(syllabus : any) 
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
                //here access deactivate data
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
                    // here access deactivate data
                    if(subject != '')
                    {
                        let filterSubject   =   this.subjects.filter(tempSubject => parseInt(tempSubject.id) == parseInt(subject.id));
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

    async saveChapter() 
    {
        if (!this.saveClicked) 
        {
            if (this.editChapterForm.valid && this.applicableFromYearForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid && this.subjectForm.valid)
            { 
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {
                    let tempJSON = {
                        "id" : this.chapters.id,
                        "subject" : { "id" : this.subjectForm.get('subject').value },
                        "applicableFromYear" : { "id" : this.applicableFromYearForm.get('applicableFromYear').value },
                        "name" : this.editChapterForm.get('name').value
                    }
                    let response = await this.commonService.updateChapter(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Chapter Updated");
                        this.commonSharedService.chapterListObject.next({ result: "success" });
                        this.closeModal();
                    }
                    else
                    {
                        this.showNotification("success", "Chapter Not Updated");
                    }
                }
                catch (e) 
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
